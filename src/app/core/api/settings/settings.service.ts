import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest, map, tap } from 'rxjs';
import { TranslateService } from '../translate/translate.service';
import { apiUrl } from '../config';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    public settings: any = null;
    public settings$ = new BehaviorSubject(null);

    public get userId() {
        return this.settings?.User_id || '';
    }

    public get defaultLanguage() {
        return this.settings?.Default_language || '';
    }

    constructor(
        private httpClient: HttpClient,
        private translate: TranslateService
    ) { }

    public getSettings(userId: string) {
        return combineLatest([
            this.httpClient.get(`${apiUrl}/api/users/${userId}/settings`),
            this.translate.getLanguages()
        ]).pipe(
            map(([settings, languages]: [any, any]) => ({
                ...settings,
                Languages: languages.filter((l: any) => settings.Languages.includes(l.code))
            })),
            tap(settings => this.settings$.next(settings)),
            tap((settings: any) => this.settings = settings)
        );
    }

    public saveSettings(userId: string, data: any) {
        return this.httpClient.post(`${apiUrl}/api/users/${userId}/settings`, data);
    }
}
