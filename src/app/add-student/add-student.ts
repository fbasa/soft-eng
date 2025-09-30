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
  genders = ['', 'Male', 'Female', 'Other', 'Prefer not to say'];

 
  constructor(private fb: FormBuilder, private studentService: StudentService) {
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
      ...this.studentForm.value,
      status: 'active', // Default status on add
    };
     // Call service to add student
    this.studentService
      .AddStudent(studentData)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          alert('Student added successfully!');
          this.studentForm.reset();
          // // TODO: Here you might want to notify the student list component to refresh
          // // or navigate to the student list page to see the new student
        },
        error: (error) => {
          console.error('Add student error:', error);
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
