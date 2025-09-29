import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  phone?: string;
  dob: string;
  gender?: string;
  school: string;
  yearSemester: string;
  program: string;
  address?: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './add-student.html',
  styleUrls: ['./add-student.css']
})
export class AddStudent implements OnInit {
  @Input() editId?: string; // For edit mode
  studentForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  schools = ['High School', 'College', 'University', 'Other'];
  yearSemesters = [
    'Year 1 - Semester 1', 'Year 1 - Semester 2',
    'Year 2 - Semester 1', 'Year 2 - Semester 2',
    'Year 3 - Semester 1', 'Year 3 - Semester 2',
    'Year 4 - Semester 1', 'Year 4 - Semester 2'
  ];
  programs = ['Computer Science', 'Engineering', 'Business Administration', 'Arts & Humanities', 'Natural Sciences'];
  genders = ['', 'Male', 'Female', 'Other', 'Prefer not to say'];

  // For now, using localStorage as mock DB
  private students: Student[] = JSON.parse(localStorage.getItem('students') || '[]');

  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      studentId: ['', Validators.required],
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
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.editId) {
      this.isEditMode = true;
      this.loadStudentForEdit(this.editId);
    }
  }

  private loadStudentForEdit(id: string): void {
    const student = this.students.find(s => s.id === id);
    if (student) {
      this.studentForm.patchValue(student);
    }
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.showToast('Please fill in all required fields correctly.', true);
      return;
    }

    this.isSubmitting = true;
    const formValue = this.studentForm.value;

    const student: Student = {
      id: this.isEditMode ? this.editId! : Date.now().toString(),
      ...formValue,
      status: 'active',
      createdAt: new Date()
    };

    // TODO: Replace this localStorage logic with API call to backend
    // Example:
    // this.studentService.AddStudent(student).subscribe(...);
    if (this.isEditMode) {
      const index = this.students.findIndex(s => s.id === this.editId);
      if (index !== -1) {
        this.students[index] = student;
        this.showToast('Student updated successfully!');
      }
    } else {
      this.students.push(student);
      this.showToast('Student added successfully!');
    }

    localStorage.setItem('students', JSON.stringify(this.students));
    this.resetForm();
    this.isSubmitting = false;
  }

  private resetForm(): void {
    this.studentForm.reset();
    this.isEditMode = false;
    this.editId = undefined;
  }

  onCancel(): void {
    this.resetForm();
    // TODO: Add navigation or event emit to go back to list or previous page
  }

  private showToast(message: string, isError = false): void {
    const type = isError ? 'ERROR' : 'SUCCESS';
    alert(`${type}: ${message}`);
    // TODO: Replace alert with a proper toast notification service
  }

  get formTitle(): string {
    return this.isEditMode ? 'Edit Student' : 'Add New Student';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Update Student' : 'Add Student';
  }
}
