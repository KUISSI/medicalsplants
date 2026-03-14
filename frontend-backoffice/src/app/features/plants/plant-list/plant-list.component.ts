import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PlantService } from '../../../core/services/plant.service';
import { Plant, PlantPage } from '../../../core/models/plant.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ConfirmDialogComponent, SlideOverComponent],
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss']
  styleUrls: ['./plant-list.component.scss']
})
export class PlantListComponent {
  private fb = inject(FormBuilder);

  /* ---- data ---- */
  private allPlants: Plant[] = [...MOCK_PLANTS];
  plants: Plant[] = [...MOCK_PLANTS];
  searchTerm = '';

  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 20;

  showDeleteDialog = false;
  plantToDelete: Plant | null = null;

  ngOnInit(): void {
    this.loadPlants();
  }

  loadPlants(): void {
    this.isLoading = true;
    this.plantService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response:  PlantPage) => {
        this.plants = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this. loadPlants();
    }
  }

  confirmDelete(plant: Plant): void {
    this.deletingPlant = plant;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.deletingPlant) {
      this.allPlants = this.allPlants.filter(p => p.id !== this.deletingPlant!.id);
      this.applySearch();
    }
    this.showDeleteDialog = false;
    this.deletingPlant = null;
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.deletingPlant = null;
  }

}