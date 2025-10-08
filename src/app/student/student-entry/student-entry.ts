import { Component, OnInit, Input, HostListener } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Router, CanDeactivate, ActivatedRoute } from '@angular/router';
import { Student, StudentService } from '../../services/student-service';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Component({
  selector: 'app-student-entry',
  templateUrl: './student-entry.html',
  styleUrl: './student-entry.css',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class StudentEntry implements OnInit, CanComponentDeactivate {
  @Input() editId?: string;
  studentForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

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

  id: number = 0; // For edit mode

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {

    //capture query param id from the url
    this.route.queryParams
    .subscribe(params => {
      this.id = params['id'];
      if (this.id || this.id > 0){ 
        this.isEditMode=true;
      }else{
        this.isEditMode=false;
      }
    });

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
    if (!this.isEditMode) return;

    //bind form with existing student data
    this.studentService.GetStudentById(this.id)
    .subscribe((student:Student) => {
      this.studentForm = this.fb.group({
        firstName: [student.firstName, Validators.required],
        // ... populate other fields similarly
      });
    })
  }

  /** Spinner + prevent duplicate clicks + validation */
  onSubmit(): void {
    if (this.studentForm.invalid) {
      alert('Please fill in all required fields correctly.');
      this.markAllFieldsTouched();
      return;
    }

    if (this.isSubmitting) return; // Prevent duplicate clicks

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

    this.studentService
      .AddStudent(studentData)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res) => {
          console.log('✅ Student added successfully', res);
          // Keep spinner visible for a short UX delay
          setTimeout(() => {
            this.studentForm.reset();
            // Navigate to student list automatically
            this.router.navigate(['/studentlist']);
          }, 300); // 300ms delay
        },
        error: (err) => {
          console.error('❌ Add student error:', err);
          alert('Failed to add student. Please try again.');
        },
      });
  }

  /** Mark all fields touched to show errors */
  private markAllFieldsTouched() {
    Object.keys(this.studentForm.controls).forEach((field) => {
      this.studentForm.get(field)?.markAsTouched();
    });
  }

  /** Cancel button */
  onCancel(): void {
    if (
      this.studentForm.dirty &&
      !confirm('You have unsaved changes. Discard them?')
    ) {
      return;
    }
    this.studentForm.reset();
    this.isEditMode = false;
    this.editId = undefined;
  }

  /** Dirty guard for browser/tab close or navigate away */
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.studentForm.dirty && !this.isSubmitting) {
      $event.returnValue = true; // standard for most browsers
    }
  }

  /** Angular route guard canDeactivate */
  canDeactivate(): boolean {
    if (this.studentForm.dirty && !this.isSubmitting) {
      return confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
    }
    return true;
  }

  get formTitle(): string {
    return this.isEditMode ? 'EDIT STUDENT' : 'ADD NEW STUDENT';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Update Student' : 'Add Student';
  }
}
