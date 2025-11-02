import { Injectable } from '@angular/core';
import { Observable, combineLatest, map, of } from 'rxjs';
import { StudentService, Student } from './student-service';
import { CourseService } from './course';
import { Course } from '../models/course.model';
import { Router } from '@angular/router';

export interface SearchResult {
  type: 'student' | 'course';
  id: string | number;
  title: string;
  subtitle: string;
  description?: string;
  route: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private router: Router
  ) {}

  search(query: string): Observable<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return of([]);
    }

    const searchTerm = query.toLowerCase().trim();

    return combineLatest([
      this.searchStudents(searchTerm),
      this.searchCourses(searchTerm)
    ]).pipe(
      map(([students, courses]) => [...students, ...courses])
    );
  }

  private searchStudents(searchTerm: string): Observable<SearchResult[]> {
    return this.studentService.GetStudents(1, 1000).pipe(
      map((response: any) => {
        const students: Student[] = response.items || [];
        
        return students
          .filter(student => {
            const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
            const email = student.emailAddress.toLowerCase();
            const program = (student.programClass || '').toLowerCase();
            
            return fullName.includes(searchTerm) ||
                   email.includes(searchTerm) ||
                   program.includes(searchTerm) ||
                   (student.id?.toString() || '').includes(searchTerm);
          })
          .slice(0, 5)
          .map(student => ({
            type: 'student' as const,
            id: student.id!,
            title: `${student.firstName} ${student.lastName}`,
            subtitle: student.emailAddress,
            description: student.programClass,
            route: `/student-entry?id=${student.id}`
          }));
      })
    );
  }

  private searchCourses(searchTerm: string): Observable<SearchResult[]> {
    return this.courseService.getCourses().pipe(
      map((courses: Course[]) => {
        return courses
          .filter(course => {
            const courseName = course.courseName.toLowerCase();
            const courseCode = course.courseCode.toLowerCase();
            const instructor = course.instructor.toLowerCase();
            
            return courseName.includes(searchTerm) ||
                   courseCode.includes(searchTerm) ||
                   instructor.includes(searchTerm);
          })
          .slice(0, 5)
          .map(course => ({
            type: 'course' as const,
            id: course.id,
            title: course.courseName,
            subtitle: course.courseCode,
            description: `Instructor: ${course.instructor}`,
            route: `/course-enrollment`
          }));
      })
    );
  }

  navigateToResult(result: SearchResult): void {
    this.router.navigateByUrl(result.route);
  }
}