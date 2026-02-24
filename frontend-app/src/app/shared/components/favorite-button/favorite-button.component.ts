import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="onClick($event)"
      [class.favorited]="isFavorite"
      aria-label="Ajouter ou retirer des favoris"
    >
      <span *ngIf="isFavorite">★</span>
      <span *ngIf="!isFavorite">☆</span>
    </button>
  `,
  styles: [`
    button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #e6b800;
      padding: 0;
      line-height: 1;
      outline: none;
      transition: transform 0.1s;
    }
    button:active {
      transform: scale(0.95);
    }
    .favorited {
      color: #e6b800;
    }
  `]
})
export class FavoriteButtonComponent {
  @Input() isFavorite = false;
  @Output() toggle = new EventEmitter<void>();

  onClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggle.emit();
  }
}