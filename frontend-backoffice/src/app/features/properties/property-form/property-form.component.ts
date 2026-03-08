import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Property } from '../../../core/models/property.model';
import { Symptom } from '../../../core/models/symptom.model';

const MOCK_SYMPTOMS: Symptom[] = [
  { id: '1', title: 'Anxiété',          symptomFamily: 'Troubles nerveux',    symptomDetail: '', createdAt: '' },
  { id: '2', title: 'Insomnie',          symptomFamily: 'Troubles du sommeil', symptomDetail: '', createdAt: '' },
  { id: '3', title: 'Migraine',          symptomFamily: 'Douleurs',            symptomDetail: '', createdAt: '' },
  { id: '4', title: 'Reflux gastrique',  symptomFamily: 'Troubles digestifs',  symptomDetail: '', createdAt: '' },
  { id: '5', title: 'Eczéma',            symptomFamily: 'Problèmes cutanés',   symptomDetail: '', createdAt: '' }
];

const MOCK_PROPERTIES: Property[] = [
  { id: '1', title: 'Calmant',           propertyFamily: 'Système nerveux',       propertyDetail: 'Réduit l\'anxiété', symptoms: [MOCK_SYMPTOMS[0]], createdAt: '' },
  { id: '3', title: 'Anti-inflammatoire',propertyFamily: 'Douleurs',              propertyDetail: 'Réduit l\'inflammation', symptoms: [MOCK_SYMPTOMS[2]], createdAt: '' }
];

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
      title:          ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      propertyFamily: ['', [Validators.required]],
      propertyDetail: ['', [Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.symptoms = MOCK_SYMPTOMS;

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      const property = MOCK_PROPERTIES.find(p => p.id === id);
      if (property) {
        this.property = property;
        this.propertyForm.patchValue({
          title:          property.title,
          propertyFamily: property.propertyFamily,
          propertyDetail: property.propertyDetail || ''
        });
        this.selectedSymptomIds = property.symptoms?.map(s => s.id) || [];
      } else {
        this.router.navigate(['/properties']);
      }
    }
  }

  get title() { return this.propertyForm.get('title'); }
  get propertyFamily() { return this.propertyForm.get('propertyFamily'); }

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
