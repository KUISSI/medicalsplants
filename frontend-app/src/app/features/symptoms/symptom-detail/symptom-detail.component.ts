import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SymptomService } from '../../../core/services/symptom.service';
import { PlantService } from '../../../core/services/plant.service';
import { Symptom } from '../../../core/models/symptom.model';
import { Plant, PlantPage, AdministrationMode, ADMINISTRATION_MODE_LABELS } from '../../../core/models/plant.model';

@Component({
  selector:  'app-symptom-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent, CardComponent],
  templateUrl: './symptom-detail.component.html',
  styleUrls: ['./symptom-detail.component.scss']
})
export class SymptomDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private symptomService = inject(SymptomService);
  private plantService = inject(PlantService);

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
      console.log('SymptomDetailComponent: ngOnInit - extracted ID:', id); // Debug log
      if (id) {
        this.isLoading = true;
        
        this.symptomService.getById(id).subscribe({
          next: (symptom) => {
            console.log('SymptomDetailComponent: symptomService.getById returned:', symptom); // Debug log
            this.symptom = symptom;
            this.isLoading = false;
            this.error = null;
            if (symptom) { // Check if symptom is not null before proceeding
              this.loadPlants();
              if (symptom.symptomFamily) {
                this.loadRelatedSymptoms(symptom.symptomFamily);
              }
            } else {
              this.error = 'Symptôme non trouvé. (ID: ' + id + ')';
              this.isLoading = false;
            }
          },
          error: (err) => {
            console.error('SymptomDetailComponent: Error fetching symptom:', err); // Debug log
            this.error = 'Failed to load symptom details.';
            this.isLoading = false;
          }
        });
      } else {
        console.log('SymptomDetailComponent: No ID found in route params.'); // Debug log
        this.error = 'Aucun ID de symptôme fourni.';
        this.isLoading = false;
      }
    });

    // Capture all query parameters to pass back to the list
    this.route.queryParams.subscribe(params => {
      this.currentQueryParams = params;
      console.log('SymptomDetailComponent: currentQueryParams:', this.currentQueryParams); // Debug log
    });
  }

  loadPlants(): void {
    if (!this.symptom) {
      console.log('SymptomDetailComponent: loadPlants called but this.symptom is null.'); // Debug log
      return;
    }

    this.isLoadingPlants = true;
    console.log('SymptomDetailComponent: Loading plants for symptom ID:', this.symptom.id); // Debug log
    
    // Ensure this.symptom.id is accessed only if this.symptom is not null
    const symptomId = this.symptom.id;
    this.plantService.getBySymptomId(symptomId, this.currentPage, this.pageSize).subscribe({
      next: (plantPage) => {
        console.log('SymptomDetailComponent: plantService.getBySymptomId returned:', plantPage); // Debug log
        this.plants = plantPage.content;
        this.totalPages = plantPage.totalPages;
        this.isLoadingPlants = false;
      },
      error: (err) => {
        console.error('SymptomDetailComponent: Error fetching plants:', err); // Debug log
        this.isLoadingPlants = false;
        // Optionally, set an error message for plants
      }
    });
  }

  loadRelatedSymptoms(family: string): void {
    if (!family) {
      console.log('SymptomDetailComponent: loadRelatedSymptoms called but family is null/empty.'); // Debug log
      return;
    }
    console.log('SymptomDetailComponent: Loading related symptoms for family:', family); // Debug log

    this.symptomService.getByFamily(family).subscribe({
      next: (symptoms) => {
        console.log('SymptomDetailComponent: symptomService.getByFamily returned:', symptoms); // Debug log
        // Ensure this.symptom is not null before trying to filter by its id
        this.relatedSymptoms = symptoms
          .filter(s => this.symptom ? s.id !== this.symptom.id : true) // Safer null check
          .slice(0, 4);
        console.log('SymptomDetailComponent: Filtered related symptoms:', this.relatedSymptoms); // Debug log
      },
      error: (err) => {
        console.error('SymptomDetailComponent: Error fetching related symptoms:', err); // Debug log
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
          console.error('Error fetching more plants:', err);
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
}