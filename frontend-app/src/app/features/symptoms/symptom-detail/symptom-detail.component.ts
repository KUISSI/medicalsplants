import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SymptomService } from '../../../core/services/symptom.service';
import { PlantService } from '../../../core/services/plant.service';
import { Symptom } from '../../../core/models/symptom.model';
import { Plant, PlantPage } from '../../../core/models/plant.model';
import { NavigationService } from '../../../core/services/navigation.service';

@Component({
    selector:  'app-symptom-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './symptom-detail.component.html',
  styleUrls: ['./symptom-detail.component.scss']
})
export class descriptionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private symptomService = inject(SymptomService);
  private plantService = inject(PlantService);
  private navigationService = inject(NavigationService);

  symptom:  Symptom | null = null;
  plants: Plant[] = [];
  relatedSymptoms: Symptom[] = [];
  
  isLoading = true;
  isLoadingPlants = true;
  error: string | null = null;
  currentQueryParams: { [key: string]: any } = {}; // Property to store query params

  // Pagination
  currentPage = 0;
  totalPages = 0;
  pageSize = 12;

  // Mock Data
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isLoading = true;
        
        this.symptomService.getById(id).subscribe({
          next: (symptom) => {
            this.symptom = symptom;
            this.isLoading = false;
            this.error = null;
            if (symptom) { // Check if symptom is not null before proceeding
              this.loadPlants();
              if (symptom.family) {
                this.loadRelatedSymptoms(symptom.family);
              }
            } else {
              this.error = 'Symptôme non trouvé. (ID: ' + id + ')';
              this.isLoading = false;
            }
          },
          error: (err) => {
            this.error = 'Failed to load symptom details.';
            this.isLoading = false;
          }
        });
      } else {
        this.error = 'Aucun ID de symptôme fourni.';
        this.isLoading = false;
      }
    });

    // Capture all query parameters to pass back to the list
    this.route.queryParams.subscribe(params => {
      this.currentQueryParams = params;
    });
  }

  loadPlants(): void {
  if (!this.symptom) return;
  this.isLoadingPlants = true;
  const symptomId = this.symptom.id;
  this.plantService.getBySymptomId(symptomId, this.currentPage, this.pageSize).subscribe({
    next: (plantPage) => {
      this.plants = plantPage.content;
      this.totalPages = plantPage.totalPages;
      this.isLoadingPlants = false;
    },
    error: (err) => {
      this.plants = [];
      this.isLoadingPlants = false;
      // Optionally, set an error message for plants
    }
  });
}

  loadRelatedSymptoms(family: string): void {
    if (!family) {
      return;
    }
    this.symptomService.getByFamily(family).subscribe({
      next: (symptoms) => {
        // Ensure this.symptom is not null before trying to filter by its id
        this.relatedSymptoms = symptoms
          .filter(s => this.symptom ? s.id !== this.symptom.id : true) // Safer null check
          .slice(0, 4);
      },
      error: (err) => {
      }
    });
  }

  loadMorePlants(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      if (!this.symptom) return;
      this.isLoadingPlants = true;
      this.plantService.getBySymptomId(this.symptom.id, this.currentPage, this.pageSize).subscribe({
        next: (plantPage) => {
          this.plants = [...this.plants, ...plantPage.content];
          this.isLoadingPlants = false;
        },
        error: (err) => {
          this.isLoadingPlants = false;
        }
      });
    }
  }

  getSymptomIcon(family: string): string {
    const icons: Record<string, string> = {
      'Neurologique': '🧠',
      'Sommeil': '😴',
      'Psychologique': '🧘',
      'Respiratoire': '🫁',
      'Digestif': '🍽️',
      'General':  '💪',
      'Cutané': '🧴'
    };
    return icons[family] || '🌿';
  }

  goBack(): void {
    this.navigationService.back();
  }
 
}