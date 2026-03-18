import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  Recipe, RecipeType, RecipeStatus,
  RECIPE_TYPE_LABELS, RECIPE_STATUS_LABELS, RECIPE_STATUS_COLORS
} from '../../../core/models/recipe.model';
import { SlideOverComponent } from '../../../shared/components/slide-over/slide-over.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RecipeService } from '../../../core/services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SlideOverComponent, ConfirmDialogComponent],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  private recipeService = inject(RecipeService);

  recipes: Recipe[] = [];

  currentPage = 0;
  totalElements = 0;
  totalPages = 1;

  selectedStatus: RecipeStatus | '' = '';

  recipeTypeLabels: Record<RecipeType, string> = RECIPE_TYPE_LABELS;
  recipeStatusLabels: Record<RecipeStatus, string> = RECIPE_STATUS_LABELS;
  recipeStatusColors: Record<RecipeStatus, string> = RECIPE_STATUS_COLORS;

  statusKeys: RecipeStatus[] = Object.keys(RECIPE_STATUS_LABELS) as RecipeStatus[];

  slideOverOpen = false;
  selectedRecipe: Recipe | null = null;
  showDeleteDialog = false;

  loadRecipes(): void {
    const status = this.selectedStatus || undefined;
    this.recipeService.getAllAdmin(this.currentPage, 20, status).subscribe({
      next: page => {
        this.recipes = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.currentPage = page.number;
      },
      error: err => console.error('Failed to load recipes', err)
    });
  }

  ngOnInit(): void {
    this.loadRecipes();
  }

  applyFilter(): void {
    this.currentPage = 0;
    this.loadRecipes();
  }

  onStatusChange(): void {
    this.applyFilter();
  }

  loadPage(page: number): void {
    this.currentPage = page;
    this.loadRecipes();
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

  openDetail(recipe: Recipe): void {
    this.selectedRecipe=recipe;
    this.slideOverOpen=true;
  }

  closeDetail(): void {
    this.slideOverOpen=false;
    this.selectedRecipe=null;
  }

  approveRecipe(): void {
    if(!this.selectedRecipe) return;
    this.recipeService.approve(this.selectedRecipe.id).subscribe({
      next: updated => { this.selectedRecipe=updated; this.loadRecipes(); }
    });
  }

  archiveRecipe(): void {
    if(!this.selectedRecipe) return;
    this.recipeService.archive(this.selectedRecipe.id).subscribe({
      next: updated => { this.selectedRecipe=updated; this.loadRecipes(); }
    });
  }

  confirmDelete(): void { this.showDeleteDialog=true; }
  onDeleteCancel(): void { this.showDeleteDialog=false; }

  onDeleteConfirm(): void {
    if(!this.selectedRecipe) return;
    this.recipeService.delete(this.selectedRecipe.id).subscribe({
      next: () => { this.showDeleteDialog=false; this.closeDetail(); this.loadRecipes(); }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
