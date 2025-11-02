import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.css']
})
export class SideBar {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: '📊',
      route: '/dashboard'
    },
    {
      label: 'Student',
      icon: '👨‍🎓',
      expanded: false,
      children: [
        { label: 'Student Entry', icon: '➕', route: '/student-entry' },
        { label: 'Student List', icon: '📋', route: '/student-list' }
      ]
    },
    {
      label: 'Course',
      icon: '📚',
      expanded: false,
      children: [
        { label: 'Enroll Student', icon: '✏️', route: '/course-enrollment' },
        { label: 'View Course Roster', icon: '👥', route: '/course-roster' },
        { label: 'Manage Enrollment', icon: '⚙️', route: '/course-management' }
      ]
    },
    {
      label: 'Grades',
      icon: '📝',
      route: '/grades'
    },
    {
      label: 'Finance',
      icon: '💵',
      route: '/finance'
    },
    {
      label: 'Settings',
      icon: '⚙️',
      route: '/settings'
    }
  ];

  toggleMenu(item: MenuItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }
}