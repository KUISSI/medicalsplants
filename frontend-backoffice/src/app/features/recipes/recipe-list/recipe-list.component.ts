import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  Recipe, RecipeType, RecipeStatus,
  RECIPE_TYPE_LABELS, RECIPE_STATUS_LABELS, RECIPE_STATUS_COLORS
} from '../../../core/models/recipe.model';

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1', title: 'Tisane à la camomille', type: 'HOT_DRINK', premium: false,
    status: 'PUBLISHED', description: 'Infusion apaisante classique',
    author: { id: '2', email: 'bob@example.com', pseudo: 'Bob', role: 'PREMIUM', status: 'ACTIVE', isActive: true, isEmailVerified: true, createdAt: '2024-01-15T00:00:00' },
    plants: [{ id: '1', title: 'Camomille', administrationMode: 'ORAL_ROUTE', createdAt: '' }],
    createdAt: '2024-02-10T10:00:00'
  },
  {
    id: '2', title: 'Jus detox au gingembre', type: 'COLD_DRINK', premium: true,
    status: 'PUBLISHED', description: 'Boisson froide tonifiante',
    author: { id: '6', email: 'felix@example.com', pseudo: 'Felix', role: 'PREMIUM', status: 'ACTIVE', isActive: true, isEmailVerified: true, createdAt: '2024-02-10T00:00:00' },
    plants: [{ id: '2', title: 'Gingembre', administrationMode: 'ORAL_ROUTE', createdAt: '' }],
    createdAt: '2024-02-15T14:00:00'
  },
  {
    id: '3', title: 'Soupe à l\'ortie', type: 'DISH', premium: false,
    status: 'PENDING',
    author: { id: '3', email: 'carol@example.com', pseudo: 'Carol', role: 'USER', status: 'ACTIVE', isActive: true, isEmailVerified: false, createdAt: '2024-02-01T00:00:00' },
    plants: [{ id: '3', title: 'Ortie', administrationMode: 'ORAL_ROUTE', createdAt: '' }],
    createdAt: '2024-03-01T09:00:00'
  },
  {
    id: '4', title: 'Lotion au calendula', type: 'LOTION', premium: true,
    status: 'PUBLISHED', description: 'Lotion apaisante pour la peau',
    author: { id: '2', email: 'bob@example.com', pseudo: 'Bob', role: 'PREMIUM', status: 'ACTIVE', isActive: true, isEmailVerified: true, createdAt: '2024-01-15T00:00:00' },
    plants: [{ id: '4', title: 'Calendula', administrationMode: 'EPIDERMAL_ROUTE', createdAt: '' }],
    createdAt: '2024-03-05T11:00:00'
  },
  {
    id: '5', title: 'Vinaigre aux herbes', type: 'OTHER', premium: false,
    status: 'REJECTED',
    author: { id: '4', email: 'david@example.com', pseudo: 'David', role: 'USER', status: 'INACTIVE', isActive: false, isEmailVerified: true, createdAt: '2024-01-20T00:00:00' },
    createdAt: '2024-03-08T16:00:00'
  }
];

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent {
  private allRecipes: Recipe[] = MOCK_RECIPES;
  recipes: Recipe[] = [...MOCK_RECIPES];

  currentPage = 0;
  totalElements = MOCK_RECIPES.length;
  totalPages = 1;

  selectedStatus: RecipeStatus | '' = '';

  recipeTypeLabels: Record<RecipeType, string> = RECIPE_TYPE_LABELS;
  recipeStatusLabels: Record<RecipeStatus, string> = RECIPE_STATUS_LABELS;
  recipeStatusColors: Record<RecipeStatus, string> = RECIPE_STATUS_COLORS;

  statusKeys: RecipeStatus[] = Object.keys(RECIPE_STATUS_LABELS) as RecipeStatus[];

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
