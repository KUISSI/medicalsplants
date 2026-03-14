import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  Recipe, RecipeType, RecipeStatus,
  RECIPE_TYPE_LABELS, RECIPE_STATUS_LABELS, RECIPE_STATUS_COLORS
} from '../../../core/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  private recipeService = inject(RecipeService);

  private allRecipes: Recipe[] = [];
  recipes: Recipe[] = [];

  currentPage = 0;
  totalElements = 0;
  totalPages = 1;

  selectedStatus: RecipeStatus | '' = '';

  recipeTypeLabels: Record<RecipeType, string> = RECIPE_TYPE_LABELS;
  recipeStatusLabels: Record<RecipeStatus, string> = RECIPE_STATUS_LABELS;
  recipeStatusColors: Record<RecipeStatus, string> = RECIPE_STATUS_COLORS;

  statusKeys: RecipeStatus[] = Object.keys(RECIPE_STATUS_LABELS) as RecipeStatus[];

  ngOnInit(): void {
    this.recipeService.getAll(0, 50).subscribe({
      next: page => {
        this.allRecipes = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.currentPage = page.number;
        this.applyFilter();
      },
      error: err => console.error('Failed to load recipes', err)
    });
  }

  applyFilter(): void {
    if (this.selectedStatus) {
      this.recipes = this.allRecipes.filter(r => r.status === this.selectedStatus);
    } else {
      this.recipes = [...this.allRecipes];
    }
    this.totalElements = this.recipes.length;
    this.totalPages = 1;
    this.currentPage = 0;
  }

  onStatusChange(): void {
    this.applyFilter();
  }

  loadPage(page: number): void {
    this.currentPage = page;
  }

  getrecipeTypeIcon(type: RecipeType): string {
    const icons: Record<RecipeType, string> = {
      HOT_DRINK:  'bi-cup-hot',
      COLD_DRINK: 'bi-cup-straw',
      DISH:       'bi-egg-fried',
      LOTION:     'bi-droplet',
      OTHER:      'bi-three-dots'
    };
    return icons[type] ?? 'bi-journal';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
