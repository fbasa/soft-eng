import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course'; 
import { Course, Enrollment } from '../../models/course.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-enrollment.html',
  styleUrls: ['./course-enrollment.css']
})
export class CourseEnrollment implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  studentEnrollments: Enrollment[] = [];
  searchTerm: string = '';
  selectedFilter: string = 'all';
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  message: string = '';
  currentStudentId: string = 'STU001'; 

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadStudentEnrollments();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.filteredCourses = courses;
      this.applyFilters();
    });
  }

  loadStudentEnrollments(): void {
    this.courseService.getStudentEnrollments(this.currentStudentId).subscribe(enrollments => {
      this.studentEnrollments = enrollments;
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
        course.instructor.toLowerCase().includes(search)
      );
    }

    // Apply availability filter
    if (this.selectedFilter === 'available') {
      filtered = filtered.filter(course => course.enrolled < course.capacity);
    } else if (this.selectedFilter === 'full') {
      filtered = filtered.filter(course => course.enrolled >= course.capacity);
    }

    this.filteredCourses = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  isEnrolled(courseId: string): boolean {
    return this.studentEnrollments.some(e => e.courseId === courseId);
  }

  isFull(course: Course): boolean {
    return course.enrolled >= course.capacity;
  }

  getAvailableSeats(course: Course): number {
    return course.capacity - course.enrolled;
  }

  enrollInCourse(courseId: string): void {
    if (this.isEnrolled(courseId)) {
      this.showError('You are already enrolled in this course');
      return;
    }

    this.courseService.enrollStudent(this.currentStudentId, courseId).subscribe(result => {
      if (result.success) {
        this.showSuccess(result.message);
        this.loadCourses();
        this.loadStudentEnrollments();
      } else {
        this.showError(result.message);
      }
    });
  }

  showSuccess(msg: string): void {
    this.message = msg;
    this.showSuccessMessage = true;
    this.showErrorMessage = false;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }

  showError(msg: string): void {
    this.message = msg;
    this.showErrorMessage = true;
    this.showSuccessMessage = false;
    setTimeout(() => {
      this.showErrorMessage = false;
    }, 3000);
  }

  getStatusClass(course: Course): string {
    const available = this.getAvailableSeats(course);
    if (available === 0) return 'status-full';
    if (available <= 5) return 'status-limited';
    return 'status-available';
  }

  getStatusText(course: Course): string {
    const available = this.getAvailableSeats(course);
    if (available === 0) return 'Full';
    if (available <= 5) return `${available} seats left`;
    return 'Available';
  }
}