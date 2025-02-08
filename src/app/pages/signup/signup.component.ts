import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/api/auth/auth.service';
import { SettingsService } from 'src/app/core/api/settings/settings.service';
import { TranslateService } from 'src/app/core/api/translate/translate.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
    public form = new UntypedFormGroup({
        First_name: new UntypedFormControl(null, Validators.required),
        Last_name: new UntypedFormControl(null, Validators.required),
        Email: new UntypedFormControl(null, Validators.required),
        Password: new UntypedFormControl(null, Validators.required)
    });

    public languagesForm = new UntypedFormGroup({
        Default_language: new UntypedFormControl(null, Validators.required),
        Languages: new UntypedFormControl([])
    });

    public languages: any = [];
    public selectedLanguages: any = [];
    public defaultLanguage: any;
    public signupError: any = null;

    get submitDisabled() {
        const form = this.form.value;
        return this.authService.loading || this.selectedLanguages.length < 2 || !this.defaultLanguage ||
            !form.First_name || !form.Last_name || !form.Email || !form.Password;
    }

    constructor(
        public authService: AuthService,
        private translateService: TranslateService,
        private settingsService: SettingsService,
        private router: Router
    ) {
        this.translateService.getLanguages().subscribe((languages: any) => {
            this.languages = languages.sort((a: any, b: any) => {
                return a.name > b.name ? 1 : -1;
            });
        });
    }

    signup() {
        const langData = this.languagesForm.value;

        this.authService.signup({ ...this.form.value, User_type: "ADMIN" }).pipe(
            catchError(e => {
                this.signupError = e.error.error;

                setTimeout(() => this.signupError = null, 3000);
                console.log('...', e)
                return throwError(e);
            }),
            switchMap((tokenData: any) => {
                localStorage.setItem('tokenData', JSON.stringify(tokenData));
                return this.settingsService.saveSettings(tokenData.ID, langData);
            })
        ).subscribe(() => this.router.navigateByUrl('/'))
    }

    public toggleLanguage(e: any): void {
        const lang = e.target.value;
        const languages = this.languagesForm.controls['Languages'].value;
        const value = languages.includes(lang) ? languages.filter((l: string) => l !== lang) : [...languages, lang];

        this.selectedLanguages = this.languages.filter((l: any) => value.includes(l.code));
        this.languagesForm.controls['Languages'].setValue(value);

        if (this.defaultLanguage?.code === lang) {
            this.defaultLanguage = null;
        }
    }

    public setDefaultLanguage(language: any) {
        this.languagesForm.controls['Default_language'].setValue(language.code);
        this.defaultLanguage = language;
    }

    public toLogin(): void {
        window.scrollTo(0, 0);
        this.router.navigateByUrl('/login');
    }
}
