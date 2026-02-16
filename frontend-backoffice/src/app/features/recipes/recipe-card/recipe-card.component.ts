import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe, RecipeStatus, RECIPE_STATUS_LABELS, RECIPE_STATUS_COLORS } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;

  getStatusLabel(status: RecipeStatus): string {
    return RECIPE_STATUS_LABELS[status];
  }

  getStatusColor(status: RecipeStatus): string {
    return RECIPE_STATUS_COLORS[status];
  }
}