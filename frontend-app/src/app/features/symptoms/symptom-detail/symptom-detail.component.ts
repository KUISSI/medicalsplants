import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { SymptomService } from '../../../core/services/symptom.service';
import { PlantService } from '../../../core/services/plant.service';
import { Symptom } from '../../../core/models/symptom.model';
import { Plant, PlantPage, ADMINISTRATION_MODE_LABELS } from '../../../core/models/plant.model';

@Component({
  selector:  'app-symptom-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
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

  // Pagination
  currentPage = 0;
  totalPages = 0;
  pageSize = 12;

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
            this.loadPlants();
            if (symptom.symptomFamily) {
              this.loadRelatedSymptoms(symptom.symptomFamily);
            }
          },
          error: (err) => {
            console.error('Error loading symptom', err);
            this.error = 'Failed to load symptom.';
            this.isLoading = false;
          }
        });
      }
    });
  }

  loadPlants(): void {
    this.isLoadingPlants = true;
    const symptomFamily = this.symptom?.symptomFamily;

    this.plantService.getAll(0, 100).subscribe({
      next: (response: PlantPage) => {
        if (symptomFamily) {
          this.plants = response.content.filter(plant =>
            plant.symptomFamilies?.includes(symptomFamily)
          );
        } else {
          this.plants = [];
        }
        this.totalPages = 1;
        this.isLoadingPlants = false;
      },
      error: () => {
        this.isLoadingPlants = false;
      }
    });
  }

  loadRelatedSymptoms(family: string): void {
    this.symptomService.getByFamily(family).subscribe({
      next:  (symptoms: Symptom[]) => {
        // Exclure le symptôme actuel et limiter à 4
        this.relatedSymptoms = symptoms
          .filter(s => s.id !== this.symptom?.id)
          .slice(0, 4);
      }
    });
  }

  loadMorePlants(): void {
    if (this.currentPage < this.totalPages - 1 && this.symptom) {
      this.currentPage++;
      this.plantService.getBySymptomId(this.symptom.id, this.currentPage, this.pageSize).subscribe({
        next: (response: any) => {
          this.plants = [...this.plants, ...response.content];
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