import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course';
import { StudentService } from '../../services/student-service';
import { Course, Enrollment } from '../../models/course.model';
import { TableModule } from 'primeng/table';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
}

@Component({
  selector: 'app-course-roster',
  standalone: true,  
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './course-roster.html',
  styleUrl: './course-roster.css'
})
export class CourseRoster implements OnInit {
  courses: Course[] = [];
  enrollments: Enrollment[] = [];
  students: Student[] = [];
  selectedCourseId: string = '';
  selectedCourse: Course | undefined;
  loading: boolean = false;

  constructor(
    private courseService: CourseService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadAllStudents();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  loadAllStudents(): void {
    this.studentService.GetStudents().subscribe(response => {
      // Map the student data from the API to our Student interface
      this.students = response.items.map((item: any) => ({
        id: item.id?.toString() || '',
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        email: item.emailAddress || '',
        program: item.programClass || ''
      }));
    });
  }

  onCourseChange(): void {
    if (this.selectedCourseId) {
      this.loading = true;
      this.selectedCourse = this.courses.find(c => c.id === this.selectedCourseId);
      
      this.courseService.getCourseRoster(this.selectedCourseId).subscribe(enrollments => {
        this.enrollments = enrollments;
        this.loading = false;
      });
    } else {
      this.selectedCourse = undefined;
      this.enrollments = [];
    }
  }

  getStudentName(studentId: string): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  }

  getStudentEmail(studentId: string): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? student.email : 'N/A';
  }

  getStudentProgram(studentId: string): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? student.program : 'N/A';
  }

  getAvailableSeats(): number {
    if (!this.selectedCourse) return 0;
    return this.selectedCourse.capacity - this.selectedCourse.enrolled;
  }

  getSeatStatusClass(): string {
    const available = this.getAvailableSeats();
    if (available === 0) return 'seats-full';
    if (available <= 5) return 'seats-limited';
    return 'seats-available';
  }
}