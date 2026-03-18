import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ReviewService } from '../../../core/services/review.service';
import { RecipeService } from '../../../core/services/recipe.service';
import { Review } from '../../../core/models/review.model';
import { Recipe } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private recipeService = inject(RecipeService);
  recipes: Recipe[] = [];
  reviewsByRecipe: Record<string, Review[]> = {};
  expandedRecipeId: string | null = null;
  loadingReviews: Record<string, boolean> = {};

  isLoadingRecipes = false;

  showDeleteDialog = false;
  deletingReview: Review | null = null;

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoadingRecipes = true;
    this.recipeService.getPublished(0, 50).subscribe({
      next: page => {
        this.recipes = page.content;
        this.isLoadingRecipes = false;
      },
      error: () => { this.isLoadingRecipes = false; }
    });
  }

  toggleRecipe(recipe: Recipe): void {
    if (this.expandedRecipeId === recipe.id) {
      this.expandedRecipeId = null;
      return;
    }
    this.expandedRecipeId = recipe.id;
    if (!this.reviewsByRecipe[recipe.id]) {
      this.loadReviews(recipe.id);
    }
  }

  loadReviews(recipeId: string): void {
    this.loadingReviews[recipeId] = true;
    this.reviewService.getByRecipe(recipeId).subscribe({
      next: reviews => {
        this.reviewsByRecipe[recipeId] = reviews;
        this.loadingReviews[recipeId] = false;
      },
      error: () => { this.loadingReviews[recipeId] = false; }
    });
  }

  confirmDelete(review: Review): void {
    this.deletingReview = review;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (!this.deletingReview) return;
    const reviewId = this.deletingReview.id;
    const recipeId = this.deletingReview.recipeId;
    this.reviewService.delete(reviewId).subscribe({
      next: () => {
        this.reviewsByRecipe[recipeId] = this.reviewsByRecipe[recipeId]
          .filter(r => r.id !== reviewId);
      }
    });
    this.showDeleteDialog = false;
    this.deletingReview = null;
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.deletingReview = null;
  }

  getReviewCount(recipeId: string): number {
    return this.reviewsByRecipe[recipeId]?.length ?? 0;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  renderStars(rating: number | null): string {
    if (!rating) return '—';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
