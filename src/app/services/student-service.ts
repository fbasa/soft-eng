import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
  dob: string;
  gender?: string;
  school: string;
  schoolYear: string;
  yearSemester: string;
  programClass: string;
  homeAddress?: string;
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
  private apiUrl = 'https://fbasa.bsite.net/api/v1/Students';
  constructor(private http: HttpClient) {}
  GetStudents(): Observable<{items: Student[], totalCount: number, totalPages: number}> {
    return this.http.get<{items: Student[], totalCount: number, totalPages: number}>(this.apiUrl);
  }

  GetStudentById(id: number) {}

  AddStudent(student: Student): Observable<Student> {
    const payload = { ...student };
    delete payload.id;
    delete payload.createdAt;
    return this.http.post<Student>(this.apiUrl, payload);
  }

  UpdateStudent(student: any) {}
}
