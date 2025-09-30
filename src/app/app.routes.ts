import { Routes } from '@angular/router';
import {DashboardComponent } from './dashboard/dashboard';
import { AddStudent } from './add-student/add-student';  


export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'add-student', component: AddStudent},
];
