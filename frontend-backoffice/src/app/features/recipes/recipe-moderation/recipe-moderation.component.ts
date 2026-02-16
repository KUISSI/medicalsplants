import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe, RecipeStatus, RECIPE_STATUS_LABELS, RECIPE_STATUS_COLORS } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-moderation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-moderation.component.html',
  styleUrls: ['./recipe-moderation.component.scss']
})
export class RecipeModerationComponent implements OnInit {
  // camelCase pour variables
  pendingCount: number = 0;
  recipes: Recipe[] = [];
  selectedRecipe: Recipe | null = null;
  isLoading: boolean = false;

  // camelCase pour méthodes
  ngOnInit(): void {
    this.loadPendingRecipes();
  }

  loadPendingRecipes(): void {
    this.isLoading = true;
    // ... logique de chargement
    this.isLoading = false;
  }

  approveRecipe(recipe: Recipe): void {
    // ... logique d’approbation
  }

  rejectRecipe(recipe: Recipe): void {
    // ... logique de rejet
  }

  getStatusLabel(status: RecipeStatus): string {
    return RECIPE_STATUS_LABELS[status];
  }

  getStatusColor(status: RecipeStatus): string {
    return RECIPE_STATUS_COLORS[status];
  }
}