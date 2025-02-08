import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WebSocketComponent } from './web-socket.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: WebSocketComponent
    }
];

@NgModule({
    declarations: [
        WebSocketComponent
    ],
    providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
})
export class WebSocketModule { }
