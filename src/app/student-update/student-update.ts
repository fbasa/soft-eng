import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-update',
  templateUrl: './student-update.html',
  standalone: true
})
export class StudentUpdateComponent {
  constructor(private router: Router) {}

  goToAddStudent() {
    this.router.navigate(['/add-student']); // ✅ Redirect only
  }
}