import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { finalize } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService {

    constructor(private auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const data = localStorage.getItem('tokenData');
        const token = !!data ? JSON.parse(data).Token : null;

        if (!!token) {
            req = req.clone({ headers: req.headers.set('token', token) });
        }

        return next.handle(req).pipe(
            finalize(() => { })
        );
    }
}
