import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe, RecipePage, RecipeType, RECIPE_TYPE_LABELS } from '../../../core/models/recipe.model';
import { RecipeCardComponent, RecipeCardData } from '../../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    RecipeCardComponent
  ],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  private recipeService = inject(RecipeService);
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  recipes: Recipe[] = [];
  filteredRecipes: RecipeCardData[] = [];
  
  isLoading = true;
  error: string | null = null;
  searchTerm = '';
  searchQuery = '';
  selectedType: RecipeType | '' = '';

  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 8;

  sort = 'title,asc'; // Tri alphabétique par défaut

  RecipeTypes = RECIPE_TYPE_LABELS;
  RecipeTypeKeys = Object.keys(RECIPE_TYPE_LABELS) as RecipeType[];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      this.searchQuery = this.searchTerm;
      this.selectedType = params['selectedType'] || '';
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 0;
      this.loadRecipes();
    });
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.error = null;

    this.recipeService.getPublished(this.currentPage, this.pageSize, this.sort).subscribe({
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
      }
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

  onSortChange(sortValue: string): void {
    this.sort = sortValue;
    this.currentPage = 0;
    this.loadRecipes();
  }

  applyFilters(): void {
    let result = this.recipes;

    if (this.searchTerm.trim()) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(recipe =>
        recipe.title.toLowerCase().includes(lowerTerm) ||
        recipe.description?.toLowerCase().includes(lowerTerm)
      );
    }

    if (this.selectedType) {
      result = result.filter(recipe => recipe.type === this.selectedType);
    }

    this.filteredRecipes = result.map(recipe => {
      const difficulties = ['Facile', 'Moyen', 'Difficile'];
      const rating = (recipe.id.charCodeAt(0) % 3) + 3;
      const time = ((recipe.id.charCodeAt(0) % 5) + 1) * 10;
      const difficulty = difficulties[recipe.id.charCodeAt(0) % difficulties.length];

      return {
        id: recipe.id,
        title: recipe.title,
        category: this.RecipeTypes[recipe.type] || 'Recette',
        premium: recipe.premium,
        rating,
        time,
        difficulty,
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
        page: this.currentPage > 0 ? this.currentPage : null
      },
      queryParamsHandling: 'merge'
    });
  }

  getRecipeTypeIcon(type: RecipeType): string {
    const icons: Record<RecipeType, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍽️',
      'LOTION': '🧴',
      'OTHER': '📦'
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