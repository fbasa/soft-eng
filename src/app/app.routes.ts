import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { DirtyGuard } from './guards/dirty-guard';
import { StudentEntry } from './student/student-entry/student-entry';
import { Studentlist } from './student/student-list/student-list';
import { CourseEnrollment } from './course/course-enrollment/course-enrollment';
import { CourseRoster } from './course/course-roster/course-roster';
import { CourseManagement } from './course/course-management/course-management';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'student-entry', component: StudentEntry, canDeactivate: [DirtyGuard] },
    { path: 'student-list', component: Studentlist },
    { path: 'studentlist', component: Studentlist },
    { path: 'course-enrollment', component: CourseEnrollment },  
    { path: 'course-roster', component: CourseRoster },          
    { path: 'course-management', component: CourseManagement },  
    { path: '**', redirectTo: 'dashboard' }  
];