import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Student, StudentService } from '../../services/student-service';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    FormsModule,
    PopoverModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
  providers: [ConfirmationService, MessageService]
})
export class Studentlist implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchName: string = '';
  loading = true;
  showRefresh = false;
  openedMenuIndex: number | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmService: ConfirmationService,
    private messageService: MessageService) {}

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
        this.filteredStudents=[...this.students];
        this.loading = false;
        this.showRefresh = false;
      },
      error: (err) => {
        console.error('Failed to load students:', err);
        this.loading = false;
      },
    });
  }

  filterbyName() {
    const search = this.searchName.trim().toLowerCase();
    this.loading = true;

    setTimeout(() => {
      if (!search) {
        alert('Please enter a name to search.');
        this.filteredStudents = [...this.students];
        this.showRefresh = false;
        this.loading = false;
        return;
      }

      this.filteredStudents = this.students.filter(student =>
        student.firstName.toLowerCase().includes(search) ||
        student.lastName.toLowerCase().includes(search)
      );

      this.showRefresh = true;
      this.loading = false;

      if (this.filteredStudents.length === 0) {
        alert('No students found with that name.');
      }
    }, 500);
}


  toggleMenu(index: number) {
    this.openedMenuIndex =
      this.openedMenuIndex === index ? null : index;
  }

  refreshlist() {
    this.loadStudents(); 
    this.searchName = '';
  }

  goToAddStudent() {
    this.router.navigate(['/student-entry']);
  }

  goToEditStudent(id: number) {
    this.router.navigate(['/student-entry'], { queryParams: { id } });
  }

  confirmDelete(student: Student){
    this.confirmService.confirm({
      message: `Are you sure you want to delete ${student.firstName}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStudent(student.id!);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Deletion Cancelled.',
          life: 2000
        })
      }
    });
  }

  deleteStudent(id: number){
    this.loading=true;
    this.studentService.DeleteStudent(id).subscribe({
      next: () => {
        this.loadStudents();
        this.messageService.add({
          severity: 'Success',
          summary: 'Deleted',
          detail: 'Successfully deleted!',
          life: 2500
        });
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.loading=false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete student.',
        });
      }
    })
  }
}
