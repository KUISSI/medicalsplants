import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Plant, AdministrationMode, ADMINISTRATION_MODE_LABELS } from '../../../core/models/plant.model';
import { Property } from '../../../core/models/property.model';

const MOCK_PROPERTIES: Property[] = [
  { id: '1', title: 'Calmant',           propertyFamily: 'Système nerveux',       propertyDetail: '', symptoms: [], createdAt: '' },
  { id: '2', title: 'Antiseptique',       propertyFamily: 'Défenses immunitaires', propertyDetail: '', symptoms: [], createdAt: '' },
  { id: '3', title: 'Anti-inflammatoire', propertyFamily: 'Douleurs',              propertyDetail: '', symptoms: [], createdAt: '' },
  { id: '4', title: 'Digestif',           propertyFamily: 'Système digestif',      propertyDetail: '', symptoms: [], createdAt: '' },
  { id: '5', title: 'Cicatrisant',        propertyFamily: 'Dermatologie',          propertyDetail: '', symptoms: [], createdAt: '' }
];

const MOCK_PLANTS: Plant[] = [
  { id: '1', title: 'Camomille',     description: 'Plante calmante',          administrationMode: 'ORAL_ROUTE',      consumedPart: 'Fleur',   properties: [MOCK_PROPERTIES[0]], createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  { id: '2', title: 'Lavande',       description: 'Vertus relaxantes',         administrationMode: 'EPIDERMAL_ROUTE', consumedPart: 'Fleur',   properties: [], createdAt: '2024-02-10T09:00:00', updatedAt: '2024-02-10T09:00:00' },
  { id: '3', title: 'Menthe poivrée',description: 'Rafraîchissante et digestive', administrationMode: 'ORAL_ROUTE',  consumedPart: 'Feuille', properties: [MOCK_PROPERTIES[3]], createdAt: '2024-03-05T14:00:00', updatedAt: '2024-03-05T14:00:00' }
];

@Component({
  selector: 'app-plant-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './plant-form.component.html',
  styleUrls: ['./plant-form.component.scss']
})
export class PlantFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  plantForm: FormGroup;
  plant: Plant | null = null;
  properties: Property[] = [];
  selectedPropertyIds: string[] = [];

  isLoadingData = false;
  isSaving = false;
  isEditMode = false;

  administrationModes = ADMINISTRATION_MODE_LABELS;
  administrationModeKeys = Object.keys(ADMINISTRATION_MODE_LABELS) as AdministrationMode[];

  constructor() {
    this.plantForm = this.fb.group({
      title:              ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      description:        ['', [Validators.maxLength(2000)]],
      administrationMode: ['', [Validators.required]],
      consumedPart:       ['', [Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.properties = MOCK_PROPERTIES;

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      const plant = MOCK_PLANTS.find(p => p.id === id);
      if (plant) {
        this.plant = plant;
        this.plantForm.patchValue({
          title: plant.title,
          description: plant.description || '',
          administrationMode: plant.administrationMode,
          consumedPart: plant.consumedPart || ''
        });
        this.selectedPropertyIds = plant.properties?.map(p => p.id) || [];
      } else {
        this.router.navigate(['/plants']);
      }
    }
  }

  get title() { return this.plantForm.get('title'); }
  get administrationMode() { return this.plantForm.get('administrationMode'); }

  toggleProperty(propertyId: string): void {
    const index = this.selectedPropertyIds.indexOf(propertyId);
    if (index > -1) {
      this.selectedPropertyIds.splice(index, 1);
    } else {
      this.selectedPropertyIds.push(propertyId);
    }
  }

  isPropertySelected(propertyId: string): boolean {
    return this.selectedPropertyIds.includes(propertyId);
  }

  onSubmit(): void {
    if (this.plantForm.invalid) {
      this.plantForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.router.navigate(['/plants']);
    }, 500);
  }
}
