import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PropertyService } from '../../../core/services/property.service';
import { Property } from '../../../core/models/property.model';
import { Symptom } from '../../../core/models/symptom.model';

const MOCK_SYMPTOMS: Symptom[] = [
  { id: '1', title: 'Anxiété',          symptomFamily: 'Troubles nerveux',    symptomDetail: '', createdAt: '' },
  { id: '2', title: 'Insomnie',          symptomFamily: 'Troubles du sommeil', symptomDetail: '', createdAt: '' },
  { id: '3', title: 'Migraine',          symptomFamily: 'Douleurs',            symptomDetail: '', createdAt: '' },
  { id: '4', title: 'Reflux gastrique',  symptomFamily: 'Troubles digestifs',  symptomDetail: '', createdAt: '' },
  { id: '5', title: 'Eczéma',            symptomFamily: 'Problèmes cutanés',   symptomDetail: '', createdAt: '' },
  { id: '6', title: 'Fatigue chronique', symptomFamily: 'Troubles nerveux',    symptomDetail: '', createdAt: '' }
];

const MOCK_PROPERTIES: Property[] = [
  { id: '1', title: 'Calmant',           propertyFamily: 'Système nerveux',       propertyDetail: 'Réduit l\'anxiété et favorise la détente',   symptoms: [MOCK_SYMPTOMS[0]], createdAt: '2024-01-05T00:00:00' },
  { id: '2', title: 'Antiseptique',      propertyFamily: 'Défenses immunitaires', propertyDetail: 'Élimine les germes et bactéries',             symptoms: [],                 createdAt: '2024-01-08T00:00:00' },
  { id: '3', title: 'Anti-inflammatoire', propertyFamily: 'Douleurs',             propertyDetail: 'Réduit l\'inflammation et la douleur',        symptoms: [MOCK_SYMPTOMS[2]], createdAt: '2024-01-20T00:00:00' },
  { id: '4', title: 'Digestif',          propertyFamily: 'Système digestif',      propertyDetail: 'Facilite la digestion et soulage les maux',   symptoms: [MOCK_SYMPTOMS[3]], createdAt: '2024-02-01T00:00:00' },
  { id: '5', title: 'Cicatrisant',       propertyFamily: 'Dermatologie',          propertyDetail: 'Favorise la cicatrisation cutanée',           symptoms: [MOCK_SYMPTOMS[4]], createdAt: '2024-02-15T00:00:00' }
];

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
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent {
  private fb = inject(FormBuilder);

  /* ---- data ---- */
  private allProperties: Property[] = [...MOCK_PROPERTIES];
  properties: Property[] = [...MOCK_PROPERTIES];
  searchTerm = '';
  family = '';

  showDeleteDialog = false;
  deletingProperty: Property | null = null;

  get isEditMode(): boolean { return !!this.editingId; }
  get slideOverTitle(): string { return this.editingId ? 'Modifier la propriété' : 'Nouvelle propriété'; }
  get f() { return this.form.controls; }

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
      title:          property.title,
      propertyFamily: property.propertyFamily,
      propertyDetail: property.propertyDetail || ''
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
    const values = this.form.value;
    const symptoms = this.availableSymptoms.filter(s => this.selectedSymptomIds.includes(s.id));

    if (this.editingId) {
      this.allProperties = this.allProperties.map(p =>
        p.id === this.editingId ? { ...p, ...values, symptoms } : p
      );
    } else {
      this.allProperties = [...this.allProperties, {
        id: Date.now().toString(), ...values, symptoms, createdAt: new Date().toISOString()
      }];
    }
    this.applyFilters();
    this.closeSlideOver();
  }

  applyFilters(): void {
    let result = this.properties;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result. filter(p =>
        p.title. toLowerCase().includes(term) ||
        p.propertyFamily. toLowerCase().includes(term)
      );
    }

    if (this.family) {
      result = result.filter(p => p.propertyFamily === this.family);
    }

    this.filteredProperties = result;
  }

  clearFilters(): void {
    this. searchTerm = '';
    this.family = '';
    this.filteredProperties = this.properties;
  }

  confirmDelete(property: Property): void {
    this.deletingProperty = property;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.deletingProperty) {
      this.allProperties = this.allProperties.filter(p => p.id !== this.deletingProperty!.id);
      this.applyFilters();
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
