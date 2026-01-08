import { Component, OnInit, inject, HostListener } from '@angular/core';
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
  templateUrl: './plant-list.component.html',
  styleUrl: './plant-list.component.scss'
})
export class PlantListComponent implements OnInit {
  private plantService = inject(PlantService);

  // Mock plants data
  mockPlants: Plant[] = [
    { id: '1', title: 'Menthe poivrée', description: 'Plante digestive et rafraîchissante', consumedPart: 'Feuilles', administrationMode: 'ORAL_ROUTE' as AdministrationMode, createdAt: new Date().toISOString() } as Plant,
    { id: '2', title: 'Camomille', description: 'Plante relaxante pour le sommeil', consumedPart: 'Fleurs', administrationMode: 'ORAL_ROUTE' as AdministrationMode, createdAt: new Date().toISOString() } as Plant,
    { id: '3', title: 'Gingembre', description: 'Racine anti-inflammatoire et tonifiante', consumedPart: 'Rhizome', administrationMode: 'ORAL_ROUTE' as AdministrationMode, createdAt: new Date().toISOString() } as Plant,
    { id: '4', title: 'Lavande', description: 'Plante apaisante et anti-stress', consumedPart: 'Fleurs', administrationMode: 'EPIDERMAL_ROUTE' as AdministrationMode, createdAt: new Date().toISOString() } as Plant,
    { id: '5', title: 'Eucalyptus', description: 'Plante respiratoire puissante', consumedPart: 'Feuilles', administrationMode: 'NASAL_ROUTE' as AdministrationMode, createdAt: new Date().toISOString() } as Plant,
    { id: '6', title: 'Thé vert', description: 'Antioxydant et énergisant', consumedPart: 'Feuilles', administrationMode: 'ORAL_ROUTE' as AdministrationMode, createdAt: new Date().toISOString() } as Plant
  ];

  plants: Plant[] = [];
  filteredPlants: Plant[] = [];
  
  isLoading = true;
  searchTerm = '';
  selectedMode: AdministrationMode | '' = '';
  isScrolled = false;

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 20;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  administrationModes = ADMINISTRATION_MODE_LABELS;
  administrationModeKeys = Object.keys(ADMINISTRATION_MODE_LABELS) as AdministrationMode[];

  ngOnInit(): void {
    this.loadPlants();
  }

  loadPlants(): void {
    this.isLoading = true;

    this.plantService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response:  PlantPage) => {
        this.plants = response.content.length > 0 ? response.content : this.mockPlants;
        this.filteredPlants = this.plants;
        this.totalPages = response.totalPages;
        this. totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: () => {
        // En cas d'erreur, utiliser les mock data
        this.plants = this.mockPlants;
        this.filteredPlants = this.mockPlants;
        this.totalPages = 1;
        this.totalElements = this.mockPlants.length;
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

  getAdministrationIcon(mode: AdministrationMode | undefined): string {
    const icons: Record<AdministrationMode, string> = {
      'ORAL_ROUTE': '☕',
      'NASAL_ROUTE':  '👃',
      'EPIDERMAL_ROUTE':  '🧴',
      'TOPICAL_ROUTE': '🩹',
      'OTHER': '🌿'
    };
    return mode ? icons[mode] : '🌿';
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