import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Recipe, RecipePage, RecipeStatus, RECIPE_TYPE_LABELS, RECIPE_STATUS_LABELS, RECIPE_STATUS_COLORS } from '../../../core/models/recipe.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports:  [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl:  './recipe-list.component.html',
  styleUrls:  ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private apiUrl = `${environment.apiUrl}/admin/recipes`;

  recipes: Recipe[] = [];
  isLoading = true;
  selectedStatus: RecipeStatus | '' = '';

  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 20;

  recipeTypeLabels = RECIPE_TYPE_LABELS;
  recipeStatusLabels = RECIPE_STATUS_LABELS;
  recipeStatusColors = RECIPE_STATUS_COLORS;
  statusKeys = Object.keys(RECIPE_STATUS_LABELS) as RecipeStatus[];

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());

    if (this.selectedStatus) {
      params = params.set('status', this.selectedStatus);
    }

    this.http.get<RecipePage>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.recipes = response.content;
        this.totalPages = response.totalPages;
        this. totalElements = response. totalElements;
        this.isLoading = false;
      },
      error:  () => {
        this.isLoading = false;
      }
    });
  }

  onStatusChange(): void {
    this.currentPage = 0;
    this.loadRecipes();
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this. loadRecipes();
    }
  }

  getRecipeTypeIcon(type: string): string {
    const icons:  Record<string, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍽️',
      'LOTION': '🧴'
    };
    return icons[type] || '📖';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}