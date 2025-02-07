import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../core/api/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class GuestGuard {
    constructor(private router: Router, private auth: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        return this.auth.tokenData ? this.router.parseUrl('/') : true;
    }
}

