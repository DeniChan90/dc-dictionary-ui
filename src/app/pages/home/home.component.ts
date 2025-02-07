import { Component, AfterViewInit, TemplateRef, inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, combineLatest, debounceTime, filter, forkJoin, map, merge, mergeMap, of, retry, switchMap, throwError } from 'rxjs';
import { apiUrl } from 'src/app/core/api/config';
import { SettingsService } from 'src/app/core/api/settings/settings.service';
import { TranslateService } from 'src/app/core/api/translate/translate.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
    public form = new UntypedFormGroup({
        search: new UntypedFormControl(null)
    });

    public translations: any = null;
    public filteredTranslations: any = null;
    public newTranslations: any[] = [];
    public selectedLang: string = '';
    public relatedTranslations: { [key: string]: { opened: boolean; values: any[] } } = {} as any;

    get search() {
        return this.form.controls['search'];
    }

    get userId() {
        return this.settingsService.settings.User_id;
    }
    get filter() {
        return { defaultLang: this.selectedLang }
    }

    constructor(
        public settingsService: SettingsService,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal
    ) {
        console.log('API URL <<', apiUrl)
        this.translateService.test().subscribe(r => console.log('...API TEST...', r))
        this.search.valueChanges.pipe(
            debounceTime(500),
            switchMap(val => {
                this.filteredTranslations = this.translations?.filter((t: any) => t.text.includes(val));
                this.newTranslations = [];

                if (!this.filteredTranslations.length && !!val) {
                    return this.getTranslationRequest();
                }

                return of([]);
            }),
            map((val: any) => val.map((translation: any) => (
                {
                    ...translation,
                    Lang: this.settingsService.settings.Languages.find((l: any) => l.code === translation.Lang)
                }
            )))
        ).subscribe(val => {
            this.newTranslations = val;
            if (val.length) {
                this.newTranslations.push({
                    Lang: this.settingsService.settings.Languages.find((l: any) => l.code === this.selectedLang),
                    Text: this.search.value
                })
            }
            //console.log('set . ', this.settingsService.settings)
        });

        this.route.queryParams.pipe(
            filter((params: any) => !!params.lang)
        ).subscribe((params: any) => {
            this.selectedLang = params.lang;
        })

    }

    public ngAfterViewInit(): void {
        this.settingsService.settings$.pipe(filter(s => !!s)).subscribe((settings: any) => {
            this.refreshTranslations(this.selectedLang || settings.Default_language, settings.User_id);
            this.selectedLang = this.selectedLang || settings.Default_language;
            console.log('subscription ...', this.selectedLang)
        })
    }

    translate() {
        console.log('value....')
    }

    public refreshTranslations(lang: string = this.settingsService.defaultLanguage, userId: string = this.settingsService.userId) {
        this.translations = null;
        this.newTranslations = [];
        this.translateService.getTranslations(
            userId,
            lang
        ).subscribe((translations: any) => {
            this.translations = translations || [];
            this.search.setValue('');
            console.log('translations >>', translations)
        })
    }

    public selectLanguage(lang: any) {
        this.selectedLang = lang;
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { lang },
                queryParamsHandling: 'merge'
            }
        );

        this.refreshTranslations(lang);
    }

    public saveNewTranslations(): void {
        console.log('SAVE...', this.selectedLang)
        console.log('SAVE...', this.newTranslations)
        //return
        this.translateService.saveTranslations(
            this.settingsService.settings.User_id,
            this.newTranslations,
        ).subscribe(res => this.refreshTranslations(this.selectedLang))
    }

    public searchTranslations(): void {
        this.getTranslationRequest().pipe(
            map((val: any) => val.map((translation: any) => (
                {
                    ...translation,
                    Lang: this.settingsService.settings.Languages.find((l: any) => l.code === translation.Lang)
                }
            )))
        ).subscribe(val => {
            this.newTranslations = val;
            if (val.length) {
                this.newTranslations.push({
                    Lang: this.settingsService.settings.Languages.find((l: any) => l.code === this.selectedLang),
                    Text: this.search.value
                })
            }
        })
    }

    public getRelatedTranslations(wordId: string): void {
        if (this.relatedTranslations[wordId]) {
            this.relatedTranslations[wordId].opened = !this.relatedTranslations[wordId].opened;
        } else {
            this.translateService.getRelatedTranslations(this.settingsService.userId, wordId).pipe(
                map((val: any) => val.map((translation: any) => (
                    {
                        ...translation,
                        lang: this.settingsService.settings.Languages.find((l: any) => l.code === translation.lang)
                    }
                )))
            ).subscribe((translations: any) => {
                this.relatedTranslations[translations[0].word_id] = {
                    opened: true,
                    values: translations
                };
                console.log('....', translations)
            })
        }
    }

    public deleteTranslations(translation: any, modal: TemplateRef<any>) {
        this.modalService.open(modal).result.then(
            _ => {
                this.translateService.deleteTranslations(translation.user_id, translation.word_id)
                    .subscribe(r => {
                        console.log('deleted ..', r)
                        this.refreshTranslations(this.selectedLang);
                    })
            },
            _ => { }
        );
    }

    private getTranslationRequest(): Observable<any> {
        const request = (this.settingsService.settings?.Languages || [])
            .map((l: any) => l.code)
            .filter((l: any) => l !== this.selectedLang)
            .map((l: any) => this.translateService.translate({
                From: this.selectedLang,
                To: l,
                Text: this.search.value
            }).pipe(
                catchError(e => throwError(e)),
                retry(3),
                // filter((val: any) => !!val?.length),
                //  map((val: any) => val.map((translation: any) => (
                //     {
                //         ...translation,
                //         Lang: this.settingsService.settings.Languages.find((l: any) => l.code === translation.Lang)
                //     }
                // ))),
            ));

        return forkJoin(request);
    }
}

