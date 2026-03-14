import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  Recipe,
  RecipePage,
  RecipeType,
  RecipeStatus,
  RECIPE_TYPE_LABELS,
  RECIPE_STATUS_LABELS,
  RECIPE_STATUS_COLORS,
} from '../../../core/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  isLoading = true;
  error: string | null = null;

  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  selectedStatus: RecipeStatus | '' = '';

  recipeStatusLabels: Record<string, string> = RECIPE_STATUS_LABELS;
  recipeStatusColors: Record<string, string> = RECIPE_STATUS_COLORS;
  recipeTypeLabels: Record<string, string> = RECIPE_TYPE_LABELS;
  statusKeys: string[] = Object.keys(RECIPE_STATUS_LABELS);

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.error = null;

    this.recipeService
      .getAll(this.currentPage, this.pageSize, this.selectedStatus || undefined)
      .subscribe({
        next: (page: RecipePage) => {
          this.recipes = page.content;
          this.totalElements = page.totalElements;
          this.totalPages = page.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des recettes';
          this.isLoading = false;
          console.error(err);
        },
      });
  }

  onStatusChange(): void {
    this.currentPage = 0;
    this.loadRecipes();
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadRecipes();
    }
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
