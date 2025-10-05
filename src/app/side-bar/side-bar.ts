import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterLink],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css'
})
export class SideBar {
  isOpen = false;
  studentMenuOpen = false;

  toggleSideBar(){
    this.isOpen=!this.isOpen;
    if (this.studentMenuOpen === true){
      this.studentMenuOpen = false;
    }
  }
  toggleStudentMenu(){
    if (this.isOpen === false){
      this.isOpen = true;
    }
    this.studentMenuOpen = !this.studentMenuOpen;
  }
}
