import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SymptomService } from '../../../core/services/symptom.service';
import { Symptom } from '../../../core/models/symptom.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-symptom-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoaderComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './symptom-list.component.html',
  styleUrls: ['./symptom-list.component.scss']
})
export class SymptomListComponent implements OnInit {
  private symptomService = inject(SymptomService);
  private toastr = inject(ToastrService);

  symptoms: Symptom[] = [];
  filteredSymptoms:  Symptom[] = [];
  families: string[] = [];
  
  isLoading = true;
  searchTerm = '';
  selectedFamily = '';

  // Delete confirmation
  showDeleteDialog = false;
  symptomToDelete:  Symptom | null = null;

  ngOnInit(): void {
    this.loadSymptoms();
  }

  loadSymptoms(): void {
    this.isLoading = true;
    this.symptomService. getAll().subscribe({
      next: (symptoms) => {
        this.symptoms = symptoms;
        this. filteredSymptoms = symptoms;
        this.families = [... new Set(symptoms. map(s => s.symptomFamily))].sort();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = this.symptoms;

    if (this. searchTerm. trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result. filter(s =>
        s.title.toLowerCase().includes(term) ||
        s.symptomFamily.toLowerCase().includes(term)
      );
    }

    if (this.selectedFamily) {
      result = result.filter(s => s.symptomFamily === this.selectedFamily);
    }

    this.filteredSymptoms = result;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFamily = '';
    this.filteredSymptoms = this.symptoms;
  }

  confirmDelete(symptom: Symptom): void {
    this.symptomToDelete = symptom;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.symptomToDelete) {
      this.symptomService.delete(this.symptomToDelete.id).subscribe({
        next:  () => {
          this.symptoms = this.symptoms. filter(s => s.id !== this. symptomToDelete?. id);
          this.applyFilters();
          this.toastr.success('Symptôme supprimé', 'Succès');
          this.showDeleteDialog = false;
          this. symptomToDelete = null;
        }
      });
    }
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.symptomToDelete = null;
  }

  formatDate(dateString:  string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}