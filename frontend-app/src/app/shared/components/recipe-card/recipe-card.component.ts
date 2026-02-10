import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface RecipeCardData {
  id: string | number;
  title: string;
  imageUrl?: string;
  category: string;
  rating?: number;
  time?: number;
  difficulty?: string;
  premium?: boolean;
}

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent {
  @Input() recipe!: RecipeCardData;
  @Input() queryParams: any; // Add this line

  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    if (element) {
      element.style.display = 'none';
    }
  }
}