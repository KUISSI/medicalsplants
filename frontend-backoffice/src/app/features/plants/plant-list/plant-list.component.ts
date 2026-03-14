import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SlideOverComponent } from '../../../shared/components/slide-over/slide-over.component';
import { Plant } from '../../../core/models/plant.model';
import { PlantService } from '../../../core/services/plant.service';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ConfirmDialogComponent, SlideOverComponent],
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss']
})
export class PlantListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private plantService = inject(PlantService);

  /* ---- data ---- */
  private allPlants: Plant[] = [];
  plants: Plant[] = [];
  searchTerm = '';

  /* ---- slide-over ---- */
  slideOverOpen = false;
  editingId: string | null = null;

  form: FormGroup = this.fb.group({
    title:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', Validators.required],
    history:     [''],
    imageUrl:    ['']
  });

  /* ---- delete dialog ---- */
  showDeleteDialog = false;
  deletingPlant: Plant | null = null;

  get isEditMode(): boolean { return !!this.editingId; }
  get slideOverTitle(): string { return this.editingId ? 'Modifier la plante' : 'Nouvelle plante'; }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.loadPlants();
  }

  private loadPlants(): void {
    this.plantService.getAll(0, 100).subscribe({
      next: (page) => {
        this.allPlants = page.content;
        this.applySearch();
      }
    });
  }

  openNew(): void {
    this.editingId = null;
    this.form.reset();
    this.slideOverOpen = true;
  }

  openEdit(plant: Plant): void {
    this.editingId = plant.id;
    this.form.patchValue({
      title:       plant.title,
      description: plant.description || '',
      history:     plant.history || '',
      imageUrl:    plant.imageUrl || ''
    });
    this.slideOverOpen = true;
  }

  closeSlideOver(): void {
    this.slideOverOpen = false;
    this.editingId = null;
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { title, description, history, imageUrl } = this.form.value;

    if (this.editingId) {
      this.plantService.update(this.editingId, { title, description, history, imageUrl }).subscribe({
        next: (updated) => {
          this.allPlants = this.allPlants.map(p => p.id === updated.id ? updated : p);
          this.applySearch();
          this.closeSlideOver();
        }
      });
    } else {
      this.plantService.create({ title, description, history, imageUrl }).subscribe({
        next: (created) => {
          this.allPlants = [...this.allPlants, created];
          this.applySearch();
          this.closeSlideOver();
        }
      });
    }
  }

  applySearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.plants = term
      ? this.allPlants.filter(p => p.title.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term))
      : [...this.allPlants];
  }

  confirmDelete(plant: Plant): void {
    this.deletingPlant = plant;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.deletingPlant) {
      const id = this.deletingPlant.id;
      this.plantService.delete(id).subscribe({
        next: () => {
          this.allPlants = this.allPlants.filter(p => p.id !== id);
          this.applySearch();
        }
      });
    }
    this.showDeleteDialog = false;
    this.deletingPlant = null;
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.deletingPlant = null;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
