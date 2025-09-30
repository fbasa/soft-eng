import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { SideBar } from './side-bar/side-bar';
import { TopBar } from './top-bar/top-bar';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, Footer, SideBar, TopBar],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('Software Engineering');
  //modified by Kinley
  //Modified by Kristel
  //Modified by Kristel1
}
