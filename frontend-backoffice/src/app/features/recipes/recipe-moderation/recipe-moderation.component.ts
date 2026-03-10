import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe, RecipeStatus, RECIPE_STATUS_LABELS, RECIPE_STATUS_COLORS } from '../../../core/models/recipe.model';
// Les imports AppLoaderComponent et AppConfirmDialogComponent sont à retirer si tu utilises la version DRY sans ces composants.

@Component({
  selector: 'app-recipe-moderation',
  standalone: true,
  imports: [
    CommonModule
    // Retire AppLoaderComponent et AppConfirmDialogComponent si tu utilises la version DRY sans eux
  ],
  templateUrl: './recipe-moderation.component.html',
  styleUrls: ['./recipe-moderation.component.scss']
})
export class RecipeModerationComponent implements OnInit {
  pendingCount: number = 0;
  recipes: Recipe[] = [];
  pendingRecipes: Recipe[] = [];
  selectedRecipe: Recipe | null = null;
  isLoading: boolean = false;

  showRejectDialog = false;
  showApproveDialog = false;

  // Labels pour les types de recettes
  recipeTypeLabels: { [key: string]: string } = {
    smoothie: 'Smoothie',
    tisane: 'Tisane',
    potion: 'Potion',
    // Ajoute d’autres types si besoin
  };

  ngOnInit(): void {
    this.loadPendingRecipes();
  }

  loadPendingRecipes(): void {
    this.isLoading = true;
    // Exemple de logique de filtrage (à adapter selon ton backend)
    this.pendingRecipes = this.recipes.filter(r => r.status === 'PENDING');
    this.isLoading = false;
  }

  approveRecipe(recipe: Recipe): void {
    // ... logique d’approbation
  }

  rejectRecipe(recipe: Recipe): void {
    // ... logique de rejet
  }

  openRejectDialog(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    this.showRejectDialog = true;
  }

  openApproveDialog(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    this.showApproveDialog = true;
  }

  closeDialogs(): void {
    this.showRejectDialog = false;
    this.showApproveDialog = false;
    this.selectedRecipe = null;
  }

  onApproveConfirm(): void {
    if (this.selectedRecipe) {
      this.approveRecipe(this.selectedRecipe);
    }
    this.closeDialogs();
  }

  onRejectConfirm(): void {
    if (this.selectedRecipe) {
      this.rejectRecipe(this.selectedRecipe);
    }
    this.closeDialogs();
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusLabel(status: RecipeStatus): string {
    return RECIPE_STATUS_LABELS[status];
  }

  getStatusColor(status: RecipeStatus): string {
    return RECIPE_STATUS_COLORS[status];
  }

  getRecipeTypeIcon(type: string): string {
    // À adapter selon tes types réels
    switch (type) {
      case 'smoothie': return '🥤';
      case 'tisane': return '🍵';
      case 'potion': return '🧪';
      default: return '🍽️';
    }
  }
}