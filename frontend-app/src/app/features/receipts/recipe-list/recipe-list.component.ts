import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe, RecipePage, RecipeType, Recipe_TYPE_LABELS } from '../../../core/models/recipe.model';
import { RecipeCardComponent, RecipeCardData } from '../../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector:  'app-Recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SearchBarComponent,
    LoaderComponent,
    RecipeCardComponent
  ],
  templateUrl: './Recipe-list.component.html',
  styleUrls: ['./Recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  private RecipeService = inject(RecipeService);
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Mock Recipes data
  mockRecipes: Recipe[] = [
    { id: '660e8400-e29b-41d4-a716-446655440000', title: 'Infusion relaxante', description: 'Une infusion apaisante pour se détendre', type: 'HOT_DRINK' as RecipeType, createdAt: new Date().toISOString(), isPremium: false, status: 'PUBLISHED' },
    { id: '660e8400-e29b-41d4-a716-446655440001', title: 'Sirop pour la toux', description: 'Un sirop naturel pour soulager la toux', type: 'HOT_DRINK' as RecipeType, createdAt: new Date().toISOString(), isPremium: false, status: 'PUBLISHED' },
    { id: '660e8400-e29b-41d4-a716-446655440002', title: 'Baume apaisant', description: 'Un baume pour calmer les inflammations', type: 'LOTION' as RecipeType, createdAt: new Date().toISOString(), isPremium: true, status: 'PUBLISHED' },
    { id: '660e8400-e29b-41d4-a716-446655440003', title: 'Tisane digestive', description: 'Aide à la digestion après les repas', type: 'HOT_DRINK' as RecipeType, createdAt: new Date().toISOString(), isPremium: false, status: 'PUBLISHED' },
    { id: '660e8400-e29b-41d4-a716-446655440004', title: 'Elixir énergisant', description: 'Boost d\'énergie naturelle pour la journée', type: 'COLD_DRINK' as RecipeType, createdAt: new Date().toISOString(), isPremium: true, status: 'PUBLISHED' },
    { id: '660e8400-e29b-41d4-a716-446655440005', title: 'Teinture pour la peau', description: 'Soin naturel pour une peau saine', type: 'LOTION' as RecipeType, createdAt: new Date().toISOString(), isPremium: false, status: 'PUBLISHED' }
  ];

  Recipes: Recipe[] = [];
  filteredRecipes:  RecipeCardData[] = [];
  
  isLoading = true;
  searchTerm = '';
  selectedType: RecipeType | '' = '';

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 8;

  RecipeTypes = Recipe_TYPE_LABELS;
  RecipeTypeKeys = Object.keys(Recipe_TYPE_LABELS) as RecipeType[];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      this.selectedType = params['selectedType'] || '';
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 0;
      this.loadRecipes();
    });
  }

  loadRecipes(): void {
    this.isLoading = true;

    this.RecipeService.getPublished(this.currentPage, this.pageSize).subscribe({
      next: (response:  RecipePage) => {
        this. Recipes = response. content.length > 0 ? response.content : this.mockRecipes;
        this.totalPages = response.totalPages;
        this. totalElements = response. totalElements;
        this.applyFilters();
        this.isLoading = false;
      },
      error:  () => {
        // En cas d\'erreur, utiliser les mock data
        this.Recipes = this.mockRecipes;
        this.totalPages = 1;
        this.totalElements = this.mockRecipes.length;
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 0; // Reset page on new search
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  onTypeChange(type:  RecipeType | ''): void {
    this.selectedType = type;
    this.currentPage = 0; // Reset page on type change
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  applyFilters(): void {
    let result = this.Recipes;

    if (this.searchTerm. trim()) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(Recipe =>
        Recipe.title.toLowerCase().includes(lowerTerm) ||
        Recipe. description?. toLowerCase().includes(lowerTerm)
      );
    }

    if (this.selectedType) {
      result = result.filter(Recipe => Recipe.type === this.selectedType);
    }

    this.filteredRecipes = result.map(Recipe => {
      const difficulties = ['Facile', 'Moyen', 'Difficile'];
      const rating = (Recipe.id.charCodeAt(0) % 3) + 3;
      const time = ((Recipe.id.charCodeAt(0) % 5) + 1) * 10;
      const difficulty = difficulties[Recipe.id.charCodeAt(0) % difficulties.length];

      return {
        id: Recipe.id,
        title: Recipe.title,
        imageUrl: Recipe.imageUrl,
        category: this.RecipeTypes[Recipe.type] || 'Recette',
        isPremium: Recipe.isPremium,
        rating,
        time,
        difficulty,
      };
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.currentPage = 0;
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadRecipes();
      this.updateUrlQueryParams(); // Update URL on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updateUrlQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchTerm: this.searchTerm || null,
        selectedType: this.selectedType || null,
        page: this.currentPage > 0 ? this.currentPage : null // Only add page if not 0
      },
      queryParamsHandling: 'merge'
    });
  }

  get currentQueryParams() {
    const params: any = {};
    if (this.searchTerm) {
      params['searchTerm'] = this.searchTerm;
    }
    if (this.selectedType) {
      params['selectedType'] = this.selectedType;
    }
    if (this.currentPage > 0) {
      params['page'] = this.currentPage;
    }
    return params;
  }

  getRecipeTypeIcon(type: RecipeType): string {
    const icons:  Record<RecipeType, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍽️',
      'LOTION': '🧴'
    };
    return icons[type] || '📖';
  }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math. min(this.totalPages - 1, this. currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
