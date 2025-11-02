import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Course, Enrollment, Student } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: Course[] = [
    {
      id: 'CS101',
      courseName: 'Introduction to Programming',
      courseCode: 'CS101',
      instructor: 'Frank Basa',
      capacity: 30,
      enrolled: 25,
      schedule: 'MWF 9:00-10:00 AM',
      description: 'Learn the fundamentals of programming using Python'
    },
    {
      id: 'CS201',
      courseName: 'Data Structures',
      courseCode: 'CS201',
      instructor: 'Jhon Kinley Laviña',
      capacity: 25,
      enrolled: 20,
      schedule: 'TTh 2:00-3:30 PM',
      description: 'Study fundamental data structures and algorithms'
    },
    {
      id: 'CS305',
      courseName: 'Software Engineering',
      courseCode: 'CS305',
      instructor: 'Reginald A. Cano',
      capacity: 20,
      enrolled: 15,
      schedule: 'MWF 1:00-2:00 PM',
      description: 'Learn software development methodologies and practices'
    },
    {
      id: 'ENG101',
      courseName: 'Engineering Mathematics',
      courseCode: 'ENG101',
      instructor: 'Isaach Gañolo',
      capacity: 35,
      enrolled: 30,
      schedule: 'TTh 10:00-11:30 AM',
      description: 'Advanced mathematics for engineering students'
    },
    {
      id: 'WEB201',
      courseName: 'Web Development',
      courseCode: 'WEB201',
      instructor: 'Chen Mae Padulla',
      capacity: 28,
      enrolled: 28,
      schedule: 'MWF 3:00-4:00 PM',
      description: 'Full-stack web development with modern frameworks'
    },
    {
      id: 'PSY101',
      courseName: 'Introduction to Psychology',
      courseCode: 'PSY101',
      instructor: 'Kristel Reyes',
      capacity: 40,
      enrolled: 35,
      schedule: 'TTh 1:00-2:30 PM',
      description: 'Explore the fundamentals of human psychology'
    },
    {
      id: 'NUR201',
      courseName: 'Nursing Fundamentals',
      courseCode: 'NUR201',
      instructor: 'Junrick Dela Costa',
      capacity: 25,
      enrolled: 22,
      schedule: 'MWF 8:00-9:00 AM',
      description: 'Core nursing principles and patient care'
    }
  ];

  private enrollments: Enrollment[] = [];
  private enrollmentsSubject = new BehaviorSubject<Enrollment[]>([]);

  constructor() {
    // Load courses from localStorage if available
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      this.courses = JSON.parse(savedCourses);
    }
    
    // Load enrollments from localStorage if available
    const savedEnrollments = localStorage.getItem('enrollments');
    if (savedEnrollments) {
      this.enrollments = JSON.parse(savedEnrollments);
      this.enrollmentsSubject.next(this.enrollments);
    }
  }

  // Get all available courses
  getCourses(): Observable<Course[]> {
    return of(this.courses);
  }

  // Get course by ID
  getCourseById(id: string): Observable<Course | undefined> {
    return of(this.courses.find(course => course.id === id));
  }

  // Get enrollments for a specific student
  getStudentEnrollments(studentId: string): Observable<Enrollment[]> {
    const studentEnrollments = this.enrollments.filter(
      e => e.studentId === studentId && e.status === 'active'
    );
    return of(studentEnrollments);
  }

  // Get all active enrollments
  getEnrollments(): Observable<Enrollment[]> {
    return this.enrollmentsSubject.asObservable();
  }

  // Enroll student in a course
  enrollStudent(studentId: string, courseId: string): Observable<{ success: boolean, message: string }> {
    // Check if course exists
    const course = this.courses.find(c => c.id === courseId);
    if (!course) {
      return of({ success: false, message: 'Course not found' });
    }

    // Check if course is full
    if (course.enrolled >= course.capacity) {
      return of({ success: false, message: 'Course is full' });
    }

    // Check if student is already enrolled
    const alreadyEnrolled = this.enrollments.some(
      e => e.studentId === studentId && e.courseId === courseId && e.status === 'active'
    );
    if (alreadyEnrolled) {
      return of({ success: false, message: 'Already enrolled in this course' });
    }

    // Create new enrollment
    const newEnrollment: Enrollment = {
      id: `ENR${Date.now()}`,
      studentId,
      courseId,
      enrollmentDate: new Date(),
      status: 'active'
    };

    this.enrollments.push(newEnrollment);
    course.enrolled++;
    
    // Save to localStorage
    this.saveEnrollments();
    this.enrollmentsSubject.next(this.enrollments);

    return of({ success: true, message: 'Successfully enrolled in course' });
  }

  // Drop a course
  dropCourse(enrollmentId: string): Observable<{ success: boolean, message: string }> {
    const enrollment = this.enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) {
      return of({ success: false, message: 'Enrollment not found' });
    }

    const course = this.courses.find(c => c.id === enrollment.courseId);
    if (course) {
      course.enrolled--;
    }

    enrollment.status = 'dropped';
    
    // Save to localStorage
    this.saveEnrollments();
    this.enrollmentsSubject.next(this.enrollments);

    return of({ success: true, message: 'Successfully dropped course' });
  }

  // Get roster for a specific course
  getCourseRoster(courseId: string): Observable<Enrollment[]> {
    const roster = this.enrollments.filter(
      e => e.courseId === courseId && e.status === 'active'
    );
    return of(roster);
  }

  // Save courses to localStorage
  private saveCourses(): void {
    localStorage.setItem('courses', JSON.stringify(this.courses));
  }

  // Save enrollments to localStorage
  private saveEnrollments(): void {
    localStorage.setItem('enrollments', JSON.stringify(this.enrollments));
  }

  // Get available seats for a course
  getAvailableSeats(courseId: string): number {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.capacity - course.enrolled : 0;
  }

  // Add a new course
  addCourse(course: Course): Observable<{ success: boolean, message: string }> {
    // Check if course code already exists
    const existingCourse = this.courses.find(c => c.courseCode === course.courseCode || c.id === course.id);
    if (existingCourse) {
      return of({ success: false, message: 'Course with this code already exists' });
    }

    this.courses.push(course);
    this.saveCourses();
    return of({ success: true, message: 'Course added successfully' });
  }

  // Update a course
  updateCourse(courseId: string, courseData: Partial<Course>): Observable<{ success: boolean, message: string }> {
    const courseIndex = this.courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) {
      return of({ success: false, message: 'Course not found' });
    }

    // Check if updating to a code that already exists (excluding current course)
    if (courseData.courseCode) {
      const duplicateCode = this.courses.find(c => c.courseCode === courseData.courseCode && c.id !== courseId);
      if (duplicateCode) {
        return of({ success: false, message: 'Course code already exists' });
      }
    }

    // Update the course
    this.courses[courseIndex] = { ...this.courses[courseIndex], ...courseData };
    this.saveCourses();
    return of({ success: true, message: 'Course updated successfully' });
  }

  // Delete a course
  deleteCourse(courseId: string): Observable<{ success: boolean, message: string }> {
    const courseIndex = this.courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) {
      return of({ success: false, message: 'Course not found' });
    }

    // Check if there are any active enrollments
    const hasEnrollments = this.enrollments.some(
      e => e.courseId === courseId && e.status === 'active'
    );
    if (hasEnrollments) {
      return of({ success: false, message: 'Cannot delete course with active enrollments' });
    }

    this.courses.splice(courseIndex, 1);
    this.saveCourses();
    return of({ success: true, message: 'Course deleted successfully' });
  }
}