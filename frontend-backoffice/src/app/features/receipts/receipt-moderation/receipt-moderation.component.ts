import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Recipe, RECIPE_TYPE_LABELS } from '../../../core/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';

@Component({
  selector: 'app-receipt-moderation',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent, ConfirmDialogComponent],
  templateUrl: './receipt-moderation.component.html',
  styleUrls: ['./receipt-moderation.component.scss']
})
export class ReceiptModerationComponent implements OnInit {
  private recipeService = inject(RecipeService);

  pendingReceipts: Recipe[] = [];
  isLoading = false;

  receiptTypeLabels = RECIPE_TYPE_LABELS;

  showApproveDialog = false;
  showRejectDialog = false;
  selectedReceipt: Recipe | null = null;

  ngOnInit(): void {
    this.isLoading = true;
    this.recipeService.getPending().subscribe({
      next: (recipes) => {
        this.pendingReceipts = recipes;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openApproveDialog(receipt: Recipe): void {
    this.selectedReceipt = receipt;
    this.showApproveDialog = true;
  }

  openRejectDialog(receipt: Recipe): void {
    this.selectedReceipt = receipt;
    this.showRejectDialog = true;
  }

  onApproveConfirm(): void {
    if (!this.selectedReceipt) return;
    this.recipeService.approve(this.selectedReceipt.id).subscribe({
      next: () => {
        this.pendingReceipts = this.pendingReceipts.filter(r => r.id !== this.selectedReceipt?.id);
        this.closeDialogs();
      },
      error: () => this.closeDialogs()
    });
  }

  onRejectConfirm(): void {
    if (!this.selectedReceipt) return;
    this.recipeService.archive(this.selectedReceipt.id).subscribe({
      next: () => {
        this.pendingReceipts = this.pendingReceipts.filter(r => r.id !== this.selectedReceipt?.id);
        this.closeDialogs();
      },
      error: () => this.closeDialogs()
    });
  }

  closeDialogs(): void {
    this.showApproveDialog = false;
    this.showRejectDialog = false;
    this.selectedReceipt = null;
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
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
}