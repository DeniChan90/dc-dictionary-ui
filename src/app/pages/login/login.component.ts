import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AuthService } from 'src/app/core/api/auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public form = new UntypedFormGroup({
        Email: new UntypedFormControl(null, Validators.required),
        Password: new UntypedFormControl(null, Validators.required)
    });

    public loginError: string | null = null;

    get submitDisabled() {
        const form = this.form.value;
        return this.authService.loading || !form.Email || !form.Password;
    }

    constructor(public authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.authService.test().subscribe(r => {
            console.log('response OK ..', r)
        })
    }

    public login(): void {
        this.authService.login(this.form.value).pipe(
            catchError(e => {
                this.loginError = e.error.error;

                setTimeout(() => this.loginError = null, 2000);
                return of(e);
            })
        ).subscribe(tokenData => {
            localStorage.setItem('tokenData', JSON.stringify(tokenData));
            this.router.navigateByUrl('/');
            console.log('response..', tokenData)
        })
    }
}
