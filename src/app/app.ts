import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { SideBar } from './side-bar/side-bar';
import { Logo } from './logo/logo';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer,SideBar, Logo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CS305-web');
  //modified by Kinley
  //Modified by Kristel
  //Modified by Kristel1  
}
