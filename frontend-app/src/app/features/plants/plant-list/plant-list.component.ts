import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { PlantService } from '../../../core/services/plant.service';
import { Plant, PlantPage, AdministrationMode, ADMINISTRATION_MODE_LABELS } from '../../../core/models/plant.model';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SearchBarComponent,
    LoaderComponent
  ],
  templateUrl:  './plant-list.component.html',
  styleUrls:  ['./plant-list.component.scss']
})
export class PlantListComponent implements OnInit {
  private plantService = inject(PlantService);

  plants: Plant[] = [];
  filteredPlants: Plant[] = [];
  
  isLoading = true;
  searchTerm = '';
  selectedMode: AdministrationMode | '' = '';

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 20;

  administrationModes = ADMINISTRATION_MODE_LABELS;
  administrationModeKeys = Object.keys(ADMINISTRATION_MODE_LABELS) as AdministrationMode[];

  ngOnInit(): void {
    this.loadPlants();
  }

  loadPlants(): void {
    this.isLoading = true;

    this.plantService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response:  PlantPage) => {
        this.plants = response.content;
        this.filteredPlants = response.content;
        this.totalPages = response.totalPages;
        this. totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onModeChange(mode:  AdministrationMode | ''): void {
    this.selectedMode = mode;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.plants;

    // Filtre par recherche
    if (this.searchTerm. trim()) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(plant =>
        plant.title.toLowerCase().includes(lowerTerm) ||
        plant. description?. toLowerCase().includes(lowerTerm) ||
        plant. consumedPart?. toLowerCase().includes(lowerTerm)
      );
    }

    // Filtre par mode d'administration
    if (this.selectedMode) {
      result = result.filter(plant => plant.administrationMode === this. selectedMode);
    }

    this. filteredPlants = result;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedMode = '';
    this.filteredPlants = this.plants;
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this. loadPlants();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getAdministrationIcon(mode: AdministrationMode): string {
    const icons: Record<AdministrationMode, string> = {
      'ORAL_ROUTE': '☕',
      'NASAL_ROUTE':  '👃',
      'EPIDERMAL_ROUTE':  '🧴'
    };
    return icons[mode] || '🌿';
  }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this. currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}