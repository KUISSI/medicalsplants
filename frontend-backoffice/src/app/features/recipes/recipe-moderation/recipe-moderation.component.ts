import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  Recipe,
  RecipeType,
  RECIPE_TYPE_LABELS,
  RECIPE_STATUS_LABELS,
} from '../../../core/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';

@Component({
  selector: 'app-recipe-moderation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-moderation.component.html',
  styleUrls: ['./recipe-moderation.component.scss'],
})
export class RecipeModerationComponent implements OnInit {
  pendingRecipes: Recipe[] = [];
  isLoading = false;
  error: string | null = null;

  recipeTypeLabels: Record<string, string> = RECIPE_TYPE_LABELS;
  recipeStatusLabels: Record<string, string> = RECIPE_STATUS_LABELS;

  showApproveDialog = false;
  showRejectDialog = false;
  selectedRecipe: Recipe | null = null;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadPendingRecipes();
  }

  loadPendingRecipes(): void {
    this.isLoading = true;
    this.error = null;
    this.recipeService.getAll(0, 50, 'PENDING').subscribe({
      next: (page) => {
        this.pendingRecipes = page.content;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  openApproveDialog(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    this.showApproveDialog = true;
  }

  openRejectDialog(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    this.showRejectDialog = true;
  }

  closeDialogs(): void {
    this.showApproveDialog = false;
    this.showRejectDialog = false;
    this.selectedRecipe = null;
  }

  onApproveConfirm(): void {
    if (!this.selectedRecipe) return;
    const id = this.selectedRecipe.id;
    this.recipeService.updateStatus(id, 'PUBLISHED').subscribe({
      next: () => {
        this.pendingRecipes = this.pendingRecipes.filter((r) => r.id !== id);
        this.closeDialogs();
      },
      error: (err) => {
        console.error(err);
        this.closeDialogs();
      },
    });
  }

  onRejectConfirm(): void {
    if (!this.selectedRecipe) return;
    const id = this.selectedRecipe.id;
    this.recipeService.updateStatus(id, 'REJECTED').subscribe({
      next: () => {
        this.pendingRecipes = this.pendingRecipes.filter((r) => r.id !== id);
        this.closeDialogs();
      },
      error: (err) => {
        console.error(err);
        this.closeDialogs();
      },
    });
  }

  getRecipeTypeIcon(type: RecipeType): string {
    const icons: Record<RecipeType, string> = {
      HOT_DRINK: '☕',
      COLD_DRINK: '🧊',
      DISH: '🍲',
      LOTION: '🧴',
      OTHER: '📦',
    };
    return icons[type] || '📦';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
