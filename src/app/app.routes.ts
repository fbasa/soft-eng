import { Routes } from '@angular/router';
import { StudentUpdateComponent } from './pages/student-update/student-update.component';

export const routes: Routes = [
  { path: '', redirectTo: '/app/student/update/2', pathMatch: 'full' },
  { path: 'app/student/update/:id', component: StudentUpdateComponent }
];

