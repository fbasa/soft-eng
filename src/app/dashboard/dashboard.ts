import { Component, OnInit, Input, HostBinding, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { StudentService, Student } from '../services/student-service';
import { CourseService } from '../services/course';
import { Enrollment, Course } from '../models/course.model';

interface StudentResponse {
  items: Student[];
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, ButtonModule, TableModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  students: Student[] = [];
  enrollments: Enrollment[] = [];
  courses: Course[] = [];
  totalStudents: number = 0;
  totalEnrollments: number = 0;
  
  // KPIs
  totalEnrolled: number = 0;
  retentionRate: number = 0;
  avgGPA: number = 0;
  
  // Charts Data
  programChartData: any;
  yearLevelChartData: any;
  genderChartData: any;
  semesterTrendsData: any;
  
  // Tables Data
  dropoutList: any[] = [];
  
  studentsPerCourse: { [key: string]: number } = {};
  studentsPerYear: { [key: string]: number } = {};
  genderDistribution: { [key: string]: number } = {};
  semesterEnrollments: { [key: string]: number } = {};
  
  loading: boolean = true;

  // Sidebar state from parent
  @Input() sidebarOpen: boolean = true;

  @HostBinding('style.margin-left.px') get sidebarMargin() {
    // Adjust dashboard margin based on sidebar state
    return this.sidebarOpen ? 160 : 30;
  }

  constructor(
    private studentService: StudentService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load all data in parallel
    let studentsLoaded = false;
    let coursesLoaded = false;
    let enrollmentsLoaded = false;

    const tryPrepareCharts = () => {
      if (studentsLoaded && coursesLoaded && enrollmentsLoaded) {
        this.prepareAllCharts();
        this.loading = false;
      }
    };
    
    this.studentService.GetStudents(1, 1000).subscribe({
      next: (res: StudentResponse) => {
        const studentsArray: Student[] = res.items || [];
        this.students = studentsArray;
        this.totalStudents = studentsArray.length;
        this.processStudentData(studentsArray);
        studentsLoaded = true;
        tryPrepareCharts();
      },
      error: (err) => {
        console.error('Error loading students:', err);
        studentsLoaded = true;
        tryPrepareCharts();
      },
    });

    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        coursesLoaded = true;
        tryPrepareCharts();
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        coursesLoaded = true;
        tryPrepareCharts();
      },
    });

    this.courseService.getEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.totalEnrollments = enrollments.filter(e => e.status === 'active').length;
        this.processEnrollmentData(enrollments);
        enrollmentsLoaded = true;
        tryPrepareCharts();
      },
      error: (err) => {
        console.error('Error loading enrollments:', err);
        enrollmentsLoaded = true;
        tryPrepareCharts();
      },
    });
  }

  processStudentData(students: Student[]): void {
    // Reset counters
    this.studentsPerCourse = {};
    this.studentsPerYear = {};
    this.genderDistribution = {};

    students.forEach((student: Student) => {
      // By Program
      const program = student.programClass || 'Unknown';
      this.studentsPerCourse[program] = (this.studentsPerCourse[program] || 0) + 1;

      // By Year Level
      const year = student.schoolYear || 'Unknown';
      this.studentsPerYear[year] = (this.studentsPerYear[year] || 0) + 1;

      // By Gender
      const gender = student.gender || 'Not Specified';
      this.genderDistribution[gender] = (this.genderDistribution[gender] || 0) + 1;
    });
  }

  processEnrollmentData(enrollments: Enrollment[]): void {
    // Reset
    this.semesterEnrollments = {};

    // Group by semester (mock data - using month as proxy)
    enrollments.forEach(enrollment => {
      if (enrollment.status === 'active') {
        const date = new Date(enrollment.enrollmentDate);
        const semester = this.getSemesterFromDate(date);
        this.semesterEnrollments[semester] = (this.semesterEnrollments[semester] || 0) + 1;
      }
    });

    // Get dropout list
    this.dropoutList = enrollments
      .filter(e => e.status === 'dropped')
      .map(e => {
        const course = this.courses.find(c => c.id === e.courseId);
        return {
          courseName: course?.courseName || 'Unknown Course',
          courseCode: course?.courseCode || 'Unknown',
          studentId: e.studentId,
          dropDate: e.enrollmentDate
        };
      })
      .slice(0, 5); // Last 5 dropouts

    // Calculate KPIs
    this.calculateKPIs();
  }

  getSemesterFromDate(date: Date): string {
    const month = date.getMonth();
    const year = date.getFullYear();
    const semester = month < 6 ? 'First' : 'Second';
    return `${year} ${semester} Semester`;
  }

  calculateKPIs(): void {
    // Total Enrolled (active enrollments)
    this.totalEnrolled = this.enrollments.filter(e => e.status === 'active').length;

    // Retention Rate (active / total students who were ever enrolled)
    const totalEverEnrolled = this.enrollments.length;
    this.retentionRate = totalEverEnrolled > 0 
      ? (this.totalEnrolled / totalEverEnrolled) * 100 
      : 100;

    // Average GPA (mock - students don't have GPA data yet)
    this.avgGPA = 2.85; // Placeholder
  }

  prepareAllCharts(): void {
    // Enrollment by Program
    const programLabels = Object.keys(this.studentsPerCourse);
    const programColors = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe',
                           '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];
    
    this.programChartData = {
      labels: programLabels.length > 0 ? programLabels : ['No Data'],
      datasets: [{
        label: 'Students per Program',
        data: programLabels.length > 0 ? Object.values(this.studentsPerCourse) : [0],
        backgroundColor: programColors,
        borderWidth: 1
      }]
    };

    // Enrollment by Year Level
    const yearLabels = Object.keys(this.studentsPerYear);
    this.yearLevelChartData = {
      labels: yearLabels.length > 0 ? yearLabels : ['No Data'],
      datasets: [{
        label: 'Students per Year Level',
        data: yearLabels.length > 0 ? Object.values(this.studentsPerYear) : [0],
        backgroundColor: ['#2563eb', '#4f46e5', '#6d28d9', '#8b5cf6', '#a78bfa'],
        borderWidth: 1
      }]
    };

    // Gender Distribution
    const genderLabels = Object.keys(this.genderDistribution);
    this.genderChartData = {
      labels: genderLabels.length > 0 ? genderLabels : ['No Data'],
      datasets: [{
        label: 'Gender Distribution',
        data: genderLabels.length > 0 ? Object.values(this.genderDistribution) : [0],
        backgroundColor: ['#7c3aed', '#ec4899', '#f472b6'],
        borderWidth: 1
      }]
    };

    // Semester Trends
    const sortedSemesters = Object.keys(this.semesterEnrollments).sort();
    this.semesterTrendsData = {
      labels: sortedSemesters.length > 0 ? sortedSemesters : ['No Data'],
      datasets: [{
        label: 'Enrollments per Semester',
        data: sortedSemesters.length > 0 ? sortedSemesters.map(s => this.semesterEnrollments[s]) : [0],
        backgroundColor: 'rgba(124, 58, 237, 0.5)',
        borderColor: '#7c3aed',
        borderWidth: 2,
        tension: 0.4
      }]
    };
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
