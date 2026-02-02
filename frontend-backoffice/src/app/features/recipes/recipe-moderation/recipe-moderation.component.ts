import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { recipe, recipePage, recipe_TYPE_LABELS } from '../../../core/models/recipe.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recipe-moderation',
  standalone:  true,
  imports: [CommonModule, RouterModule, LoaderComponent, ConfirmDialogComponent],
  templateUrl: './recipe-moderation. component.html',
  styleUrls:  ['./recipe-moderation.component.scss']
})
export class recipeModerationComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private apiUrl = `${environment.apiUrl}/admin/recipes`;

  pendingrecipes:  recipe[] = [];
  isLoading = true;

  recipeTypeLabels = recipe_TYPE_LABELS;

  // Dialogs
  showApproveDialog = false;
  showRejectDialog = false;
  selectedrecipe: recipe | null = null;

  ngOnInit(): void {
    this.loadPendingrecipes();
  }

  loadPendingrecipes(): void {
    this. isLoading = true;

    const params = new HttpParams()
      .set('status', 'PENDING')
      .set('page', '0')
      .set('size', '50');

    this.http.get<recipePage>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.pendingrecipes = response. content;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openApproveDialog(recipe: recipe): void {
    this. selectedrecipe = recipe;
    this.showApproveDialog = true;
  }

  openRejectDialog(recipe: recipe): void {
    this. selectedrecipe = recipe;
    this.showRejectDialog = true;
  }

  onApproveConfirm(): void {
    if (this.selectedrecipe) {
      this.http.patch(`${this.apiUrl}/${this.selectedrecipe.id}/approve`, null).subscribe({
        next: () => {
          this.pendingrecipes = this.pendingrecipes.filter(r => r.id !== this.selectedrecipe?. id);
          this.toastr.success('Recette approuvée et publiée', 'Succès');
          this.closeDialogs();
        },
        error: () => {
          this.toastr. error('Erreur lors de l\'approbation', 'Erreur');
        }
      });
    }
  }

  onRejectConfirm(): void {
    if (this. selectedrecipe) {
      this. http.patch(`${this.apiUrl}/${this.selectedrecipe.id}/reject`, null).subscribe({
        next:  () => {
          this.pendingrecipes = this. pendingrecipes.filter(r => r.id !== this.selectedrecipe?.id);
          this.toastr.success('Recette rejetée', 'Succès');
          this.closeDialogs();
        },
        error: () => {
          this.toastr.error('Erreur lors du rejet', 'Erreur');
        }
      });
    }
  }

  closeDialogs(): void {
    this.showApproveDialog = false;
    this.showRejectDialog = false;
    this. selectedrecipe = null;
  }

  getrecipeTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍽️',
      'LOTION':  '🧴'
    };
    return icons[type] || '📖';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year:  'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}