import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentService, Student } from '../services/student-service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-student.html',
  styleUrls: ['./add-student.css'],
})
export class AddStudent implements OnInit {
  @Input() editId?: string; // For future edit functionality
  studentForm: FormGroup;
  isEditMode = false; // Currently only adding, edit mode can be implemented later
  isSubmitting = false; // to disable button during submission
  //static dropdown options - can be moved to a service or config later
  schools = ['High School', 'College', 'University', 'Other'];
  yearSemesters = [
    'Year 1 - Semester 1',
    'Year 1 - Semester 2',
    'Year 2 - Semester 1',
    'Year 2 - Semester 2',
    'Year 3 - Semester 1',
    'Year 3 - Semester 2',
    'Year 4 - Semester 1',
    'Year 4 - Semester 2',
  ];
  programs = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Arts & Humanities',
    'Natural Sciences',
  ];
  genders = ['', 'Male', 'Female'];

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private router: Router
  ) {
    //initialize reactive form with validation rules
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      dob: ['', Validators.required],
      gender: [''],
      school: ['', Validators.required],
      yearSemester: ['', Validators.required],
      program: ['', Validators.required],
      address: [''],
      emergencyContact: ['', Validators.required],
      emergencyPhone: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    // Currently no edit functionality implemented
    // TO DO: If editId is provided, fetch student data and populate form
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    this.isSubmitting = true;

    const studentData: Student = {
      firstName: this.studentForm.value.firstName,
      lastName: this.studentForm.value.lastName,
      emailAddress: this.studentForm.value.email,
      phoneNumber: this.studentForm.value.phone,
      dob: this.studentForm.value.dob,
      gender: this.studentForm.value.gender,
      school: this.studentForm.value.school,
      schoolYear: '2025',
      yearSemester: this.studentForm.value.yearSemester,
      programClass: this.studentForm.value.program,
      homeAddress: this.studentForm.value.address,
      emergencyContact: this.studentForm.value.emergencyContact,
      emergencyPhone: this.studentForm.value.emergencyPhone,
      notes: this.studentForm.value.notes,
      status: 'active',
    };

    console.log('Sending payload to API:', studentData);

    this.studentService
      .AddStudent(studentData)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res) => {
          console.log('✅ Student added successfully. API response:', res);
          this.studentForm.reset();

          // In AddStudent.ts
        this.router.navigate(['/students'], { queryParams: { refresh: 'true' } });

        },
        error: (error) => {
          console.error('❌ Add student error:', error);
          alert('Failed to add student. Please try again.');
        },
      });
  }

  onCancel(): void {
    this.studentForm.reset();
    this.isEditMode = false;
    this.editId = undefined;
    // // TODO: Optionally navigate back to student list or clear form
  }
  // Dynamic form title based on mode
  get formTitle(): string {
    return this.isEditMode ? 'EDIT STUDENT' : 'ADD NEW STUDENT';
  }
  get submitButtonText(): string {
    return this.isEditMode ? 'Update Student' : 'Add Student';
  }
}
