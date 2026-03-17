import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { SymptomService } from '../../../core/services/symptom.service';
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
  private symptomService = inject(SymptomService);

  symptomForm: FormGroup;
  symptom: Symptom | null = null;
  isLoadingData = false;
  isSaving = false;
  isEditMode = false;
  error = '';

  families: string[] = [
    'Troubles nerveux', 'Troubles du sommeil', 'Douleurs', 'Troubles digestifs',
    'Problemes cutanes', 'Systeme respiratoire', 'Systeme cardiovasculaire',
    'Systeme immunitaire', 'Systeme musculaire', 'General'
  ];

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
      this.isLoadingData = true;
      this.symptomService.getById(id).subscribe({
        next: (symptom) => {
          this.symptom = symptom;
          this.symptomForm.patchValue({
            title:       symptom.title,
            family:      symptom.family,
            description: symptom.description
          });
          this.isLoadingData = false;
        },
        error: () => {
          this.isLoadingData = false;
          this.router.navigate(['/symptoms']);
        }
      });
    }
  }

  get title()       { return this.symptomForm.get('title'); }
  get family()      { return this.symptomForm.get('family'); }
  get description() { return this.symptomForm.get('description'); }

  onSubmit(): void {
    if (this.symptomForm.invalid) {
      this.symptomForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.error = '';
    const obs = this.isEditMode && this.symptom
      ? this.symptomService.update(this.symptom.id, this.symptomForm.value)
      : this.symptomService.create(this.symptomForm.value);
    obs.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/symptoms']);
      },
      error: () => {
        this.isSaving = false;
        this.error = 'Erreur lors de la sauvegarde.';
      }
    });
  }
}