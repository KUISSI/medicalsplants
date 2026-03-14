import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SlideOverComponent } from '../../../shared/components/slide-over/slide-over.component';
import { Property } from '../../../core/models/property.model';
import { Symptom } from '../../../core/models/symptom.model';
import { PropertyService } from '../../../core/services/property.service';
import { SymptomService } from '../../../core/services/symptom.service';

const PREDEFINED_FAMILIES = [
  'Système nerveux', 'Défenses immunitaires', 'Douleurs', 'Système digestif',
  'Dermatologie', 'Système respiratoire', 'Système cardiovasculaire', 'Général'
];

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmDialogComponent, SlideOverComponent],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private symptomService = inject(SymptomService);

  /* ---- data ---- */
  private allProperties: Property[] = [];
  properties: Property[] = [];
  searchTerm = '';
  selectedFamily = '';
  families: string[] = [];
  predefinedFamilies = PREDEFINED_FAMILIES;
  availableSymptoms: Symptom[] = [];

  /* ---- slide-over ---- */
  slideOverOpen = false;
  editingId: string | null = null;
  selectedSymptomIds: string[] = [];

  form: FormGroup = this.fb.group({
    title:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    family:      ['', Validators.required],
    description: ['', Validators.maxLength(1000)]
  });

  /* ---- delete dialog ---- */
  showDeleteDialog = false;
  deletingProperty: Property | null = null;

  get isEditMode(): boolean { return !!this.editingId; }
  get slideOverTitle(): string { return this.editingId ? 'Modifier la propriété' : 'Nouvelle propriété'; }
  get f() { return this.form.controls; }

  ngOnInit(): void {
    forkJoin({
      properties: this.propertyService.getAll(),
      symptoms: this.symptomService.getAll()
    }).subscribe({
      next: ({ properties, symptoms }) => {
        this.allProperties = properties;
        this.availableSymptoms = symptoms;
        this.families = [...new Set(properties.map(p => p.family))].sort();
        this.applyFilters();
      },
      error: err => console.error('Failed to load data', err)
    });
  }

  private reloadProperties(): void {
    this.propertyService.getAll().subscribe({
      next: properties => {
        this.allProperties = properties;
        this.families = [...new Set(properties.map(p => p.family))].sort();
        this.applyFilters();
      },
      error: err => console.error('Failed to reload properties', err)
    });
  }

  openNew(): void {
    this.editingId = null;
    this.selectedSymptomIds = [];
    this.form.reset();
    this.slideOverOpen = true;
  }

  openEdit(property: Property): void {
    this.editingId = property.id;
    this.selectedSymptomIds = property.symptoms?.map(s => s.id) ?? [];
    this.form.patchValue({
      title:       property.title,
      family:      property.family,
      description: property.description || ''
    });
    this.slideOverOpen = true;
  }

  closeSlideOver(): void {
    this.slideOverOpen = false;
    this.editingId = null;
    this.selectedSymptomIds = [];
    this.form.reset();
  }

  toggleSymptom(symptomId: string): void {
    const idx = this.selectedSymptomIds.indexOf(symptomId);
    if (idx > -1) {
      this.selectedSymptomIds = this.selectedSymptomIds.filter(id => id !== symptomId);
    } else {
      this.selectedSymptomIds = [...this.selectedSymptomIds, symptomId];
    }
  }

  isSymptomSelected(symptomId: string): boolean {
    return this.selectedSymptomIds.includes(symptomId);
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { title, family, description } = this.form.value;

    if (this.editingId) {
      const id = this.editingId;
      this.propertyService.update(id, { title, family, description }).subscribe({
        next: updatedProperty => {
          const existing = this.allProperties.find(p => p.id === id);
          const previousSymptomIds = existing?.symptoms?.map(s => s.id) ?? [];
          const toAdd = this.selectedSymptomIds.filter(sid => !previousSymptomIds.includes(sid));
          const toRemove = previousSymptomIds.filter(sid => !this.selectedSymptomIds.includes(sid));

          const addCalls = toAdd.map(sid => this.propertyService.addSymptom(id, sid));
          const removeCalls = toRemove.map(sid => this.propertyService.removeSymptom(id, sid));
          const allCalls = [...addCalls, ...removeCalls];

          if (allCalls.length === 0) {
            this.reloadProperties();
            this.closeSlideOver();
            return;
          }

          forkJoin(allCalls).subscribe({
            next: () => {
              this.reloadProperties();
              this.closeSlideOver();
            },
            error: err => {
              console.error('Failed to update symptoms', err);
              this.reloadProperties();
              this.closeSlideOver();
            }
          });
        },
        error: err => console.error('Failed to update property', err)
      });
    } else {
      this.propertyService.create({
        title,
        family,
        description,
        symptomIds: this.selectedSymptomIds
      }).subscribe({
        next: () => {
          this.reloadProperties();
          this.closeSlideOver();
        },
        error: err => console.error('Failed to create property', err)
      });
    }
  }

  applyFilters(): void {
    let result = this.allProperties;
    const term = this.searchTerm.toLowerCase().trim();
    if (term) result = result.filter(p => p.title.toLowerCase().includes(term) || p.family.toLowerCase().includes(term));
    if (this.selectedFamily) result = result.filter(p => p.family === this.selectedFamily);
    this.properties = result;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFamily = '';
    this.properties = [...this.allProperties];
  }

  confirmDelete(property: Property): void {
    this.deletingProperty = property;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.deletingProperty) {
      const id = this.deletingProperty.id;
      this.propertyService.delete(id).subscribe({
        next: () => {
          this.allProperties = this.allProperties.filter(p => p.id !== id);
          this.applyFilters();
        },
        error: err => console.error('Failed to delete property', err)
      });
    }
    this.showDeleteDialog = false;
    this.deletingProperty = null;
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.deletingProperty = null;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
