import { Routes } from '@angular/router';
<<<<<<< HEAD
import { DashboardComponent } from './pages/dashboard/dashboard';
import { SettingsComponent } from './pages/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent }
];

=======
import {DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent}
];
>>>>>>> 54d02952038d88ef586fdf1843a83ea230ac61b1
