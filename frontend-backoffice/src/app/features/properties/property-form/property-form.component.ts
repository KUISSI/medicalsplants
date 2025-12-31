import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { PropertyService } from '../../../core/services/property.service';
import { SymptomService } from '../../../core/services/symptom.service';
import { Property, CreatePropertyRequest, UpdatePropertyRequest } from '../../../core/models/property.model';
import { Symptom } from '../../../core/models/symptom. model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-property-form',
  standalone:  true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl:  './property-form. component.html',
  styleUrls:  ['./property-form.component.scss']
})
export class PropertyFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private symptomService = inject(SymptomService);
  private toastr = inject(ToastrService);

  propertyForm: FormGroup;
  property: Property | null = null;
  symptoms: Symptom[] = [];
  selectedSymptomIds: string[] = [];
  
  isLoadingData = false;
  isSaving = false;
  isEditMode = false;

  predefinedFamilies = [
    'Analgésique',
    'Anti-inflammatoire',
    'Calmant',
    'Digestif',
    'Antimicrobien',
    'Respiratoire',
    'Stimulant',
    'Protecteur',
    'Cutané'
  ];

  constructor() {
    this.propertyForm = this. fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      propertyFamily: ['', [Validators. required]],
      propertyDetail: ['', [Validators. maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.loadSymptoms();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadProperty(id);
    }
  }

  loadSymptoms(): void {
    this.symptomService.getAll().subscribe({
      next: (symptoms) => {
        this.symptoms = symptoms;
      }
    });
  }

  loadProperty(id: string): void {
    this.isLoadingData = true;
    this.propertyService.getById(id).subscribe({
      next: (property) => {
        this.property = property;
        this.propertyForm.patchValue({
          title: property.title,
          propertyFamily: property.propertyFamily,
          propertyDetail: property. propertyDetail || ''
        });
        this.selectedSymptomIds = property.symptoms?. map(s => s.id) || [];
        this.isLoadingData = false;
      },
      error: () => {
        this.isLoadingData = false;
        this.router.navigate(['/properties']);
      }
    });
  }

  get title() { return this.propertyForm.get('title'); }
  get propertyFamily() { return this.propertyForm.get('propertyFamily'); }

  toggleSymptom(symptomId: string): void {
    const index = this.selectedSymptomIds.indexOf(symptomId);
    if (index > -1) {
      this.selectedSymptomIds.splice(index, 1);
    } else {
      this. selectedSymptomIds.push(symptomId);
    }
  }

  isSymptomSelected(symptomId: string): boolean {
    return this.selectedSymptomIds.includes(symptomId);
  }

  onSubmit(): void {
    if (this.propertyForm. invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    if (this.isEditMode && this.property) {
      const request: UpdatePropertyRequest = this.propertyForm. value;
      this.propertyService. update(this.property.id, request).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastr.success('Propriété mise à jour', 'Succès');
          this.router.navigate(['/properties']);
        },
        error:  () => {
          this.isSaving = false;
        }
      });
    } else {
      const request: CreatePropertyRequest = {
        ...this. propertyForm.value,
        symptomIds: this. selectedSymptomIds
      };
      this.propertyService.create(request).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastr.success('Propriété créée', 'Succès');
          this.router.navigate(['/properties']);
        },
        error: () => {
          this.isSaving = false;
        }
      });
    }
  }
}