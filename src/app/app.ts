import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { Footer } from './footer/footer';
import { SideBar } from './side-bar/side-bar';
import { TopBar } from './top-bar/top-bar';


@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    Footer,
    SideBar,
    TopBar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly title = signal('Software Engineering');        
}
