import { Routes } from '@angular/router';
import {DashboardComponent } from './dashboard/dashboard';
import { DirtyGuard } from './guards/dirty-guard';
import { StudentEntry } from './student/student-entry/student-entry';
import { Studentlist } from './student/student-list/student-list';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'studentlist', component: Studentlist },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'student-entry', component: StudentEntry, canDeactivate: [DirtyGuard] },
    { path: 'student-list', component: Studentlist },
    { path: '**', redirectTo: 'dashboard' }
];
