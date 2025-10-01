import { Routes } from '@angular/router';
import {DashboardComponent } from './dashboard/dashboard';

import { Studentlist } from './student/studentlist/studentlist';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'studentlist', component: Studentlist}
];
