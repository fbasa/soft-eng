import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService, SearchResult } from '../services/search';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
}

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css'
})
export class TopBar {
  searchQuery: string = '';
  showSearchResults: boolean = false;
  searchResults: SearchResult[] = [];
  searchLoading: boolean = false;
  private searchSubject = new Subject<string>();
  
  showNotifications: boolean = false;
  
  // alaws pay api para magamit
  notifications: Notification[] = [];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  constructor(
    private router: Router,
    private searchService: SearchService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length < 2) {
          this.searchLoading = false;
          return of([]);
        }
        this.searchLoading = true;
        return this.searchService.search(query);
      })
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.searchLoading = false;
        this.showSearchResults = this.searchQuery.length >= 2;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.searchLoading = false;
        this.searchResults = [];
      }
    });
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim() && this.searchResults.length > 0) {
      this.selectResult(this.searchResults[0]);
    }
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onSearchFocus(): void {
    if (this.searchQuery.length >= 2) {
      this.showSearchResults = true;
    }
  }

  selectResult(result: SearchResult): void {
    console.log('Selected:', result);
    this.searchService.navigateToResult(result);
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showSearchResults = false;
    }
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
    // TODO: Update notification status in backend
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    // TODO: Update all notification statuses in backend
  }

  // ✅ Optional: Method to add notifications programmatically
  addNotification(notification: Omit<Notification, 'id' | 'read'>): void {
    const newNotification: Notification = {
      id: Date.now(),
      ...notification,
      read: false
    };
    this.notifications.unshift(newNotification); // Add to beginning
  }

  // ✅ Optional: Method to clear all notifications
  clearAllNotifications(): void {
    this.notifications = [];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    const notificationBtn = target.closest('.icon-btn');
    const notificationDropdown = target.closest('.notifications-dropdown');
    if (!notificationBtn && !notificationDropdown && this.showNotifications) {
      this.showNotifications = false;
    }

    const searchWrapper = target.closest('.search-wrapper');
    if (!searchWrapper && this.showSearchResults) {
      this.showSearchResults = false;
    }
  }
}