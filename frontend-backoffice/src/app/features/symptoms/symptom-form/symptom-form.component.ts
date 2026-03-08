import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Symptom } from '../../../core/models/symptom.model';

const MOCK_SYMPTOMS: Symptom[] = [
  { id: '1', title: 'Anxiété',          symptomFamily: 'Troubles nerveux',    symptomDetail: 'Sentiment persistant d\'inquiétude', createdAt: '2024-01-10T00:00:00' },
  { id: '2', title: 'Insomnie',          symptomFamily: 'Troubles du sommeil', symptomDetail: 'Difficulté à s\'endormir',           createdAt: '2024-01-15T00:00:00' },
  { id: '3', title: 'Migraine',          symptomFamily: 'Douleurs',            symptomDetail: 'Maux de tête intenses',              createdAt: '2024-02-01T00:00:00' },
  { id: '6', title: 'Fatigue chronique', symptomFamily: 'Troubles nerveux',    symptomDetail: 'Épuisement persistant',              createdAt: '2024-03-05T00:00:00' }
];

@Component({
  selector: 'app-symptom-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './symptom-form.component.html',
  styleUrls: ['./symptom-form.component.scss']
})
export class SymptomFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  symptomForm: FormGroup;
  symptom: Symptom | null = null;

  isLoadingData = false;
  isSaving = false;
  isEditMode = false;

  predefinedFamilies = [
    'Troubles nerveux', 'Troubles du sommeil', 'Douleurs', 'Troubles digestifs',
    'Problèmes cutanés', 'Système respiratoire', 'Système cardiovasculaire',
    'Système immunitaire', 'Système musculaire', 'Général'
  ];

  get families(): string[] {
    return this.predefinedFamilies;
  }

  constructor() {
    this.symptomForm = this.fb.group({
      title:         ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      symptomFamily: ['', [Validators.required]],
      symptomDetail: ['', [Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      const symptom = MOCK_SYMPTOMS.find(s => s.id === id);
      if (symptom) {
        this.symptom = symptom;
        this.symptomForm.patchValue({
          title:         symptom.title,
          symptomFamily: symptom.symptomFamily,
          symptomDetail: symptom.symptomDetail || ''
        });
      } else {
        this.router.navigate(['/symptoms']);
      }
    }
  }

  get title() { return this.symptomForm.get('title'); }
  get symptomFamily() { return this.symptomForm.get('symptomFamily'); }
  get symptomDetail() { return this.symptomForm.get('symptomDetail'); }

  onSubmit(): void {
    if (this.symptomForm.invalid) {
      this.symptomForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.router.navigate(['/symptoms']);
    }, 500);
  }
}
