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

  groupedSymptoms: { [family: string]: Symptom[] } = {};
  families: string[] = [];
  isLoading = true;
  searchTerm = '';
  family = '';

  // Delete confirmation
  showDeleteDialog = false;
  symptomToDelete: Symptom | null = null;

  ngOnInit(): void {
    this.loadSymptoms();
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
      }
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
    this.symptomToDelete = symptom;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.symptomToDelete) {
      this.symptomService.delete(this.symptomToDelete.id).subscribe({
        next: () => {
          const family = this.symptomToDelete?.family;
          if (family && this.groupedSymptoms[family]) {
            this.groupedSymptoms[family] = this.groupedSymptoms[family].filter(s => s.id !== this.symptomToDelete?.id);
            if (this.groupedSymptoms[family].length === 0) {
              this.families = this.families.filter(f => f !== family);
              delete this.groupedSymptoms[family];
            }
          }
          this.toastr.success('Symptôme supprimé', 'Succès');
          this.showDeleteDialog = false;
          this.symptomToDelete = null;
        }
      });
    }
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.symptomToDelete = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}