import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentUpdateComponent } from './pages/student-update/student-update.component';

// Routes configuration
const routes: Routes = [
  { path: '', redirectTo: '/app/student/update/2', pathMatch: 'full' }, // default redirect for testing Student 2
  { path: 'app/student/update/:id', component: StudentUpdateComponent },
  // Optional: You can add the list page route if you want Back to List button to work
  // { path: 'app/student/list', component: StudentListComponent },
  // { path: '**', redirectTo: '/app/student/update/2' } // fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
