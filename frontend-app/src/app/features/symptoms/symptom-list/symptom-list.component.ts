import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { SymptomService } from '../../../core/services/symptom.service';
import { Symptom } from '../../../core/models/symptom.model';
import { getSymptomIcon, getFamilyColor } from '../../../core/utils/symptom-family.utils';

@Component({
  selector: 'app-symptom-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SearchBarComponent,
    LoaderComponent
  ],
  templateUrl: './symptom-list.component.html',
  styleUrls: ['./symptom-list.component.scss']
})
export class SymptomListComponent implements OnInit {
  private symptomService = inject(SymptomService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  groupedSymptoms: Record<string, Symptom[]> = {};
  families: string[] = [];
  isLoading = true;
  searchTerm = '';
  selectedFamily = '';
  viewMode: 'grid' | 'list' = 'grid';
  isScrolled = false;

  // Expose les fonctions utilitaires pour le template
  getSymptomIcon = getSymptomIcon;
  getFamilyColor = getFamilyColor;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      this.selectedFamily = params['selectedFamily'] || '';
      this.loadGroupedSymptoms();
    });
  }

  loadGroupedSymptoms(): void {
    this.isLoading = true;
    this.symptomService.getGroupedByFamily(this.searchTerm, this.selectedFamily).subscribe({
      next: (data) => {
        this.groupedSymptoms = data;
        this.families = Object.keys(data).sort();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching grouped symptoms:', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.updateUrlQueryParams();
    this.loadGroupedSymptoms();
  }

  onFamilyChange(family: string): void {
    this.selectedFamily = family;
    this.updateUrlQueryParams();
    this.loadGroupedSymptoms();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFamily = '';
    this.updateUrlQueryParams();
    this.loadGroupedSymptoms();
  }

  private updateUrlQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchTerm: this.searchTerm || null,
        selectedFamily: this.selectedFamily || null
      },
      queryParamsHandling: 'merge'
    });
  }

  get currentQueryParams() {
    const params: any = {};
    if (this.searchTerm) params['searchTerm'] = this.searchTerm;
    if (this.selectedFamily) params['selectedFamily'] = this.selectedFamily;
    return params;
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  get totalSymptoms(): number {
    return this.families
      .map(f => this.groupedSymptoms[f].length)
      .reduce((a, b) => a + b, 0);
  }

  trackBySymptomId(index: number, symptom: Symptom) {
    return symptom.id;
  }
}