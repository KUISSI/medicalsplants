import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Recipe, RecipeType, RECIPE_TYPE_LABELS } from '../../../core/models/recipe.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RecipeService } from '../../../core/services/recipe.service';

@Component({
  selector: 'app-recipe-moderation',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './recipe-moderation.component.html',
  styleUrls: ['./recipe-moderation.component.scss']
})
export class RecipeModerationComponent implements OnInit {
  private recipeService = inject(RecipeService);

  pendingrecipes: Recipe[] = [];
  selectedrecipe: Recipe | null = null;
  showApproveDialog = false;
  showRejectDialog = false;

  recipeTypeLabels: Record<RecipeType, string> = RECIPE_TYPE_LABELS;

  ngOnInit(): void {
    this.recipeService.getPending().subscribe({
      next: recipes => { this.pendingrecipes = recipes; },
      error: err => console.error('Failed to load pending recipes', err)
    });
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

  openApproveDialog(recipe: Recipe): void {
    this.selectedrecipe = recipe;
    this.showApproveDialog = true;
  }

  openRejectDialog(recipe: Recipe): void {
    this.selectedrecipe = recipe;
    this.showRejectDialog = true;
  }

  onApproveConfirm(): void {
    if (this.selectedrecipe) {
      const id = this.selectedrecipe.id;
      this.recipeService.approve(id).subscribe({
        next: () => {
          this.pendingrecipes = this.pendingrecipes.filter(r => r.id !== id);
        },
        error: err => console.error('Failed to approve recipe', err)
      });
    }
    this.closeDialogs();
  }

  onRejectConfirm(): void {
    if (this.selectedrecipe) {
      const id = this.selectedrecipe.id;
      this.recipeService.archive(id).subscribe({
        next: () => {
          this.pendingrecipes = this.pendingrecipes.filter(r => r.id !== id);
        },
        error: err => console.error('Failed to archive recipe', err)
      });
    }
    this.closeDialogs();
  }

  closeDialogs(): void {
    this.showApproveDialog = false;
    this.showRejectDialog = false;
    this.selectedrecipe = null;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
