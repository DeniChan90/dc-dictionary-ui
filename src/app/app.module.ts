import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './pages/login/login.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { InterceptorService } from './core/api/interceptor/interceptor.service';
import { LayoutModule } from './features/layout/layout.module';
import { WebSocketModule } from './pages/web-socket/web-socket.module';



@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        LoginModule,
        WebSocketModule,
        LayoutModule,
        NgbModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
