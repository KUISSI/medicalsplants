import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { PlantService } from '../../../core/services/plant.service';
import { AuthService } from '../../../core/services/auth.service';
import { Plant } from '../../../core/models/plant.model';
import { ReceiptType, RECEIPT_TYPE_LABELS } from '../../../core/models/receipt.model';

@Component({
  selector: 'app-receipt-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './receipt-create.component.html',
  styleUrls: ['./receipt-create.component.scss']
})
export class ReceiptCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private plantService = inject(PlantService);
  authService = inject(AuthService);

  receiptForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    type: ['', Validators.required],
    description: [''],
    isPremium: [false],
    ingredients: this.fb.array([])
  });

  receiptTypeKeys = Object.keys(RECEIPT_TYPE_LABELS) as ReceiptType[];
  receiptTypes: Record<ReceiptType, string> = RECEIPT_TYPE_LABELS;

  plants: Plant[] = [];
  selectedPlantIds: string[] = [];
  isLoadingPlants = false;
  isSubmitting = false;

  ngOnInit(): void {
    this.loadPlants();
  }

  loadPlants(): void {
    this.isLoadingPlants = true;
    this.plantService.getAll(0, 50).subscribe({
      next: (response: any) => {
        this.plants = response.content || [];
        this.isLoadingPlants = false;
      },
      error: () => this.isLoadingPlants = false
    });
  }

  get title() { return this.receiptForm.get('title'); }
  get type() { return this.receiptForm.get('type'); }
  get description() { return this.receiptForm.get('description'); }
  get ingredients() { return this.receiptForm.get('ingredients') as FormArray; }

  addIngredient(): void {
    this.ingredients.push(this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required]
    }));
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  getReceiptTypeIcon(type: ReceiptType): string {
    const icons: Record<ReceiptType, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍽️',
      'LOTION': '🧴'
    };
    return icons[type] || '📖';
  }

  getSelectedPlants(): Plant[] {
    return this.plants.filter(p => this.selectedPlantIds.includes(p.id));
  }

  isPlantSelected(id: string): boolean {
    return this.selectedPlantIds.includes(id);
  }

  togglePlant(id: string): void {
    if (this.isPlantSelected(id)) {
      this.selectedPlantIds = this.selectedPlantIds.filter(i => i !== id);
    } else {
      this.selectedPlantIds.push(id);
    }
  }

  removeSelectedPlant(id: string): void {
    this.selectedPlantIds = this.selectedPlantIds.filter(i => i !== id);
  }

  onSubmit(): void {
    if (this.receiptForm.invalid || this.selectedPlantIds.length === 0) return;
    this.isSubmitting = true;

    // Minimal stub: replace with real service call
    setTimeout(() => {
      this.isSubmitting = false;
      this.receiptForm.reset();
      this.selectedPlantIds = [];
      this.ingredients.clear(); // Clear ingredients as well
    }, 800);
  }
}
