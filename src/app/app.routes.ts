import { Routes } from '@angular/router';
import {DashboardComponent } from './dashboard/dashboard';
import { Studentlist } from './student/studentlist/studentlist';
import { StudentUpdateComponent } from './student-update/student-update';
import { DirtyGuard } from './guards/dirty-guard';
import { StudentEntry } from './student/student-entry/student-entry';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'student-entry', component: StudentEntry, canDeactivate: [DirtyGuard] },
    { path: 'student-list', component: Studentlist },
    { path: 'student-update', component: StudentUpdateComponent },
    { path: '**', redirectTo: 'dashboard' }
];
