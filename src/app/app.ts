import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { SideBar } from './side-bar/side-bar';
import { TopBar } from './top-bar/top-bar';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [Footer, SideBar, TopBar, CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('Software Engineering');
  //modified by Kinley
  //Modified by Kristel
  //Modified by Kristel1
}
