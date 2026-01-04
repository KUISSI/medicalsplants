import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
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
    CardComponent,
    LoaderComponent
  ],
  templateUrl: './symptom-list.component.html',
  styleUrls: ['./symptom-list.component.scss']
})
export class SymptomListComponent implements OnInit {
  private symptomService = inject(SymptomService);

  symptoms: Symptom[] = [];
  filteredSymptoms:  Symptom[] = [];
  groupedSymptoms:  Record<string, Symptom[]> = {};
  families: string[] = [];
  
  isLoading = true;
  searchTerm = '';
  selectedFamily = '';
  viewMode:  'grid' | 'list' = 'grid';

  ngOnInit(): void {
    this.loadSymptoms();
  }

  loadSymptoms(): void {
    this.isLoading = true;
    
    this.symptomService. getAll().subscribe({
      next: (symptoms) => {
        this.symptoms = symptoms;
        this. filteredSymptoms = symptoms;
        
        // Extraire les familles uniques
        this. families = [... new Set(symptoms. map(s => s.symptomFamily))].sort();
        
        // Grouper par famille
        this.groupByFamily();
        
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  groupByFamily(): void {
    this.groupedSymptoms = this.filteredSymptoms. reduce((acc, symptom) => {
      const family = symptom.symptomFamily;
      if (! acc[family]) {
        acc[family] = [];
      }
      acc[family].push(symptom);
      return acc;
    }, {} as Record<string, Symptom[]>);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onFamilyChange(family: string): void {
    this.selectedFamily = family;
    this. applyFilters();
  }

  applyFilters(): void {
    let result = this.symptoms;

    // Filtre par recherche
    if (this.searchTerm. trim()) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(symptom =>
        symptom. title.toLowerCase().includes(lowerTerm) ||
        symptom.symptomFamily.toLowerCase().includes(lowerTerm) ||
        symptom.symptomDetail?. toLowerCase().includes(lowerTerm)
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
    this.filteredSymptoms = this.symptoms;
    this.groupByFamily();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  getSymptomIcon(family: string): string {
    const icons:  Record<string, string> = {
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
      'Psychologique':  '#00BCD4',
      'Respiratoire': '#4CAF50',
      'Digestif': '#FF9800',
      'General': '#607D8B',
      'Cutané': '#E91E63',
      'Cardiovasculaire': '#F44336',
      'Musculaire': '#795548',
      'Immunitaire':  '#009688'
    };
    return colors[family] || '#4CAF50';
  }
}