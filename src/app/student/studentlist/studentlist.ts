import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Student, StudentService } from '../../services/student-service';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-studentlist',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, TooltipModule, FormsModule, PopoverModule],
  templateUrl: './studentlist.html',
  styleUrl: './studentlist.css'
})
export class Studentlist implements OnInit{
  students: Student[] = [];
  searchID: String = '';
  filteredStudents: Student[] = [];
  loading=true;
  showRefresh = false;
  constructor(private studentService: StudentService){}

  ngOnInit(): void {
      this.studentService.GetStudents().subscribe(data =>{
        console.log(data);
        this.students=data.items;
      });

      //this is for my actionbutton so that the submenu will be turned off after clicking elsewhere
      document.addEventListener('click',(event: MouseEvent) =>{
        const target = event.target as HTMLElement;
        if(!target.closest('.action-menu')){
          this.openedMenuIndex = null;
        }
      })
  }

  filterbyId(){
    const id = Number(this.searchID);
    if (!id){
      alert("Student not found or incorrect ID.");
      this.searchID = '';
      return;
    }

    console.log("it works!!");

    this.studentService.GetStudentById(id).subscribe({
      next: (student) => {
        console.log('Filtered student:', student);
        this.students = [student];
        this.searchID = '';
        this.showRefresh = true;
      },
      error: (err) => {
        console.error(err);
        alert("No students found");
        this.searchID = '';
        this.showRefresh = true;
      }
    })
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

  refreshlist(){
    this.studentService.GetStudents().subscribe(data => {
      this.students = data.items;
      this.showRefresh = false;
      this.searchID = '';
    })
  }
}
