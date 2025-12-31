import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog. component';
import { PropertyService } from '../../../core/services/property.service';
import { Property } from '../../../core/models/property.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoaderComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component. scss']
})
export class PropertyListComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private toastr = inject(ToastrService);

  properties: Property[] = [];
  filteredProperties: Property[] = [];
  families: string[] = [];
  
  isLoading = true;
  searchTerm = '';
  selectedFamily = '';

  showDeleteDialog = false;
  propertyToDelete: Property | null = null;

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.propertyService. getAll().subscribe({
      next: (properties) => {
        this.properties = properties;
        this.filteredProperties = properties;
        this.families = [...new Set(properties.map(p => p.propertyFamily))].sort();
        this.isLoading = false;
      },
      error: () => {
        this. isLoading = false;
      }
    });
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

    if (this.selectedFamily) {
      result = result.filter(p => p.propertyFamily === this.selectedFamily);
    }

    this.filteredProperties = result;
  }

  clearFilters(): void {
    this. searchTerm = '';
    this.selectedFamily = '';
    this.filteredProperties = this.properties;
  }

  confirmDelete(property:  Property): void {
    this.propertyToDelete = property;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.propertyToDelete) {
      this.propertyService.delete(this.propertyToDelete.id).subscribe({
        next: () => {
          this.properties = this.properties. filter(p => p.id !== this. propertyToDelete?. id);
          this.applyFilters();
          this.toastr.success('Propriété supprimée', 'Succès');
          this.showDeleteDialog = false;
          this.propertyToDelete = null;
        }
      });
    }
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.propertyToDelete = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}