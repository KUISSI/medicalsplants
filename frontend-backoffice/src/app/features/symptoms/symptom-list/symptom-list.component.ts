import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SlideOverComponent } from '../../../shared/components/slide-over/slide-over.component';
import { Symptom } from '../../../core/models/symptom.model';

const MOCK_SYMPTOMS: Symptom[] = [
  {
    id: '1',
    title: 'Anxiété',
    symptomFamily: 'Troubles nerveux',
    symptomDetail: "Sentiment persistant d'inquiétude et de tension",
    createdAt: '2024-01-10T00:00:00',
  },
  {
    id: '2',
    title: 'Insomnie',
    symptomFamily: 'Troubles du sommeil',
    symptomDetail: "Difficulté à s'endormir ou à maintenir le sommeil",
    createdAt: '2024-01-15T00:00:00',
  },
  {
    id: '3',
    title: 'Migraine',
    symptomFamily: 'Douleurs',
    symptomDetail: 'Maux de tête intenses, souvent unilatéraux',
    createdAt: '2024-02-01T00:00:00',
  },
  {
    id: '4',
    title: 'Reflux gastrique',
    symptomFamily: 'Troubles digestifs',
    symptomDetail: "Remontée acide irritant l'œsophage",
    createdAt: '2024-02-10T00:00:00',
  },
  {
    id: '5',
    title: 'Eczéma',
    symptomFamily: 'Problèmes cutanés',
    symptomDetail: 'Inflammation chronique de la peau',
    createdAt: '2024-03-01T00:00:00',
  },
  {
    id: '6',
    title: 'Fatigue chronique',
    symptomFamily: 'Troubles nerveux',
    symptomDetail: 'Épuisement persistant sans cause apparente',
    createdAt: '2024-03-05T00:00:00',
  },
];

const PREDEFINED_FAMILIES = [
  'Troubles nerveux',
  'Troubles du sommeil',
  'Douleurs',
  'Troubles digestifs',
  'Problèmes cutanés',
  'Système respiratoire',
  'Système cardiovasculaire',
  'Système immunitaire',
  'Système musculaire',
  'Général',
];

@Component({
  selector: 'app-symptom-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent, ConfirmDialogComponent],
  templateUrl: './symptom-list.component.html',
  styleUrls: ['./symptom-list.component.scss'],
})
export class SymptomListComponent implements OnInit {
  private symptomService = inject(SymptomService);
  private toastr = inject(ToastrService);

  groupedSymptoms: { [family: string]: Symptom[] } = {};
  families: string[] = [];
  isLoading = true;
  searchTerm = '';
  family = '';

  // Delete confirmation
  showDeleteDialog = false;
  symptomToDelete: Symptom | null = null;

  get isEditMode(): boolean {
    return !!this.editingId;
  }
  get slideOverTitle(): string {
    return this.editingId ? 'Modifier le symptôme' : 'Nouveau symptôme';
  }
  get f() {
    return this.form.controls;
  }

  openNew(): void {
    this.editingId = null;
    this.form.reset();
    this.slideOverOpen = true;
  }

  loadSymptoms(): void {
    this.isLoading = true;
    this.symptomService.getGroupedByFamily(this.searchTerm, this.family).subscribe({
      next: (data) => {
        this.groupedSymptoms = data;
        this.families = Object.keys(data).sort();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadSymptoms();
  }

  onFamilyChange(family: string): void {
    this.family = family;
    this.loadSymptoms();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.family = '';
    this.loadSymptoms();
  }

  confirmDelete(symptom: Symptom): void {
    this.deletingSymptom = symptom;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.symptomToDelete) {
      this.symptomService.delete(this.symptomToDelete.id).subscribe({
        next: () => {
          const family = this.symptomToDelete?.family;
          if (family && this.groupedSymptoms[family]) {
            this.groupedSymptoms[family] = this.groupedSymptoms[family].filter(
              (s) => s.id !== this.symptomToDelete?.id,
            );
            if (this.groupedSymptoms[family].length === 0) {
              this.families = this.families.filter((f) => f !== family);
              delete this.groupedSymptoms[family];
            }
          }
          this.toastr.success('Symptôme supprimé', 'Succès');
          this.showDeleteDialog = false;
          this.symptomToDelete = null;
        },
      });
    }
    this.showDeleteDialog = false;
    this.deletingSymptom = null;
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.deletingSymptom = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
