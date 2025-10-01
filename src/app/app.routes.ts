import { Routes } from '@angular/router';
import {DashboardComponent } from './dashboard/dashboard';
import { AddStudent } from './add-student/add-student';  

import { Studentlist } from './student/studentlist/studentlist';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent}
];
