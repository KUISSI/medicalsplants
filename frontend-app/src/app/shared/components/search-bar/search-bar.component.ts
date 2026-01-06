import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports:  [CommonModule, FormsModule],
  template: `
    <div class="search-bar">
      <div class="search-bar__input-wrapper">
        <span class="search-bar__icon">🔍</span>
        <input
          type="text"
          class="search-bar__input"
          [placeholder]="placeholder"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()"
          (keyup.enter)="onSearchSubmit()"
        />
        @if (searchTerm) {
          <button class="search-bar__clear" (click)="clearSearch()">✕</button>
        }
      </div>
      @if (showButton) {
        <button class="search-bar__button" (click)="onSearchSubmit()">
          Rechercher
        </button>
      }
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex;
      gap: 10px;
      max-width: 600px;
      width: 100%;

      &__input-wrapper {
        flex: 1;
        position: relative;
        display: flex;
        align-items:  center;
      }

      &__icon {
        position: absolute;
        left:  15px;
        font-size: 1.2rem;
        pointer-events: none;
      }

      &__input {
        width: 100%;
        padding: 15px 45px;
        border: 1px solid #d0d0d0;
        border-radius: 50px;
        font-size: 1rem;
        transition: all 0.3s ease;
        outline: none;
        background: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

        &:focus {
          border-color: #4CAF50;
          box-shadow: 0 6px 16px rgba(76, 175, 80, 0.15);
        }

        &::placeholder {
          color: #999;
        }
      }

      &__clear {
        position: absolute;
        right: 15px;
        background: #e0e0e0;
        border: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &:hover {
          background: #ccc;
        }
      }

      &__button {
        padding: 15px 30px;
        background: #4CAF50;
        color: white;
        border:  none;
        border-radius: 30px;
        font-size: 1rem;
        font-weight: 600;
        cursor:  pointer;
        transition: all 0.3s ease;
        white-space: nowrap;

        &:hover {
          background: #45a049;
          transform: translateY(-2px);
        }
      }
    }
  `]
})
export class SearchBarComponent {
  @Input() placeholder = 'Rechercher...';
  @Input() showButton = false;
  @Input() debounceTime = 300;

  @Output() search = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();

  searchTerm = '';
  private debounceTimer: any;

  onSearch(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.search.emit(this.searchTerm);
    }, this.debounceTime);
  }

  onSearchSubmit(): void {
    this.searchSubmit.emit(this. searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.search.emit('');
  }
}