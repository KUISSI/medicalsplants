import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { PropertyService } from '../../../core/services/property.service';
import { SymptomService } from '../../../core/services/symptom.service';
import { Property } from '../../../core/models/property.model';
import { Symptom } from '../../../core/models/symptom.model';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private symptomService = inject(SymptomService);

  propertyForm: FormGroup;
  property: Property | null = null;
  symptoms: Symptom[] = [];
  selectedSymptomIds: string[] = [];
  isLoadingData = false;
  isSaving = false;
  isEditMode = false;
  error = '';

  predefinedFamilies = [
    'Systeme nerveux', 'Defenses immunitaires', 'Douleurs', 'Systeme digestif',
    'Dermatologie', 'Systeme respiratoire', 'Systeme cardiovasculaire', 'General'
  ];

  constructor() {
    this.propertyForm = this.fb.group({
      title:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      family:      ['', [Validators.required]],
      description: ['', [Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.symptomService.getAll().subscribe({
      next: (symptoms) => this.symptoms = symptoms,
      error: () => {}
    });
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.isLoadingData = true;
      this.propertyService.getById(id).subscribe({
        next: (property) => {
          this.property = property;
          this.propertyForm.patchValue({
            title:       property.title,
            family:      property.family,
            description: property.description
          });
          this.selectedSymptomIds = (property.symptoms || []).map(s => s.id);
          this.isLoadingData = false;
        },
        error: () => {
          this.isLoadingData = false;
          this.router.navigate(['/properties']);
        }
      });
    }
  }

  get title()  { return this.propertyForm.get('title'); }
  get family() { return this.propertyForm.get('family'); }

  toggleSymptom(symptomId: string): void {
    const index = this.selectedSymptomIds.indexOf(symptomId);
    if (index > -1) {
      this.selectedSymptomIds.splice(index, 1);
    } else {
      this.selectedSymptomIds.push(symptomId);
    }
  }

  isSymptomSelected(symptomId: string): boolean {
    return this.selectedSymptomIds.includes(symptomId);
  }

  onSubmit(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.error = '';
    const formValue = { ...this.propertyForm.value, symptomIds: this.selectedSymptomIds };
    const obs = this.isEditMode && this.property
      ? this.propertyService.update(this.property.id, formValue)
      : this.propertyService.create(formValue);
    obs.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/properties']);
      },
      error: () => {
        this.isSaving = false;
        this.error = 'Erreur lors de la sauvegarde.';
      }
    });
  }
}