import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css'
})
export class SideBar {
  isOpen = true;

  @HostBinding('class.collapsed')
  get collapsed(): boolean {
    return !this.isOpen;
  }

  toggleSideBar() {
    this.isOpen = !this.isOpen;
  }
}
