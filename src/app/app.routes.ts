import { Routes } from '@angular/router';
import {DashboardComponent } from './dashboard/dashboard';
import { AddStudent } from './add-student/add-student';  
import { Studentlist } from './student/studentlist/studentlist';
import { StudentUpdateComponent } from './student-update/student-update';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'add-student', component: AddStudent},
    {path: 'studentlist', component: Studentlist},
    {path: 'student-update', component: StudentUpdateComponent } 
];
