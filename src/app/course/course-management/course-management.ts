import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course';
import { Course } from '../../models/course.model';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PopoverModule } from 'primeng/popover';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-course-management',
  standalone: true,  
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule,
    TooltipModule,
    PopoverModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule
  ],
  templateUrl: './course-management.html',
  styleUrl: './course-management.css',
  providers: [ConfirmationService, MessageService]
})
export class CourseManagement implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  
  // Dialog states
  showAddDialog: boolean = false;
  showEditDialog: boolean = false;
  selectedCourse: Course | null = null;
  
  // Form model
  courseForm: Partial<Course> = {
    courseName: '',
    courseCode: '',
    instructor: '',
    capacity: 0,
    enrolled: 0,
    schedule: '',
    description: ''
  };

  constructor(
    private courseService: CourseService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.filteredCourses = [...this.courses];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
        this.loading = false;
        this.showError('Failed to load courses');
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.courses];

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.courseName.toLowerCase().includes(search) ||
        course.courseCode.toLowerCase().includes(search) ||
        course.instructor.toLowerCase().includes(search) ||
        course.description?.toLowerCase().includes(search)
      );
    }

    this.filteredCourses = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  openAddDialog(): void {
    this.courseForm = {
      id: '',
      courseName: '',
      courseCode: '',
      instructor: '',
      capacity: 0,
      enrolled: 0,
      schedule: '',
      description: ''
    };
    this.showAddDialog = true;
  }

  openEditDialog(course: Course): void {
    this.selectedCourse = course;
    // Copy course data but don't allow editing enrolled count
    this.courseForm = {
      courseName: course.courseName,
      courseCode: course.courseCode,
      instructor: course.instructor,
      capacity: course.capacity,
      schedule: course.schedule,
      description: course.description
    };
    this.showEditDialog = true;
  }

  closeDialogs(): void {
    this.showAddDialog = false;
    this.showEditDialog = false;
    this.selectedCourse = null;
    this.courseForm = {
      courseName: '',
      courseCode: '',
      instructor: '',
      capacity: 0,
      enrolled: 0,
      schedule: '',
      description: ''
    };
  }

  validateForm(): boolean {
    if (!this.courseForm.courseName?.trim()) {
      this.showError('Course name is required');
      return false;
    }
    if (!this.courseForm.courseCode?.trim()) {
      this.showError('Course code is required');
      return false;
    }
    if (!this.courseForm.instructor?.trim()) {
      this.showError('Instructor is required');
      return false;
    }
    if (!this.courseForm.capacity || this.courseForm.capacity <= 0) {
      this.showError('Capacity must be greater than 0');
      return false;
    }
    if (!this.courseForm.schedule?.trim()) {
      this.showError('Schedule is required');
      return false;
    }
    
    // Validate capacity for existing courses - cannot be less than enrolled
    if (this.selectedCourse && this.showEditDialog) {
      if (this.courseForm.capacity! < this.selectedCourse.enrolled) {
        this.showError(`Capacity cannot be less than current enrollments (${this.selectedCourse.enrolled})`);
        return false;
      }
    }
    
    return true;
  }

  saveCourse(): void {
    if (!this.validateForm()) {
      return;
    }

    if (this.showAddDialog) {
      // Generate a unique ID for new courses
      this.courseForm.id = this.courseForm.courseCode || `COURSE${Date.now()}`;
      
      this.courseService.addCourse(this.courseForm as Course).subscribe({
        next: (result) => {
          if (result.success) {
            this.showSuccess(result.message);
            this.loadCourses();
            this.closeDialogs();
          } else {
            this.showError(result.message);
          }
        },
        error: (err) => {
          console.error('Failed to add course:', err);
          this.showError('Failed to add course');
        }
      });
    } else if (this.showEditDialog && this.selectedCourse) {
      this.courseService.updateCourse(this.selectedCourse.id, this.courseForm).subscribe({
        next: (result) => {
          if (result.success) {
            this.showSuccess(result.message);
            this.loadCourses();
            this.closeDialogs();
          } else {
            this.showError(result.message);
          }
        },
        error: (err) => {
          console.error('Failed to update course:', err);
          this.showError('Failed to update course');
        }
      });
    }
  }

  confirmDelete(course: Course): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${course.courseCode} - ${course.courseName}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCourse(course.id);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Deletion cancelled',
          life: 2000
        });
      }
    });
  }

  deleteCourse(courseId: string): void {
    this.loading = true;
    this.courseService.deleteCourse(courseId).subscribe({
      next: (result) => {
        if (result.success) {
          this.showSuccess(result.message);
          this.loadCourses();
        } else {
          this.showError(result.message);
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Failed to delete course:', err);
        this.showError('Failed to delete course');
        this.loading = false;
      }
    });
  }

  getStatusClass(course: Course): string {
    const available = course.capacity - course.enrolled;
    if (available === 0) return 'status-full';
    if (available <= 5) return 'status-limited';
    return 'status-available';
  }

  getStatusText(course: Course): string {
    const available = course.capacity - course.enrolled;
    if (available === 0) return 'Full';
    if (available <= 5) return `${available} seats left`;
    return 'Available';
  }

  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000
    });
  }
}