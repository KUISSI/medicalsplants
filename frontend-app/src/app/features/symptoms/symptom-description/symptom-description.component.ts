import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Symptom } from '../../../core/models/symptom.model';
import { SymptomService } from '../../../core/services/symptom.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { getSymptomIcon, getFamilyColor } from '../../../core/utils/symptom-family.utils';

@Component({
  selector: 'app-symptom-description',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './symptom-description.component.html',
  styleUrls: ['./symptom-description.component.scss']
})
export class descriptionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private symptomService = inject(SymptomService);

  symptom: Symptom | undefined;
  isLoading = true;

  ngOnInit(): void {
    const symptomId = this.route.snapshot.paramMap.get('id');
    if (symptomId) {
      this.loadSymptom(symptomId);
    }
  }

  loadSymptom(id: string): void {
    this.isLoading = true;
    this.symptomService.getById(id).subscribe({
      next: (symptom) => {
        this.symptom = symptom;
        this.isLoading = false;
      },
      error: () => {
        // Fallback to mock data if the service fails
        const mockSymptoms: Symptom[] = [
          // ... (mock data unchanged)
        ];
        this.symptom = mockSymptoms.find(s => s.id === id);
        this.isLoading = false;
      }
    });
  }

  // Expose shared utility functions for template use
  getSymptomIcon = getSymptomIcon;
  getFamilyColor = getFamilyColor;
}