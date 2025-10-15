import { Component, OnInit, Input, HostBinding, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { StudentService, Student } from '../services/student-service';

interface StudentResponse {
  items: Student[];
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, ButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  students: Student[] = [];
  totalStudents: number = 0;
  studentsPerCourse: { [key: string]: number } = {};
  totalChartData: any;
  courseChartData: any;
  loading: boolean = true;

  // Sidebar state from parent
  @Input() sidebarOpen: boolean = true;

  @HostBinding('style.margin-left.px') get sidebarMargin() {
    // Adjust dashboard margin based on sidebar state
    return this.sidebarOpen ? 160 : 30;
  }

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.studentService.GetStudents(1, 1000).subscribe({
      next: (res: StudentResponse) => {
        const studentsArray: Student[] = res.items || [];
        this.students = studentsArray;
        this.totalStudents = studentsArray.length;

        this.studentsPerCourse = {};
        studentsArray.forEach((student: Student) => {
          const program = student.programClass || 'Unknown';
          this.studentsPerCourse[program] =
            (this.studentsPerCourse[program] || 0) + 1;
        });

        this.prepareCharts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.loading = false;
      },
    });
  }

  prepareCharts(): void {
    this.totalChartData = {
      labels: ['Total Students'],
      datasets: [
        {
          label: 'Total Students',
          data: [this.totalStudents],
          backgroundColor: ['#4f46e5'],
        },
      ],
    };

    this.courseChartData = {
      labels: Object.keys(this.studentsPerCourse),
      datasets: [
        {
          label: 'Students per Course',
          data: Object.values(this.studentsPerCourse),
          backgroundColor: [
            '#2563eb',
            '#4f46e5',
            '#6d28d9',
            '#8b5cf6',
            '#a78bfa',
          ],
        },
      ],
    };
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
