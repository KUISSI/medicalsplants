import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { PlantService } from '../../../core/services/plant.service';
import { ReceiptService } from '../../../core/services/receipt.service';
import { AuthService } from '../../../core/services/auth.service';
import { Plant, AdministrationMode, ADMINISTRATION_MODE_LABELS } from '../../../core/models/plant.model';
import { Receipt, ReceiptPage, RECEIPT_TYPE_LABELS } from '../../../core/models/receipt.model';
import { RecipeCardComponent, RecipeCardData } from '../../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports:  [CommonModule, RouterModule, LoaderComponent, RecipeCardComponent],
  templateUrl: './plant-detail.component.html',
  styleUrls: ['./plant-detail.component.scss']
})
export class PlantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private plantService = inject(PlantService);
  private receiptService = inject(ReceiptService);
  authService = inject(AuthService);

  plant: Plant | null = null;
  receipts: RecipeCardData[] = [];
  
  isLoading = true;
  isLoadingReceipts = true;
  error: string | null = null;

  activeTab: 'properties' | 'recipes' = 'properties';

  administrationModeLabels = ADMINISTRATION_MODE_LABELS;
  receiptTypeLabels = RECEIPT_TYPE_LABELS;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadPlant(id);
      }
    });
  }

  switchTab(tab: 'properties' | 'recipes'): void {
    this.activeTab = tab;
  }

  loadPlant(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.plantService.getById(id).subscribe({
      next: (plant: Plant) => {
        this.plant = plant;
        this.isLoading = false;
        this.loadReceipts(id);
      },
      error:  () => {
        this.isLoading = false;
        this.error = 'Plante non trouvée';
      }
    });
  }

  loadReceipts(plantId: string): void {
    this.isLoadingReceipts = true;

    this.receiptService.getByPlantId(plantId, 0, 6).subscribe({
      next: (response: ReceiptPage) => {
        this.receipts = response.content.map(receipt => {
          const difficulties = ['Facile', 'Moyen', 'Difficile'];
          const rating = (receipt.id.charCodeAt(0) % 3) + 3; // 3, 4, or 5
          const time = ((receipt.id.charCodeAt(0) % 5) + 1) * 10; // 10, 20, 30, 40, 50
          const difficulty = difficulties[receipt.id.charCodeAt(0) % difficulties.length];

          return {
            id: receipt.id,
            title: receipt.title,
            imageUrl: receipt.imageUrl,
            category: this.receiptTypeLabels[receipt.type] || 'Recette',
            isPremium: receipt.isPremium,
            rating,
            time,
            difficulty,
          };
        });
        this.isLoadingReceipts = false;
      },
      error:  () => {
        this.isLoadingReceipts = false;
      }
    });
  }

  getAdministrationIcon(mode: AdministrationMode | undefined): string {
    const icons:  Record<AdministrationMode, string> = {
      'ORAL_ROUTE': '☕',
      'NASAL_ROUTE':  '👃',
      'EPIDERMAL_ROUTE': '🧴',
      'TOPICAL_ROUTE': '🩹',
      'OTHER': '🌿'
    };
    return mode ? icons[mode] : '🌿';
  }

  getReceiptTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍽️',
      'LOTION': '🧴'
    };
    return icons[type] || '📖';
  }

  getPropertyIcon(family: string): string {
    const icons:  Record<string, string> = {
      'Analgésique': '💊',
      'Anti-inflammatoire': '🔥',
      'Calmant': '😌',
      'Digestif': '🍽️',
      'Antimicrobien': '🦠',
      'Respiratoire': '🫁',
      'Stimulant': '⚡',
      'Protecteur': '🛡️',
      'Cutané': '🧴'
    };
    return icons[family] || '✨';
  }
}