import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';

import { Footer } from './footer/footer';
import { SideBar } from './side-bar/side-bar';
import { TopBar } from './top-bar/top-bar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    Footer,
    SideBar,
    TopBar,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ToolbarModule,
    SplitButtonModule,
    InputIconModule,
    IconFieldModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly title = signal('Software Engineering');
  items=[
            {
                label: 'Update',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Delete',
                icon: 'pi pi-times'
            }
        ];
  text1 = 'Frank';
}
