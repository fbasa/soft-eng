import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

interface Student{
  name: string;
  dateOfBirth: Date;
  gender: string;
  contactInfo: string;
  program: string;
  schoolYear: string;
  semester: string;
  address: string;
  email: string;
  active: boolean;
}

@Component({
  selector: 'app-studentlist',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './studentlist.html',
  styleUrl: './studentlist.css'
})
export class Studentlist {
  students: Student[] = [
    {
      name: 'John Doe',
      dateOfBirth: new Date(2001, 6, 15),
      gender: 'Male',
      contactInfo: '+1234567890',
      program: 'Computer Science',
      schoolYear: '2023-2024',
      semester: '1st Sem',
      address: '123 Kangleon Street, City, Country',
      email: 'anashlo@gmail.com',
      active: true,
    },
    {
      name: 'Jane Smith',
      dateOfBirth: new Date(2002, 1, 28),
      gender: 'Female',
      contactInfo: '+1987654321',
      program: 'Business Administration',
      schoolYear: '2023-2024',
      semester: '2nd Sem',
      address: '456 Pine Avenue, City, Country',
      email:'muretyo@gmail.com',
      active: false,
    },
  ];

  openedMenuIndex: number | null = null;

  TruncateAddress(address:string): string {
    if (!address) return '';
    if (address.length <= 17) return address;
    return address.slice(0,17) + '...';
  }
  toggleMenu(index: number){
    if(this.openedMenuIndex === index){
      this.openedMenuIndex = null;
    }
    else{
      this.openedMenuIndex = index;
    }
  }
}
