import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-update',
  standalone: true,             // important for Angular 20+
  imports: [
    CommonModule,               // needed for ngIf, ngFor, etc.
    ReactiveFormsModule,        // needed for formGroup
    RouterModule,               // needed for routerLink, ActivatedRoute
    HttpClientModule            // needed for HTTP requests
  ],
  templateUrl: './student-update.component.html'
})
export class StudentUpdateComponent {
  studentForm!: ReturnType<FormBuilder['group']>;
  studentId!: number;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      course: ['', Validators.required]
    });

    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.studentId) {
      this.studentService.getStudentById(this.studentId).subscribe(student => {
        this.studentForm.patchValue(student);
      });
    }
  }

  onSubmit(): void {
    if (this.studentForm.invalid) return;

    this.studentService.updateStudent({ id: this.studentId, ...this.studentForm.value })
      .subscribe(() => {
        alert(`Student ${this.studentId} updated successfully!`);
        this.router.navigate(['/app/student/list']); // optional
      });
  }
}
