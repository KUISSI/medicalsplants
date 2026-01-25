import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { PlantService } from '../../../core/services/plant.service';
import { PropertyService } from '../../../core/services/property.service';
import { Plant, CreatePlantRequest, UpdatePlantRequest, AdministrationMode, ADMINISTRATION_MODE_LABELS } from '../../../core/models/plant.model';
import { Property } from '../../../core/models/property.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plant-form',
  standalone: true,
  imports:  [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl:  './plant-form.component.html',
  styleUrls:  ['./plant-form.component.scss']
})
export class PlantFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private plantService = inject(PlantService);
  private propertyService = inject(PropertyService);
  private toastr = inject(ToastrService);

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
    this.plantForm = this.fb. group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      description: ['', [Validators.maxLength(2000)]],
      administrationMode: ['', [Validators.required]],
      consumedPart: ['', [Validators. maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadProperties();
    
    const id = this.route.snapshot. params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadPlant(id);
    }
  }

  loadProperties(): void {
    this.propertyService.getAll().subscribe({
      next: (properties) => {
        this.properties = properties;
      }
    });
  }

  loadPlant(id: string): void {
    this.isLoadingData = true;
    this.plantService.getById(id).subscribe({
      next: (plant) => {
        this.plant = plant;
        this.plantForm.patchValue({
          title:  plant.title,
          description: plant. description || '',
          administrationMode: plant.administrationMode,
          consumedPart: plant.consumedPart || ''
        });
        this.selectedPropertyIds = plant.properties?. map(p => p.id) || [];
        this.isLoadingData = false;
      },
      error: () => {
        this. isLoadingData = false;
        this.router.navigate(['/plants']);
      }
    });
  }

  get title() { return this.plantForm.get('title'); }
  get administrationMode() { return this.plantForm. get('administrationMode'); }

  toggleProperty(propertyId:  string): void {
    const index = this.selectedPropertyIds. indexOf(propertyId);
    if (index > -1) {
      this. selectedPropertyIds.splice(index, 1);
    } else {
      this. selectedPropertyIds.push(propertyId);
    }
  }

  isPropertySelected(propertyId: string): boolean {
    return this. selectedPropertyIds.includes(propertyId);
  }

  onSubmit(): void {
    if (this.plantForm. invalid) {
      this.plantForm.markAllAsTouched();
      return;
    }

    this. isSaving = true;

    if (this.isEditMode && this.plant) {
      const request: UpdatePlantRequest = this.plantForm.value;
      this.plantService.update(this. plant.id, request).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastr.success('Plante mise à jour', 'Succès');
          this.router. navigate(['/plants']);
        },
        error: () => {
          this.isSaving = false;
        }
      });
    } else {
      const request: CreatePlantRequest = {
        ... this.plantForm.value,
        propertyIds: this. selectedPropertyIds
      };
      this. plantService.create(request).subscribe({
        next: () => {
          this. isSaving = false;
          this. toastr.success('Plante créée', 'Succès');
          this.router.navigate(['/plants']);
        },
        error: () => {
          this.isSaving = false;
        }
      });
    }
  }
}