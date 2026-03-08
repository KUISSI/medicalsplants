import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Recipe, RecipeType, RECIPE_TYPE_LABELS } from '../../../core/models/recipe.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

const MOCK_PENDING: Recipe[] = [
  {
    id: '101',
    title: 'Tisane relaxante à la valériane',
    type: 'HOT_DRINK',
    description: 'Une infusion apaisante pour faciliter l\'endormissement et réduire le stress.',
    premium: false,
    status: 'PENDING',
    author: { id: '3', email: 'carol@example.com', pseudo: 'Carol', role: 'USER', status: 'ACTIVE', isActive: true, isEmailVerified: false, createdAt: '2024-02-01T00:00:00' },
    plants: [{ id: '1', title: 'Valériane', administrationMode: 'ORAL_ROUTE', createdAt: '' }],
    createdAt: '2024-03-10T14:30:00'
  },
  {
    id: '102',
    title: 'Lotion apaisante au calendula',
    type: 'LOTION',
    description: 'Une lotion naturelle pour calmer les irritations cutanées.',
    premium: true,
    status: 'PENDING',
    author: { id: '6', email: 'felix@example.com', pseudo: 'Felix', role: 'PREMIUM', status: 'ACTIVE', isActive: true, isEmailVerified: true, createdAt: '2024-02-10T00:00:00' },
    plants: [{ id: '4', title: 'Calendula', administrationMode: 'EPIDERMAL_ROUTE', createdAt: '' }],
    createdAt: '2024-03-08T09:15:00'
  },
  {
    id: '103',
    title: 'Soupe détox aux herbes sauvages',
    type: 'DISH',
    description: 'Un plat complet riche en antioxydants pour purifier l\'organisme.',
    premium: false,
    status: 'PENDING',
    author: { id: '2', email: 'bob@example.com', pseudo: 'Bob', role: 'PREMIUM', status: 'ACTIVE', isActive: true, isEmailVerified: true, createdAt: '2024-01-15T00:00:00' },
    plants: [
      { id: '2', title: 'Ortie', administrationMode: 'ORAL_ROUTE', createdAt: '' },
      { id: '3', title: 'Pissenlit', administrationMode: 'ORAL_ROUTE', createdAt: '' }
    ],
    createdAt: '2024-03-05T16:45:00'
  }
];

@Component({
  selector: 'app-recipe-moderation',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './recipe-moderation.component.html',
  styleUrls: ['./recipe-moderation.component.scss']
})
export class RecipeModerationComponent {
  pendingrecipes: Recipe[] = [...MOCK_PENDING];
  selectedrecipe: Recipe | null = null;
  showApproveDialog = false;
  showRejectDialog = false;

  recipeTypeLabels: Record<RecipeType, string> = RECIPE_TYPE_LABELS;

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
      this.pendingrecipes = this.pendingrecipes.filter(r => r.id !== this.selectedrecipe!.id);
    }
    this.closeDialogs();
  }

  onRejectConfirm(): void {
    if (this.selectedrecipe) {
      this.pendingrecipes = this.pendingrecipes.filter(r => r.id !== this.selectedrecipe!.id);
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
