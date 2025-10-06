import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Student, StudentService } from '../../services/student-service';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-studentlist',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    FormsModule,
    PopoverModule,
  ],
  templateUrl: './studentlist.html',
  styleUrl: './studentlist.css',
})
export class Studentlist implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchID: string = '';
  loading = true;
  showRefresh = false;
  openedMenuIndex: number | null = null;

  constructor(private studentService: StudentService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
  this.loadStudents();

  this.route.queryParams.subscribe(params => {
    if (params['refresh'] === 'true') {
      this.loadStudents();
    }
  });
}

  // Reusable function to call the API
  loadStudents(): void {
    this.loading = true;
    this.studentService.GetStudents().subscribe({
      next: (data) => {
        console.log('Students loaded:', data.items);
        this.students = data.items;
        this.loading = false;
        this.showRefresh = false;
      },
      error: (err) => {
        console.error('Failed to load students:', err);
        this.loading = false;
      },
    });
  }

  filterbyId() {
    const id = Number(this.searchID);
    if (!id) {
      alert('Student not found or incorrect ID.');
      this.searchID = '';
      return;
    }

    console.log('Searching student by ID:', id);

    this.studentService.GetStudentById(id).subscribe({
      next: (student) => {
        console.log('Filtered student:', student);
        this.students = [student];
        this.searchID = '';
        this.showRefresh = true;
      },
      error: (err) => {
        console.error('No students found:', err);
        alert('No students found');
        this.searchID = '';
        this.showRefresh = true;
      },
    });
  }

  toggleMenu(index: number) {
    this.openedMenuIndex =
      this.openedMenuIndex === index ? null : index;
  }

  refreshlist() {
    this.loadStudents(); 
    this.searchID = '';
  }

  goToAddStudent() {
    this.router.navigate(['/add-student']);
  }
}
