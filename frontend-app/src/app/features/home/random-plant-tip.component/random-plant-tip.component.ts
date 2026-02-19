import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantService } from '../../../core/services/plant.service';
import { Plant } from '../../../core/models/plant.model';
import { PlantPage } from '../../../core/models/plant.model';

@Component({
  selector: 'app-random-plant-tip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="!isLoading && randomPlant" class="random-plant-tip">
      
      <!-- Le saviez-vous : Tip pour bulle d'info -->
      <div class="tip-text">
        <strong>{{ randomPlant.title }} : {{ randomPlant.history }}</strong>
      </div>
    </div>
  `,
  styleUrls: ['./random-plant-tip.component.scss']
})
export class RandomPlantTipComponent implements OnInit {
  private plantService = inject(PlantService);

  randomPlant: Plant | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.plantService.getAll(0, 200).subscribe({
      next: (response: PlantPage) => {
  const plants = response.content;
        if (plants && plants.length > 0) {
      const randomIndex = Math.floor(Math.random() * plants.length);
      this.randomPlant = plants[randomIndex];
    }
    this.isLoading = false;
  },
  error: () => {
    this.isLoading = false;
  }
});
  }
}