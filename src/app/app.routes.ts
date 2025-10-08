import { Routes } from '@angular/router';
import {DashboardComponent } from './dashboard/dashboard';
import { AddStudent } from './add-student/add-student';  
import { Studentlist } from './student/studentlist/studentlist';
import { StudentUpdateComponent } from './student-update/student-update';
import { DirtyGuard } from './guards/dirty-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'add-student', component: AddStudent, canDeactivate: [DirtyGuard] },
    { path: 'studentlist', component: Studentlist },
    { path: 'student-update', component: StudentUpdateComponent },
    { path: '**', redirectTo: 'dashboard' }
];
