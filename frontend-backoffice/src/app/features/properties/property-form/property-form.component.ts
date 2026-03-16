import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
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

  propertyForm: FormGroup;
  property: Property | null = null;
  symptoms: Symptom[] = [];
  selectedSymptomIds: string[] = [];

  isLoadingData = false;
  isSaving = false;
  isEditMode = false;

  predefinedFamilies = [
    'Système nerveux', 'Défenses immunitaires', 'Douleurs', 'Système digestif',
    'Dermatologie', 'Système respiratoire', 'Système cardiovasculaire', 'Général'
  ];

  constructor() {
    this.propertyForm = this.fb.group({
      title:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      family:      ['', [Validators.required]],
      description: ['', [Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.router.navigate(['/properties']);
    }
  }

  get title() { return this.propertyForm.get('title'); }
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
    setTimeout(() => {
      this.isSaving = false;
      this.router.navigate(['/properties']);
    }, 500);
  }
}
