import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './pages/guest.guard';
import { AuthGuard } from './pages/auth.guard';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
        canActivate: [GuestGuard]
    },
    {
        path: 'signup',
        loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupModule),
        canActivate: [GuestGuard]
    },
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'web-socket',
        loadChildren: () => import('./pages/web-socket/web-socket.module').then(m => m.WebSocketModule),
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
