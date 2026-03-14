import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import {
  Recipe,
  RecipePage,
  RecipeType,
  RECIPE_TYPE_LABELS,
} from '../../../core/models/recipe.model';
import {
  RecipeCardComponent,
  RecipeCardData,
} from '../../../shared/components/recipe-card/recipe-card.component';
import { FavoriteButtonComponent } from '../../../shared/components/favorite-button/favorite-button.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    RecipeCardComponent,
    FavoriteButtonComponent,
  ],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit {
  private recipeService = inject(RecipeService);
  authService = inject(AuthService);
  favoriteService = inject(FavoriteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  recipes: Recipe[] = [];
  filteredRecipes: RecipeCardData[] = [];

  isLoading = true;
  error: string | null = null;
  searchTerm = '';
  searchQuery = '';
  selectedType: RecipeType | '' = '';
  selectedPrepTime: string = 'Tous';
  selectedDifficulty: string = 'Toutes';

  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 8;

  sort = 'title,asc'; // Tri alphabétique par défaut

  RecipeTypes = RECIPE_TYPE_LABELS;
  RecipeTypeKeys = Object.keys(RECIPE_TYPE_LABELS) as RecipeType[];

  // Filtres supplémentaires
  prepTimes = ['Tous', '-15 min', '15-30 min', '30-60 min', '+60 min'];
  difficulties = ['Toutes', 'Facile', 'Moyen', 'Difficile'];

  // Ajouts pour corriger les erreurs du template
  recipeStatusColors: { [key: string]: string } = {
    PUBLISHED: '#4caf50',
    DRAFT: '#ffc107',
    ARCHIVED: '#f44336',
    // Adapte selon tes statuts réels
  };

  recipeStatusLabels: { [key: string]: string } = {
    PUBLISHED: 'Publié',
    DRAFT: 'Brouillon',
    ARCHIVED: 'Archivé',
    // Adapte selon tes statuts réels
  };

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['searchTerm'] || '';
      this.searchQuery = this.searchTerm;
      this.selectedType = params['selectedType'] || '';
      this.selectedPrepTime = params['selectedPrepTime'] || 'Tous';
      this.selectedDifficulty = params['selectedDifficulty'] || 'Toutes';
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 0;
      this.loadRecipes();
    });
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.error = null;

    this.recipeService
      .getPublished(this.currentPage, this.pageSize, this.sort)
      .subscribe({
        next: (response: RecipePage) => {
          this.recipes = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des recettes';
          this.isLoading = false;
          console.error(err);
        },
      });
  }

  onSearch(): void {
    this.searchTerm = this.searchQuery;
    this.currentPage = 0;
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  onTypeChange(type: RecipeType | ''): void {
    this.selectedType = type;
    this.currentPage = 0;
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  onPrepTimeChange(time: string): void {
    this.selectedPrepTime = time;
    this.currentPage = 0;
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  onDifficultyChange(difficulty: string): void {
    this.selectedDifficulty = difficulty;
    this.currentPage = 0;
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  onSortChange(sortValue: string): void {
    this.sort = sortValue;
    this.currentPage = 0;
    this.loadRecipes();
  }

  applyFilters(): void {
    let result = this.recipes;

    if (this.searchTerm.trim()) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(lowerTerm) ||
          recipe.description?.toLowerCase().includes(lowerTerm),
      );
    }

    if (this.selectedType) {
      result = result.filter((recipe) => recipe.type === this.selectedType);
    }

    // Difficulté (en dur ou via champ réel si dispo)
    if (this.selectedDifficulty !== 'Toutes') {
      result = result.filter((recipe) => {
        const difficulties = ['Facile', 'Moyen', 'Difficile'];
        const difficulty =
          difficulties[recipe.id.charCodeAt(0) % difficulties.length];
        return difficulty === this.selectedDifficulty;
      });
    }

    // Temps de préparation (en dur ou via champ réel si dispo)
    if (this.selectedPrepTime !== 'Tous') {
      result = result.filter((recipe) => {
        const time = ((recipe.id.charCodeAt(0) % 5) + 1) * 10; // à remplacer par recipe.prepTime si dispo
        if (this.selectedPrepTime === '-15 min') return time < 15;
        if (this.selectedPrepTime === '15-30 min')
          return time >= 15 && time <= 30;
        if (this.selectedPrepTime === '30-60 min')
          return time > 30 && time <= 60;
        if (this.selectedPrepTime === '+60 min') return time > 60;
        return true;
      });
    }

    this.filteredRecipes = result.map((recipe) => {
      const difficulties = ['Facile', 'Moyen', 'Difficile'];
      const rating = (recipe.id.charCodeAt(0) % 3) + 3;
      const time = ((recipe.id.charCodeAt(0) % 5) + 1) * 10;
      const difficulty =
        difficulties[recipe.id.charCodeAt(0) % difficulties.length];

      return {
        id: recipe.id,
        title: recipe.title,
        category: this.RecipeTypes[recipe.type] || 'Recette',
        premium: recipe.premium,
        rating,
        time,
        difficulty,
        // Ajoute d'autres champs si besoin
      };
    });
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadRecipes();
      this.updateUrlQueryParams();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedPrepTime = 'Tous';
    this.selectedDifficulty = 'Toutes';
    this.currentPage = 0;
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  private updateUrlQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchTerm: this.searchTerm || null,
        selectedType: this.selectedType || null,
        selectedPrepTime:
          this.selectedPrepTime !== 'Tous' ? this.selectedPrepTime : null,
        selectedDifficulty:
          this.selectedDifficulty !== 'Toutes' ? this.selectedDifficulty : null,
        page: this.currentPage > 0 ? this.currentPage : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  getRecipeTypeIcon(type: RecipeType): string {
    const icons: Record<RecipeType, string> = {
      HOT_DRINK: '☕',
      COLD_DRINK: '🧊',
      DISH: '🍽️',
      LOTION: '🧴',
      OTHER: '📦',
    };
    return icons[type] || '📖';
  }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
