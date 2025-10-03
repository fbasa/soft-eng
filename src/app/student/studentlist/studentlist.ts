import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Student, StudentService } from '../../services/student-service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-studentlist',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './studentlist.html',
  styleUrl: './studentlist.css'
})
export class Studentlist implements OnInit{
  students: Student[] = [];
  loading=true;
  constructor(private studentService: StudentService){}

  ngOnInit(): void {
      this.studentService.GetStudents().subscribe(data =>{
        console.log(data);
        this.students=data.items;
      });
  }

  openedMenuIndex: number | null = null;

  /*TruncateAddress(address:string): string {
    if (!address) return '';
    if (address.length <= 17) return address;
    return address.slice(0,17) + '...';
  }*/
  toggleMenu(index: number){
    if(this.openedMenuIndex === index){
      this.openedMenuIndex = null;
    }
    else{
      this.openedMenuIndex = index;
    }
  }
}
