import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: string;
  firstName: string;
  lastName: string;
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
  status?: 'active' | 'inactive';
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'https://fbasa.bsite.net/api/students';
  constructor(private http: HttpClient) {}
  GetStudents() {}

  GetStudentById(id: number) {}

  AddStudent(student: Student): Observable<Student> {
    const payload = { ...student };
    delete payload.id;
    delete payload.createdAt;
    return this.http.post<Student>(this.apiUrl, payload);
  }

  UpdateStudent(student: any) {}
}
