import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import {
  Recipe, RecipeStatus,
  RECIPE_TYPE_LABELS, RECIPE_STATUS_LABELS, RECIPE_STATUS_COLORS
} from '../../../core/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';

@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit {
  private recipeService = inject(RecipeService);

  allRecipes: Recipe[] = [];
  receipts: Recipe[] = [];
  isLoading = false;
  selectedStatus: RecipeStatus | '' = '';
  totalElements = 0;

  receiptTypeLabels = RECIPE_TYPE_LABELS;
  receiptStatusLabels = RECIPE_STATUS_LABELS;
  receiptStatusColors = RECIPE_STATUS_COLORS;
  statusKeys = Object.keys(RECIPE_STATUS_LABELS) as RecipeStatus[];

  ngOnInit(): void {
    this.isLoading = true;
    this.recipeService.getAll(0, 100).subscribe({
      next: (page) => {
        this.allRecipes = page.content;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.receipts = this.selectedStatus
      ? this.allRecipes.filter(r => r.status === this.selectedStatus)
      : [...this.allRecipes];
    this.totalElements = this.receipts.length;
  }

  onStatusChange(): void {
    this.applyFilter();
  }

  getReceiptTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'HOT_DRINK':  'bi-cup-hot',
      'COLD_DRINK': 'bi-cup-straw',
      'DISH':       'bi-egg-fried',
      'LOTION':     'bi-droplet-half'
    };
    return icons[type] || 'bi-book';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}