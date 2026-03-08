import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SlideOverComponent } from '../../../shared/components/slide-over/slide-over.component';
import { Symptom } from '../../../core/models/symptom.model';

const MOCK_SYMPTOMS: Symptom[] = [
  { id: '1', title: 'Anxiété',          symptomFamily: 'Troubles nerveux',    symptomDetail: 'Sentiment persistant d\'inquiétude et de tension',  createdAt: '2024-01-10T00:00:00' },
  { id: '2', title: 'Insomnie',          symptomFamily: 'Troubles du sommeil', symptomDetail: 'Difficulté à s\'endormir ou à maintenir le sommeil', createdAt: '2024-01-15T00:00:00' },
  { id: '3', title: 'Migraine',          symptomFamily: 'Douleurs',            symptomDetail: 'Maux de tête intenses, souvent unilatéraux',          createdAt: '2024-02-01T00:00:00' },
  { id: '4', title: 'Reflux gastrique',  symptomFamily: 'Troubles digestifs',  symptomDetail: 'Remontée acide irritant l\'œsophage',                 createdAt: '2024-02-10T00:00:00' },
  { id: '5', title: 'Eczéma',            symptomFamily: 'Problèmes cutanés',   symptomDetail: 'Inflammation chronique de la peau',                   createdAt: '2024-03-01T00:00:00' },
  { id: '6', title: 'Fatigue chronique', symptomFamily: 'Troubles nerveux',    symptomDetail: 'Épuisement persistant sans cause apparente',           createdAt: '2024-03-05T00:00:00' }
];

const PREDEFINED_FAMILIES = [
  'Troubles nerveux', 'Troubles du sommeil', 'Douleurs', 'Troubles digestifs',
  'Problèmes cutanés', 'Système respiratoire', 'Système cardiovasculaire',
  'Système immunitaire', 'Système musculaire', 'Général'
];

@Component({
  selector: 'app-symptom-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmDialogComponent, SlideOverComponent],
  templateUrl: './symptom-list.component.html',
  styleUrls: ['./symptom-list.component.scss']
})
export class SymptomListComponent {
  private fb = inject(FormBuilder);

  /* ---- data ---- */
  private allSymptoms: Symptom[] = [...MOCK_SYMPTOMS];
  symptoms: Symptom[] = [...MOCK_SYMPTOMS];
  searchTerm = '';
  selectedFamily = '';
  families: string[] = [...new Set(MOCK_SYMPTOMS.map(s => s.symptomFamily))].sort();
  predefinedFamilies = PREDEFINED_FAMILIES;

  /* ---- slide-over ---- */
  slideOverOpen = false;
  editingId: string | null = null;

  form: FormGroup = this.fb.group({
    title:         ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    symptomFamily: ['', Validators.required],
    symptomDetail: ['', Validators.maxLength(1000)]
  });

  /* ---- delete dialog ---- */
  showDeleteDialog = false;
  deletingSymptom: Symptom | null = null;

  get isEditMode(): boolean { return !!this.editingId; }
  get slideOverTitle(): string { return this.editingId ? 'Modifier le symptôme' : 'Nouveau symptôme'; }
  get f() { return this.form.controls; }

  openNew(): void {
    this.editingId = null;
    this.form.reset();
    this.slideOverOpen = true;
  }

  openEdit(symptom: Symptom): void {
    this.editingId = symptom.id;
    this.form.patchValue({
      title:         symptom.title,
      symptomFamily: symptom.symptomFamily,
      symptomDetail: symptom.symptomDetail || ''
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
      this.allSymptoms = this.allSymptoms.map(s =>
        s.id === this.editingId ? { ...s, ...values } : s
      );
    } else {
      this.allSymptoms = [...this.allSymptoms, {
        id: Date.now().toString(), ...values, createdAt: new Date().toISOString()
      }];
      this.families = [...new Set(this.allSymptoms.map(s => s.symptomFamily))].sort();
    }
    this.applyFilters();
    this.closeSlideOver();
  }

  applyFilters(): void {
    let result = this.allSymptoms;
    const term = this.searchTerm.toLowerCase().trim();
    if (term) result = result.filter(s => s.title.toLowerCase().includes(term) || s.symptomFamily.toLowerCase().includes(term));
    if (this.selectedFamily) result = result.filter(s => s.symptomFamily === this.selectedFamily);
    this.symptoms = result;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFamily = '';
    this.symptoms = [...this.allSymptoms];
  }

  confirmDelete(symptom: Symptom): void {
    this.deletingSymptom = symptom;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.deletingSymptom) {
      this.allSymptoms = this.allSymptoms.filter(s => s.id !== this.deletingSymptom!.id);
      this.applyFilters();
    }
    this.showDeleteDialog = false;
    this.deletingSymptom = null;
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.deletingSymptom = null;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
