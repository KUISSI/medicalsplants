import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { SymptomService } from '../../../core/services/symptom.service';
import { Symptom, CreateSymptomRequest, UpdateSymptomRequest } from '../../../core/models/symptom.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-symptom-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './symptom-form.component.html',
  styleUrls:  ['./symptom-form.component.scss']
})
export class SymptomFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private symptomService = inject(SymptomService);
  private toastr = inject(ToastrService);

  symptomForm: FormGroup;
  symptom: Symptom | null = null;
  families: string[] = [];
  
  isLoading = false;
  isLoadingData = false;
  isSaving = false;
  isEditMode = false;

  // Familles prédéfinies
  predefinedFamilies = [
    'Neurologique',
    'Sommeil',
    'Psychologique',
    'Respiratoire',
    'Digestif',
    'General',
    'Cutané',
    'Cardiovasculaire',
    'Musculaire',
    'Immunitaire'
  ];

  constructor() {
    this. symptomForm = this. fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      symptomFamily: ['', [Validators.required]],
      symptomDetail: ['', [Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.loadFamilies();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadSymptom(id);
    }
  }

  loadFamilies(): void {
    this. symptomService.getAllFamilies().subscribe({
      next:  (families) => {
        // Fusionner les familles existantes avec les prédéfinies
        this.families = [...new Set([...this.predefinedFamilies, ...families])].sort();
      },
      error:  () => {
        this.families = this.predefinedFamilies;
      }
    });
  }

  loadSymptom(id: string): void {
    this.isLoadingData = true;
    this. symptomService.getById(id).subscribe({
      next: (symptom) => {
        this.symptom = symptom;
        this.symptomForm.patchValue({
          title: symptom.title,
          symptomFamily: symptom. symptomFamily,
          symptomDetail:  symptom.symptomDetail || ''
        });
        this.isLoadingData = false;
      },
      error: () => {
        this.isLoadingData = false;
        this.router.navigate(['/symptoms']);
      }
    });
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

    if (this.isEditMode && this.symptom) {
      const request:  UpdateSymptomRequest = this.symptomForm.value;
      this.symptomService.update(this. symptom.id, request).subscribe({
        next: () => {
          this. isSaving = false;
          this.toastr.success('Symptôme mis à jour', 'Succès');
          this.router.navigate(['/symptoms']);
        },
        error: () => {
          this. isSaving = false;
        }
      });
    } else {
      const request: CreateSymptomRequest = this.symptomForm.value;
      this.symptomService.create(request).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastr.success('Symptôme créé', 'Succès');
          this.router.navigate(['/symptoms']);
        },
        error: () => {
          this.isSaving = false;
        }
      });
    }
  }
}