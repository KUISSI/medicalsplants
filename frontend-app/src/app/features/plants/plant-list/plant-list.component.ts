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

  plants: Plant[] = [];
  filteredPlants: Plant[] = [];
  
  isLoading = true;
  searchTerm = '';
  isScrolled = false;
  errorMessage: string | null = null;

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 8;

  // Tri dynamique
  sort = 'title,asc'; // Par défaut, tri alphabétique croissant

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
    this.errorMessage = null;

    this.plantService.getAll(this.currentPage, this.pageSize, this.searchTerm, this.sort).subscribe({
      next: (response: PlantPage) => {
        this.plants = response.content;
        this.filteredPlants = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.plants = [];
        this.filteredPlants = [];
        this.errorMessage = "Erreur lors de la récupération des plantes. Vérifiez votre connexion réseau ou le serveur backend.";
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 0;
    this.loadPlants();
  }

  onSortChange(sortValue: string): void {
    this.sort = sortValue;
    this.currentPage = 0;
    this.loadPlants();
  }

  applyFilters(): void {
    let result = this.plants;
    if (this.searchTerm.trim()) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(plant =>
        plant.title.toLowerCase().includes(lowerTerm) ||
        plant.description?.toLowerCase().includes(lowerTerm)
      );
    }
    this.filteredPlants = result;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPlants();
      this.updateUrlQueryParams();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updateUrlQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchTerm: this.searchTerm || null,
        page: this.currentPage > 0 ? this.currentPage : null
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
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}