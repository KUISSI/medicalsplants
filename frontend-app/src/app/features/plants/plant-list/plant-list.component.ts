import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { PlantService } from '../../../core/services/plant.service';
import { Plant, PlantPage } from '../../../core/models/plant.model';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Mock plants data
  mockPlants: Plant[] = [
    { id: '550e8400-e29b-41d4-a716-446655440000', title: 'Menthe poivrée', description: 'Plante digestive et rafraîchissante', consumedPart: 'Feuilles', createdAt: new Date().toISOString() } as Plant,
    { id: '550e8400-e29b-41d4-a716-446655440001', title: 'Camomille', description: 'Plante relaxante pour le sommeil', consumedPart: 'Fleurs', createdAt: new Date().toISOString() } as Plant,
    { id: '550e8400-e29b-41d4-a716-446655440002', title: 'Gingembre', description: 'Racine anti-inflammatoire et tonifiante', consumedPart: 'Rhizome', createdAt: new Date().toISOString() } as Plant,
    { id: '550e8400-e29b-41d4-a716-446655440003', title: 'Lavande', description: 'Plante apaisante et anti-stress', consumedPart: 'Fleurs', createdAt: new Date().toISOString() } as Plant,
    { id: '550e8400-e29b-41d4-a716-446655440004', title: 'Eucalyptus', description: 'Plante respiratoire puissante', consumedPart: 'Feuilles', createdAt: new Date().toISOString() } as Plant,
    { id: '550e8400-e29b-41d4-a716-446655440005', title: 'Thé vert', description: 'Antioxydant et énergisant', consumedPart: 'Feuilles', createdAt: new Date().toISOString() } as Plant
  ];

  plants: Plant[] = [];
  filteredPlants: Plant[] = [];
  
  isLoading = true;
  searchTerm = '';
  isScrolled = false;

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 8;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 0;
      this.loadPlants();
    });
  }

  loadPlants(): void {
    this.isLoading = true;

    this.plantService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response:  PlantPage) => {
        this.plants = response.content.length > 0 ? response.content : this.mockPlants;
        this.applyFilters(); // Apply filters to the loaded data
        this.totalPages = response.totalPages;
        this. totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: () => {
        // En cas d'erreur, utiliser les mock data
        this.plants = this.mockPlants;
        this.applyFilters(); // Apply filters to the loaded data
        this.totalPages = 1;
        this.totalElements = this.mockPlants.length;
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 0; // Reset page on new search
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  applyFilters(): void {
    let result = this.plants;

    // Filtre par recherche
    if (this.searchTerm. trim()) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(plant =>
        plant.title.toLowerCase().includes(lowerTerm) ||
        plant. description?. toLowerCase().includes(lowerTerm)
      );
    }

    this. filteredPlants = result;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.applyFilters(); // Apply filters to reset the list
    this.updateUrlQueryParams(); // Update URL to clear params
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPlants();
      this.updateUrlQueryParams(); // Update URL on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updateUrlQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchTerm: this.searchTerm || null,
        page: this.currentPage > 0 ? this.currentPage : null // Only add page if not 0
      },
      queryParamsHandling: 'merge'
    });
  }

  get currentQueryParams() {
    const params: any = {};
    if (this.searchTerm) {
      params['searchTerm'] = this.searchTerm;
    }
    if (this.currentPage > 0) {
      params['page'] = this.currentPage;
    }
    return params;
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