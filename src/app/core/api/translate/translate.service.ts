import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { apiUrl } from '../config';

@Injectable({
    providedIn: 'root'
})
export class TranslateService {
    public loading: boolean = false;
    public loadingRelated: boolean = false;

    constructor(private httpClient: HttpClient) { }
    test() {
        return this.httpClient.get('https://dc-dictionary-api-26fa33a06afa.herokuapp.com/api');
    }

    public getLanguages() {
        return this.httpClient.get(`${apiUrl}/api/available-languages`);
    }

    public translate(data: any) {
        this.loading = true;
        return this.httpClient.post(`${apiUrl}/api/translate/`, data).pipe(
            finalize(() => this.loading = false)
        );
    }

    public getTranslations(userId: string, lang: string = '') {
        this.loading = true;
        return this.httpClient.get(`${apiUrl}/api/translate/${userId}/translations?lang=${lang}`).pipe(
            finalize(() => setTimeout(() => this.loading = false, 500))
        );

    }

    public getRelatedTranslations(userId: string, wordId: string) {
        this.loadingRelated = true
        return this.httpClient.get(`${apiUrl}/api/translate/${userId}/related-translations?word_id=${wordId}`).pipe(
            finalize(() => this.loadingRelated = false)
        )
    }

    public saveTranslations(userId: string, translations: any) {
        translations = translations.map((t: any) => ({ ...t, Lang: t.Lang.code || t }));

        return this.httpClient.post(`${apiUrl}/api/translate/${userId}/translations`, translations).pipe(
            finalize(() => this.loading = false)
        );

    }

    public deleteTranslations(userId: string, wordId: string) {
        this.loading = true;

        return this.httpClient.delete(`${apiUrl}/api/translate/${userId}/translations/${wordId}`);
    }
}
