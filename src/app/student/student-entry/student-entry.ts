import { Component, OnInit, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { DatePickerModule } from 'primeng/datepicker'; 
import { ToastModule } from 'primeng/toast'; 
import { MessageService } from 'primeng/api'; 
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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, 
    DatePickerModule, 
    ToastModule,
  ],
  standalone: true,
  providers: [MessageService], 
})
export class StudentEntry implements OnInit, CanComponentDeactivate {
  @Input() editId?: string;
  @ViewChild('firstNameInput') firstNameInput!: ElementRef; 
  studentForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  addMultiple = false; // Default unchecked for Add Multiple checkbox

  minDate = new Date(1900, 0, 1); // Earliest DOB
  maxDate = new Date(); // No future dates

  schools: string[] = [];
  yearSemesters: string[]= [];
  programs: string[] = [];
  genders: string[] = [];

  id: number = 0; // For edit mode

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private messageService: MessageService, // For toasts
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Capture query param id from the URL (fix: convert to number)
    this.route.queryParams.subscribe(params => {
      this.id = +params['id'] || 0; // Safe conversion to number
      this.isEditMode = !!this.id; // True if id > 0
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
      address: ['',Validators.required],
      emergencyContact: ['', Validators.required],
      emergencyPhone: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.studentService.GetGender().subscribe({
      next: (data) => {this.genders = data;},
      error: (err) => console.error('❌ Error fetching', err),
    });

    this.studentService.GetSchool().subscribe({
      next: (data) => {this.schools = data;},
      error: (err) => console.error('❌ Error fetching', err),
    });

    if (!this.isEditMode) return;

    // Bind form with existing student data (full population)
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

  /** Spinner + prevent duplicate clicks + validation + Add Multiple Logic + Toast */
  onSubmit(): void {
    if (this.studentForm.invalid) {
      alert('Please fill in all required fields correctly.');
      this.markAllFieldsTouched();
      return;
    }


    if (this.isSubmitting) return; // Prevent duplicate clicks

    this.isSubmitting = true;

    // Convert DOB Date to string (YYYY-MM-DD) for Student model
    const dobString = this.studentForm.value.dob
      ? this.formatDateToString(this.studentForm.value.dob)
      : '';

    const studentData: Student = {
      id: this.id,
      firstName: this.studentForm.value.firstName,
      lastName: this.studentForm.value.lastName,
      emailAddress: this.studentForm.value.email,
      phoneNumber: this.studentForm.value.phone,
      dob: dobString, // Formatted string
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

    // Always use AddStudent (for now; edit mode creates new—implement UpdateStudent(id, student) in service for proper edit)
    // TODO: For full edit support: const request = this.isEditMode ? this.studentService.UpdateStudent(this.id, studentData) : this.studentService.AddStudent(studentData);
    const request = this.isEditMode 
      ? this.studentService.UpdateStudent(this.id, studentData)
      : this.studentService.AddStudent(studentData); // Observable<Student> - ensures pipe works

    request
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res: any) => { // Explicit type to fix implicit any
          console.log('✅ Student saved successfully', res);
          this.showToast('success', this.isEditMode ? 'Student updated!' : 'Student saved.'); // Always show toast

         
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
          alert('Failed to save student. Please try again.');
        },
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
  onAddMultipleChange(): void {
    // e.g., Could add validation or UI changes here
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
    this.studentForm.reset({ dob: null });
    this.isEditMode = false;
    this.addMultiple = false; 
    this.editId = undefined;
  }

  /** Dirty guard for browser/tab close or navigate away */
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.studentForm.dirty && !this.isSubmitting) {
      $event.returnValue = true; // Standard for most browsers
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
