import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { LoaderService } from '../loader/loader.service';
import { finalize, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService {

    constructor(private auth: AuthService, private loader: LoaderService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        //this.loader.loading$.next(true)
        const data = localStorage.getItem('tokenData');
        const token = !!data ? JSON.parse(data).Token : null;

        console.log('request ===> ', token)
        if (!!token) {
            req = req.clone({ headers: req.headers.set('token', token) });
        }

        return next.handle(req).pipe(
            finalize(() => {
                //setTimeout(() => this.loader.loading$.next(false))
            })
        );
    }
}
