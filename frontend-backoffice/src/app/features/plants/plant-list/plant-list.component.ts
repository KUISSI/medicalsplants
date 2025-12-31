import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PlantService } from '../../../core/services/plant.service';
import { Plant, PlantPage, ADMINISTRATION_MODE_LABELS } from '../../../core/models/plant. model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports:  [
    CommonModule,
    RouterModule,
    FormsModule,
    LoaderComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list. component.scss']
})
export class PlantListComponent implements OnInit {
  private plantService = inject(PlantService);
  private toastr = inject(ToastrService);

  plants: Plant[] = [];
  isLoading = true;
  searchTerm = '';

  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 20;

  showDeleteDialog = false;
  plantToDelete: Plant | null = null;

  administrationModeLabels = ADMINISTRATION_MODE_LABELS;

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
    this.plantToDelete = plant;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.plantToDelete) {
      this.plantService. delete(this.plantToDelete.id).subscribe({
        next: () => {
          this.plants = this.plants. filter(p => p.id !== this. plantToDelete?.id);
          this.toastr.success('Plante supprimée', 'Succès');
          this.showDeleteDialog = false;
          this. plantToDelete = null;
        }
      });
    }
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.plantToDelete = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  getAdministrationIcon(mode: string): string {
    const icons:  Record<string, string> = {
      'ORAL_ROUTE': '☕',
      'NASAL_ROUTE':  '👃',
      'EPIDERMAL_ROUTE':  '🧴'
    };
    return icons[mode] || '🌿';
  }
}