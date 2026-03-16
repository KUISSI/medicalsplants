import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SlideOverComponent } from '../../../shared/components/slide-over/slide-over.component';
import { Symptom } from '../../../core/models/symptom.model';
import { SymptomService } from '../../../core/services/symptom.service';

@Component({
  selector: 'app-symptom-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmDialogComponent, SlideOverComponent],
  templateUrl: './symptom-list.component.html',
  styleUrls: ['./symptom-list.component.scss']
})
export class SymptomListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private symptomService = inject(SymptomService);

  /* ---- data ---- */
  private allSymptoms: Symptom[] = [];
  symptoms: Symptom[] = [];
  searchTerm = '';
  selectedFamily = '';
  families: string[] = [];

  /* ---- slide-over ---- */
  slideOverOpen = false;
  editingId: string | null = null;

  form: FormGroup = this.fb.group({
    title:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    family:      ['', Validators.required],
    description: ['', Validators.maxLength(1000)]
  });

  /* ---- delete dialog ---- */
  showDeleteDialog = false;
  deletingSymptom: Symptom | null = null;

  get isEditMode(): boolean { return !!this.editingId; }
  get slideOverTitle(): string { return this.editingId ? 'Modifier le symptôme' : 'Nouveau symptôme'; }
  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.loadSymptoms();
    this.loadFamilies();
  }

  private loadSymptoms(): void {
    this.symptomService.getAll().subscribe({
      next: (data) => {
        this.allSymptoms = data;
        this.applyFilters();
      }
    });
  }

  private loadFamilies(): void {
    this.symptomService.getAllFamilies().subscribe({
      next: (data) => {
        this.families = data;
      }
    });
  }

  openNew(): void {
    this.editingId = null;
    this.form.reset();
    this.slideOverOpen = true;
  }

  openEdit(symptom: Symptom): void {
    this.editingId = symptom.id;
    this.form.patchValue({
      title:       symptom.title,
      family:      symptom.family,
      description: symptom.description || ''
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
    const { title, family, description } = this.form.value;

    if (this.editingId) {
      this.symptomService.update(this.editingId, { title, family, description }).subscribe({
        next: (updated) => {
          this.allSymptoms = this.allSymptoms.map(s => s.id === updated.id ? updated : s);
          this.applyFilters();
          this.closeSlideOver();
        }
      });
    } else {
      this.symptomService.create({ title, family, description }).subscribe({
        next: (created) => {
          this.allSymptoms = [...this.allSymptoms, created];
          if (!this.families.includes(created.family)) {
            this.loadFamilies();
          }
          this.applyFilters();
          this.closeSlideOver();
        }
      });
    }
  }

  applyFilters(): void {
    let result = this.allSymptoms;
    const term = this.searchTerm.toLowerCase().trim();
    if (term) result = result.filter(s => s.title.toLowerCase().includes(term) || s.family.toLowerCase().includes(term));
    if (this.selectedFamily) result = result.filter(s => s.family === this.selectedFamily);
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
      const id = this.deletingSymptom.id;
      this.symptomService.delete(id).subscribe({
        next: () => {
          this.allSymptoms = this.allSymptoms.filter(s => s.id !== id);
          this.applyFilters();
        }
      });
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
