import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { PlantService } from '../../../core/services/plant.service';
import { ReceiptService } from '../../../core/services/receipt.service';
import { AuthService } from '../../../core/services/auth.service';
import { Plant, ADMINISTRATION_MODE_LABELS } from '../../../core/models/plant.model';
import { Receipt, ReceiptPage, RECEIPT_TYPE_LABELS } from '../../../core/models/receipt.model';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports:  [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './plant-detail.component.html',
  styleUrls: ['./plant-detail.component.scss']
})
export class PlantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private plantService = inject(PlantService);
  private receiptService = inject(ReceiptService);
  authService = inject(AuthService);

  plant: Plant | null = null;
  receipts: Receipt[] = [];
  
  isLoading = true;
  isLoadingReceipts = true;
  error: string | null = null;

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
        this.receipts = response.content;
        this.isLoadingReceipts = false;
      },
      error:  () => {
        this.isLoadingReceipts = false;
      }
    });
  }

  getAdministrationIcon(mode: string): string {
    const icons:  Record<string, string> = {
      'ORAL_ROUTE': '☕',
      'NASAL_ROUTE':  '👃',
      'EPIDERMAL_ROUTE': '🧴'
    };
    return icons[mode] || '🌿';
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