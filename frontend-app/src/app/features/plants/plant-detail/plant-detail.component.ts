import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { PlantService } from '../../../core/services/plant.service';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Plant } from '../../../core/models/plant.model';
import { Recipe, RecipePage, RECIPE_TYPE_LABELS } from '../../../core/models/recipe.model';
import { RecipeCardComponent, RecipeCardData } from '../../../shared/components/recipe-card/recipe-card.component';
import { FavoriteService } from '../../../core/services/favorite.service';
import { FavoriteButtonComponent } from '../../../shared/components/favorite-button/favorite-button.component';

import { NavigationService } from '../../../core/services/navigation.service';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    RecipeCardComponent,
    FavoriteButtonComponent
  ],
  templateUrl: './plant-detail.component.html',
  styleUrls: ['./plant-detail.component.scss']
})
export class PlantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private plantService = inject(PlantService);
  private recipeService = inject(RecipeService);
  authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  favoriteService = inject(FavoriteService);

  plant: Plant | null = null;
  recipes: RecipeCardData[] = [];
  
  isLoading = true;
  isLoadingRecipes = true;
  error: string | null = null;
  currentQueryParams: { [key: string]: any } = {};

  activeTab: 'properties' | 'recipes' = 'properties';

  recipeTypeLabels = RECIPE_TYPE_LABELS;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadPlant(id);
      }
    });

    // Capture all query parameters to pass back to the list
    this.route.queryParams.subscribe(params => {
      this.currentQueryParams = params;
    });
  }

  switchTab(tab: 'properties' | 'recipes'): void {
    this.activeTab = tab;
    if (tab === 'recipes') {
      setTimeout(() => {
        const element = document.getElementById('recipesContent');
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - 110;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }

  loadPlant(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.plantService.getById(id).subscribe({
      next: (plant: Plant) => {
        this.plant = plant;
        this.isLoading = false;
        this.loadRecipes(id);
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Plante non trouvée';
      }
    });
  }

  loadRecipes(plantId: string): void {
    this.isLoadingRecipes = true;

    this.recipeService.getByPlantId(plantId, 0, 6).subscribe({
      next: (response: RecipePage) => {
        this.recipes = response.content.map(recipe => {
          const difficulties = ['Facile', 'Moyen', 'Difficile'];
          const rating = (recipe.id.charCodeAt(0) % 3) + 3;
          const time = ((recipe.id.charCodeAt(0) % 5) + 1) * 10;
          const difficulty = difficulties[recipe.id.charCodeAt(0) % difficulties.length];

          return {
            id: recipe.id,
            title: recipe.title,
            category: this.recipeTypeLabels[recipe.type] || 'Recette',
            premium: recipe.premium,
            rating,
            time,
            difficulty,
          };
        });
        this.isLoadingRecipes = false;
      },
      error: () => {
        this.isLoadingRecipes = false;
      }
    });
  }

  getRecipeTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍽️',
      'LOTION': '🧴',
      'OTHER': '📦'
    };
    return icons[type] || '📖';
  }

  getPropertyIcon(family: string): string {
    const icons: Record<string, string> = {
      'Analgésique': '💊',
      'Anti-inflammatoire': '🔥',
      'Calmant': '😌',
      'Digestif': '🍽️',
      'Antimicrobien': '🦠',
      'Respiratoire': '🫁',
      'Stimulant': '⚡',
      'Protecteur': '🛡️',
      'Cutané': '🧴'
    };
    return icons[family] || '✨';
  }

  goBack(): void {
    this.navigationService.back();
  }
}