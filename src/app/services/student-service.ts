import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: number;
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
  
  GetStudents(page: number = 1, size: number = 50): Observable<any> {
    let url = `${this.apiUrl}?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

  GetStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/id?Id=${id}`);
  }

  AddStudent(student: Student): Observable<Student> {
    const payload = { ...student };
    delete payload.id;
    delete payload.createdAt;
    return this.http.post<Student>(this.apiUrl, payload);
  }

  UpdateStudent(student: any, studentData: Student) {}

  DeleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?Id=${id}`);
  }
}
