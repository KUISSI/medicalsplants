import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SlideOverComponent } from '../../../shared/components/slide-over/slide-over.component';
import { Plant, ADMINISTRATION_MODE_LABELS } from '../../../core/models/plant.model';

const MOCK_PLANTS: Plant[] = [
  { id: '1', title: 'Camomille', description: 'Plante calmante aux propriétés apaisantes', administrationMode: 'ORAL_ROUTE',      consumedPart: 'Fleur',   properties: [], createdAt: '2024-01-15T10:00:00' },
  { id: '2', title: 'Lavande',   description: 'Connue pour ses vertus relaxantes',          administrationMode: 'EPIDERMAL_ROUTE', consumedPart: 'Fleur',   properties: [], createdAt: '2024-02-10T09:00:00' },
  { id: '3', title: 'Menthe poivrée', description: 'Rafraîchissante et digestive',          administrationMode: 'ORAL_ROUTE',      consumedPart: 'Feuille', properties: [], createdAt: '2024-03-05T14:00:00' },
  { id: '4', title: 'Aloe vera', description: 'Cicatrisant et hydratant naturel',           administrationMode: 'EPIDERMAL_ROUTE', consumedPart: 'Gel',     properties: [], createdAt: '2024-03-20T11:00:00' },
  { id: '5', title: 'Gingembre', description: 'Anti-inflammatoire et stimulant digestif',   administrationMode: 'ORAL_ROUTE',      consumedPart: 'Racine',  properties: [], createdAt: '2024-04-01T08:00:00' },
  { id: '6', title: 'Échinacée', description: 'Renforce les défenses immunitaires',         administrationMode: 'ORAL_ROUTE',      consumedPart: 'Racine',  properties: [], createdAt: '2024-04-15T15:00:00' }
];

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ConfirmDialogComponent, SlideOverComponent],
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss']
})
export class PlantListComponent {
  private fb = inject(FormBuilder);

  /* ---- data ---- */
  private allPlants: Plant[] = [...MOCK_PLANTS];
  plants: Plant[] = [...MOCK_PLANTS];
  searchTerm = '';

  administrationModeLabels = ADMINISTRATION_MODE_LABELS;
  administrationModes = Object.keys(ADMINISTRATION_MODE_LABELS) as Array<keyof typeof ADMINISTRATION_MODE_LABELS>;

  /* ---- slide-over ---- */
  slideOverOpen = false;
  editingId: string | null = null;

  form: FormGroup = this.fb.group({
    title:              ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description:        [''],
    administrationMode: ['ORAL_ROUTE', Validators.required],
    consumedPart:       ['']
  });

  /* ---- delete dialog ---- */
  showDeleteDialog = false;
  deletingPlant: Plant | null = null;

  get isEditMode(): boolean { return !!this.editingId; }
  get slideOverTitle(): string { return this.editingId ? 'Modifier la plante' : 'Nouvelle plante'; }

  get f() { return this.form.controls; }

  openNew(): void {
    this.editingId = null;
    this.form.reset({ administrationMode: 'ORAL_ROUTE' });
    this.slideOverOpen = true;
  }

  openEdit(plant: Plant): void {
    this.editingId = plant.id;
    this.form.patchValue({
      title:              plant.title,
      description:        plant.description || '',
      administrationMode: plant.administrationMode,
      consumedPart:       plant.consumedPart || ''
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
    const values = this.form.value;

    if (this.editingId) {
      this.allPlants = this.allPlants.map(p =>
        p.id === this.editingId ? { ...p, ...values } : p
      );
    } else {
      this.allPlants = [...this.allPlants, {
        id: Date.now().toString(), ...values, properties: [],
        createdAt: new Date().toISOString()
      }];
    }
    this.applySearch();
    this.closeSlideOver();
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

  getAdministrationIcon(mode: string): string {
    const icons: Record<string, string> = {
      ORAL_ROUTE:      'bi-cup-hot',
      NASAL_ROUTE:     'bi-wind',
      EPIDERMAL_ROUTE: 'bi-droplet'
    };
    return icons[mode] ?? 'bi-flower1';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
