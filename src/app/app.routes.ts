import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { DirtyGuard } from './guards/dirty-guard';
import { StudentEntry } from './student/student-entry/student-entry';
import { Studentlist } from './student/student-list/student-list';
import { StudentUpdateComponent } from './pages/student-update/student-update.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'app/student/update/:id', component: StudentUpdateComponent },
  { path: 'student-entry', component: StudentEntry, canDeactivate: [DirtyGuard] },
  { path: 'student-list', component: Studentlist },
  { path: '**', redirectTo: 'dashboard' }
];

