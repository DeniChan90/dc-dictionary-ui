import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { apiUrl } from '../config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public loading = false;

    get tokenData() {
        return localStorage.getItem('tokenData') ? JSON.parse(localStorage.getItem('tokenData') || '') : null;
    }

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    test() {
        console.log('ENV .', environment)
        return this.httpClient.get(`${apiUrl}/api`);
    }

    public signup(data: any) {
        this.loading = true;
        return this.httpClient.post(`${apiUrl}/api/auth/signup`, data).pipe(
            finalize(() => this.loading = false)
        );
    }

    public login(data: any) {
        this.loading = true;
        return this.httpClient.post(`${apiUrl}/api/auth/login`, data).pipe(
            finalize(() => this.loading = false)
        );
    }

    public logout() {
        localStorage.removeItem('tokenData');
        this.router.navigateByUrl('/login');
    }
}
