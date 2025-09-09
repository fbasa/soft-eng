import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CS305-web');
  //modified by Kinley
  //Modified by Kristel
  //Modified by Kristel1
  //Uploaded by Isaac (CS305-3)
}
