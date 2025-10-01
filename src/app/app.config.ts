import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { DashboardComponent } from './dashboard/dashboard';
import { AddStudent } from './add-student/add-student';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'add-student',
    component: AddStudent,
  },
  {
    path: '',
    redirectTo: 'add-student',
    pathMatch: 'full',
  },
];
// modified by reginald
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
