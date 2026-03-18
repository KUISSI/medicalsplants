import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import {
  Recipe,
  RecipeStatus,
  RECIPE_TYPE_LABELS,
  RECIPE_STATUS_LABELS,
  RECIPE_STATUS_COLORS,
} from '../../../core/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';

@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss'],
})
export class ReceiptListComponent implements OnInit {
  private recipeService = inject(RecipeService);

  allRecipes: Recipe[] = [];
  receipts: Recipe[] = [];
  isLoading = false;
  selectedStatus: RecipeStatus | '' = '';
  totalElements = 0;
  searchTerm = '';

  // Pagination & tri
  currentPage = 0;
  totalPages = 0;
  pageSize = 8;
  sort = 'title,asc';

  receiptTypeLabels = RECIPE_TYPE_LABELS;
  receiptStatusLabels = RECIPE_STATUS_LABELS;
  receiptStatusColors = RECIPE_STATUS_COLORS;
  statusKeys = Object.keys(RECIPE_STATUS_LABELS) as RecipeStatus[];

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.recipeService
      .getAllAdmin(this.currentPage, this.pageSize, this.selectedStatus, this.sort)
      .subscribe({
        next: (page) => {
          this.allRecipes = page.content;
          this.totalPages = page.totalPages;
          this.totalElements = page.totalElements;
          this.applyFilter();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadRecipes();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  applyFilter(): void {
    this.receipts = this.selectedStatus
      ? this.allRecipes.filter((r) => r.status === this.selectedStatus)
      : [...this.allRecipes];
    this.totalElements = this.receipts.length;
  }

  onStatusChange(): void {
    this.currentPage = 0;
    this.loadRecipes();
  }

  getReceiptTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      HOT_DRINK: 'bi-cup-hot',
      COLD_DRINK: 'bi-cup-straw',
      DISH: 'bi-egg-fried',
      LOTION: 'bi-droplet-half',
    };
    return icons[type] || 'bi-book';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  onSearchChange(): void {
    this.currentPage = 0;
    if (this.searchTerm.trim()) {
      this.isLoading = true;
      this.recipeService
        .searchAdmin(this.searchTerm.trim(), this.currentPage, this.pageSize)
        .subscribe({
          next: (page) => {
            this.allRecipes = page.content;
            this.totalPages = page.totalPages;
            this.totalElements = page.totalElements;
            this.applyFilter();
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.loadRecipes();
    }
  }
}