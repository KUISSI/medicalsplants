import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
// import { CustomDropdownComponent } from '../../../shared/components/custom-dropdown/custom-dropdown.component'; // Removed
import { SymptomService } from '../../../core/services/symptom.service';
import { Symptom } from '../../../core/models/symptom.model';

@Component({
  selector: 'app-symptom-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SearchBarComponent,
    LoaderComponent
    // CustomDropdownComponent // Removed
  ],
  templateUrl: './symptom-list.component.html',
  styleUrls: ['./symptom-list.component.scss']
})
export class SymptomListComponent implements OnInit {
  private symptomService = inject(SymptomService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  symptoms: Symptom[] = [];
  filteredSymptoms:  Symptom[] = [];
  groupedSymptoms:  Record<string, Symptom[]> = {};
  families: string[] = [];

  isLoading = true;
  searchTerm = '';
  selectedFamily = '';
  viewMode:  'grid' | 'list' = 'grid';
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      this.selectedFamily = params['selectedFamily'] || '';
      this.loadSymptoms(); // Load symptoms and then apply filters
    });
  }

    loadSymptoms(): void {
      this.isLoading = true;
      
      this.symptomService.getAll().subscribe({
        next: (symptoms) => {
          this.symptoms = symptoms;
          this.families = [...new Set(this.symptoms.map(s => s.symptomFamily))].sort();
          this.applyFilters(); // Apply filters after loading data
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching symptoms:', err);
          this.isLoading = false;
          // Optionally, set an error message
        }
      });
    }
  groupByFamily(): void {
    this.groupedSymptoms = this.filteredSymptoms.reduce((acc, symptom) => {
      const family = symptom.symptomFamily;
      if (!acc[family]) {
        acc[family] = [];
      }
      acc[family].push(symptom);
      return acc;
    }, {} as Record<string, Symptom[]>);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  onFamilyChange(family: string): void {
    this.selectedFamily = family;
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  applyFilters(): void {
    let result = this.symptoms;

    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(symptom =>
        symptom.title.toLowerCase().includes(lowerTerm) ||
        symptom.symptomFamily.toLowerCase().includes(lowerTerm) ||
        symptom.description?.toLowerCase().includes(lowerTerm)
      );
    }

    // Filtre par famille
    if (this.selectedFamily) {
      result = result.filter(symptom => symptom.symptomFamily === this.selectedFamily);
    }

    this.filteredSymptoms = result;
    this.groupByFamily();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFamily = '';
    this.applyFilters(); // Apply filters to reset the list
    this.updateUrlQueryParams(); // Update URL to clear params
  }

  private updateUrlQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchTerm: this.searchTerm || null,
        selectedFamily: this.selectedFamily || null
      },
      queryParamsHandling: 'merge' // This keeps existing query params if not explicitly overwritten
    });
  }

  get currentQueryParams() {
    const params: any = {};
    if (this.searchTerm) {
      params['searchTerm'] = this.searchTerm;
    }
    if (this.selectedFamily) {
      params['selectedFamily'] = this.selectedFamily;
    }
    return params;
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  getSymptomIcon(family: string): string {
    const icons: Record<string, string> = {
      'Neurologique': '🧠',
      'Sommeil': '😴',
      'Psychologique': '🧘',
      'Respiratoire': '🫁',
      'Digestif': '🍽️',
      'General': '💪',
      'Cutané': '🧴',
      'Cardiovasculaire': '❤️',
      'Musculaire': '💪',
      'Immunitaire': '🛡️'
    };
    return icons[family] || '🌿';
  }

  getFamilyColor(family: string): string {
    const colors: Record<string, string> = {
      'Neurologique': '#9C27B0',
      'Sommeil': '#3F51B5',
      'Psychologique': '#00BCD4',
      'Respiratoire': '#4CAF50',
      'Digestif': '#FF9800',
      'General': '#607D8B',
      'Cutané': '#E91E63',
      'Cardiovasculaire': '#F44336',
      'Musculaire': '#795548',
      'Immunitaire': '#009688'
    };
    return colors[family] || '#4CAF50';
  }
}
