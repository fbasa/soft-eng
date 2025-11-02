export interface Course {
  id: string;
  courseName: string;
  courseCode: string;
  instructor: string;
  capacity: number;
  enrolled: number;
  schedule: string;
  description?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
  status: 'active' | 'dropped';
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
}