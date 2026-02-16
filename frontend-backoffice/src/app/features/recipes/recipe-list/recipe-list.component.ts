import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Recipe, RecipePage, RecipeType, RECIPE_TYPE_LABELS } from '../../../core/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';
import { RecipeCardComponent } from '../../../features/recipes/recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RecipeCardComponent],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  isLoading = true;
  error: string | null = null;

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Filtres
  selectedType: RecipeType | 'ALL' = 'ALL';
  searchQuery = '';

  RecipeTypes = RECIPE_TYPE_LABELS;
  RecipeTypeKeys = Object.keys(RECIPE_TYPE_LABELS) as RecipeType[];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.error = null;

    this.recipeService.getPublished(this.currentPage, this.pageSize).subscribe({
      next: (page: RecipePage) => {
        this.recipes = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des recettes';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.recipes];

    if (this.selectedType !== 'ALL') {
      filtered = filtered.filter(r => r.type === this.selectedType);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query)
      );
    }

    this.filteredRecipes = filtered;
  }

  onTypeChange(type: RecipeType | 'ALL'): void {
    this.selectedType = type;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRecipes();
  }

  getRecipeTypeIcon(type: RecipeType): string {
    const icons: Record<RecipeType, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍲',
      'LOTION': '🧴',
      'OTHER': '📦'
    };
    return icons[type] || '📦';
  }
}