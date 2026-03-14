import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Plant } from '../../../core/models/plant.model';
import { Property } from '../../../core/models/property.model';

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

  constructor() {
    this.plantForm = this.fb.group({
      title:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      history:     ['', [Validators.maxLength(2000)]],
      imageUrl:    ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.router.navigate(['/plants']);
    }
  }

  get title() { return this.plantForm.get('title'); }

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
