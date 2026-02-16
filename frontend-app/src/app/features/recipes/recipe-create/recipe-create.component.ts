import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { RecipeType, RECIPE_TYPE_LABELS, CreateRecipeRequest } from '../../../core/models/recipe.model';
import { Plant } from '../../../core/models/plant.model';
import { RecipeService } from '../../../core/services/recipe.service';
import { PlantService } from '../../../core/services/plant.service';

@Component({
  selector: 'app-recipe-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.scss']
})
export class RecipeCreateComponent implements OnInit {

  recipeForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  plants: Plant[] = [];
  selectedPlantIds: string[] = [];

  RecipeTypes = RECIPE_TYPE_LABELS;
  RecipeTypeKeys = Object.keys(RECIPE_TYPE_LABELS) as RecipeType[];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private plantService: PlantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPlants();
  }

  initForm(): void {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: ['HOT_DRINK', Validators.required],
      description: ['', Validators.maxLength(1000)],
      preparationTime: [null, [Validators.min(1), Validators.max(480)]],
      difficulty: ['MEDIUM'],
      servings: [null, [Validators.min(1), Validators.max(50)]],
      ingredients: ['', Validators.maxLength(2000)],
      instructions: ['', Validators.maxLength(5000)],
      premium: [false]
    });
  }

  loadPlants(): void {
    this.plantService.getAll().subscribe({
      next: (response) => {
        this.plants = response.content || response;
      },
      error: (err) => console.error('Erreur chargement plantes', err)
    });
  }

  togglePlant(plantId: string): void {
    const index = this.selectedPlantIds.indexOf(plantId);
    if (index > -1) {
      this.selectedPlantIds.splice(index, 1);
    } else {
      this.selectedPlantIds.push(plantId);
    }
  }

  isPlantSelected(plantId: string): boolean {
    return this.selectedPlantIds.includes(plantId);
  }

  getRecipeTypeIcon(type: RecipeType): string {
    const icons: Record<RecipeType, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍲',
      'LOTION': '🧴',
      'OTHER': '📦'
    };
    return icons[type] || '📦';
  }

  onSubmit(): void {
    if (this.recipeForm.invalid || this.selectedPlantIds.length === 0) {
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.recipeForm.value;
    const request: CreateRecipeRequest = {
      title: formValue.title,
      type: formValue.type,
      description: formValue.description || undefined,
      preparationTime: formValue.preparationTime || undefined,
      difficulty: formValue.difficulty || undefined,
      servings: formValue.servings || undefined,
      ingredients: formValue.ingredients || undefined,
      instructions: formValue.instructions || undefined,
      premium: formValue.premium || false,
      plantIds: this.selectedPlantIds
    };

    this.recipeService.create(request).subscribe({
      next: (recipe) => {
        this.isSubmitting = false;
        this.router.navigate(['/recipes', recipe.id]);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = 'Erreur lors de la création de la recette';
        console.error(err);
      }
    });
  }
}