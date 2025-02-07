import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
    {
        path: '',
        component: SignupComponent
    }
];

@NgModule({
    declarations: [
        SignupComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbDropdownModule,
        RouterModule.forChild(routes)
    ]
})
export class SignupModule { }
