import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Recipe, RECIPE_TYPE_LABELS, RECIPE_STATUS_LABELS } from '../../../core/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Review } from '../../../core/models/review.model';
import { ReviewFormComponent } from '../../reviews/review-form/review-form.component';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReviewFormComponent
  ],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe | null = null;
  isLoading = true;
  error: string | null = null;

  RecipeTypeLabels = RECIPE_TYPE_LABELS;
  RecipeStatusLabels = RECIPE_STATUS_LABELS;

  ingredientsList: string[] = [];
  showReviewForm = false;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRecipe(id);
    } else {
      this.error = 'ID de recette invalide';
      this.isLoading = false;
    }
  }

  loadRecipe(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.recipeService.getById(id).subscribe({
      next: (recipe: Recipe) => {
        this.recipe = recipe;
        this.parseIngredients();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la recette';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  parseIngredients(): void {
    if (this.recipe?.ingredients) {
      this.ingredientsList = this.recipe.ingredients
        .split(/[,\n]/)
        .map(i => i.trim())
        .filter(i => i.length > 0);
    }
  }

  getRecipeTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍲',
      'LOTION': '🧴',
      'OTHER': '📦'
    };
    return icons[type] || '📦';
  }

  getDifficultyLabel(difficulty: string | undefined): string {
    if (!difficulty) return 'Non spécifié';
    const labels: Record<string, string> = {
      'EASY': 'Facile',
      'MEDIUM': 'Moyen',
      'HARD': 'Difficile'
    };
    return labels[difficulty] || difficulty;
  }

  get preparationSteps(): string[] {
    // Adapte le split selon la structure de tes instructions
    return this.recipe?.instructions
      ? this.recipe.instructions.split(/\d+\s*-\s*/).filter(Boolean)
      : [];
  }

  onReviewSubmitted(newReview: Review) {
    if (this.recipe) {
      this.recipe.reviews = [newReview, ...(this.recipe.reviews || [])];
      this.recipe.reviewCount = (this.recipe.reviewCount || 0) + 1;
      this.showReviewForm = false;
    }
  }
}