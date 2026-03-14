import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Symptom } from '../../../core/models/symptom.model';


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
      title:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      family:      ['', [Validators.required]],
      description: ['', [Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.router.navigate(['/symptoms']);
    }
  }

  get title() { return this.symptomForm.get('title'); }
  get family() { return this.symptomForm.get('family'); }
  get description() { return this.symptomForm.get('description'); }

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
