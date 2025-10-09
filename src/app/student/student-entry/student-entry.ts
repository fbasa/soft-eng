import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker'; // ✅ Correct PrimeNG module
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Student, StudentService } from '../../services/student-service';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Component({
  selector: 'app-student-entry',
  templateUrl: './student-entry.html',
  styleUrls: ['./student-entry.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class StudentEntryComponent implements OnInit, CanComponentDeactivate {
  @Input() editId?: string;
  @ViewChild('firstNameInput') firstNameInput!: ElementRef;

  canDeactivate(): boolean {
    // You can add custom logic here, e.g., check if form is dirty
    return true;
  }

  studentForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  addMultiple = false;

  minDate = new Date(1900, 0, 1);
  maxDate = new Date();

  schools = ['High School', 'College', 'University', 'Other'];
  yearSemesters = ['1st', '2nd'];
  programs = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Arts & Humanities',
    'Natural Sciences',
  ];
  genders = ['', 'Male', 'Female'];

  id: number = 0;

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.id = +params['id'] || 0;
      this.isEditMode = !!this.id;
    });

    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      dob: [null, Validators.required],
      gender: [''],
      school: ['', Validators.required],
      yearSemester: ['', Validators.required],
      program: ['', Validators.required],
      address: ['', Validators.required],
      emergencyContact: ['', Validators.required],
      emergencyPhone: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    if (!this.isEditMode) return;

    this.studentService.GetStudentById(this.id).subscribe((student: Student) => {
      const dobDate = student.dob ? new Date(student.dob) : null;
      this.studentForm.patchValue({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.emailAddress,
        phone: student.phoneNumber,
        dob: dobDate,
        gender: student.gender,
        school: student.school,
        yearSemester: student.yearSemester,
        program: student.programClass,
        address: student.homeAddress,
        emergencyContact: student.emergencyContact,
        emergencyPhone: student.emergencyPhone,
        notes: student.notes,
      });
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      alert('Please fill in all required fields correctly.');
      this.markAllFieldsTouched();
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const dobString = this.studentForm.value.dob
      ? this.formatDateToString(this.studentForm.value.dob)
      : '';

    const studentData: Student = {
      firstName: this.studentForm.value.firstName,
      lastName: this.studentForm.value.lastName,
      emailAddress: this.studentForm.value.email,
      phoneNumber: this.studentForm.value.phone,
      dob: dobString,
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

    // ✅ Implements instructor's TODO comment (UpdateStudent if edit mode)
    const request = this.isEditMode
      ? this.studentService.UpdateStudent(this.id, studentData)
      : this.studentService.AddStudent(studentData);

    request
      ?.pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res: any) => {
          console.log('✅ Student saved successfully', res);
          this.showToast('success', 'Student saved successfully.');

          this.studentForm.reset({ dob: null });

          if (this.addMultiple && !this.isEditMode) {
            setTimeout(() => {
              this.firstNameInput.nativeElement.focus();
            }, 100);
          } else {
            setTimeout(() => {
              this.router.navigate(['/studentlist']);
            }, 300);
          }
        },
        error: (err: any) => {
          console.error('❌ Save student error:', err);
          this.showToast('error', 'Failed to save student. Please try again.');
        },
      });
  }

  private markAllFieldsTouched(): void {
    Object.keys(this.studentForm.controls).forEach((key) => {
      this.studentForm.controls[key].markAsTouched();
    });
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private showToast(severity: string, summary: string, detail?: string): void {
    this.messageService.add({
      severity,
      summary,
      detail,
      life: 3000,
    });
  }

  onAddMultipleChange(): void {}
}
