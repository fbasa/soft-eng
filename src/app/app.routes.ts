import { Routes } from '@angular/router';
import {DashboardComponent } from './dashboard/dashboard';
import { AddStudent } from './add-student/add-student';  
import { StudentUpdateComponent } from './student-update/student-update';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'add-student', component: AddStudent},
      { path: 'student-update', component: StudentUpdateComponent } 
];
