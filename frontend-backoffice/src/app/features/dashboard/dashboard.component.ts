import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { SymptomService } from '../../core/services/symptom.service';
import { PropertyService } from '../../core/services/property.service';
import { PlantService } from '../../core/services/plant.service';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatsCardComponent, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private userService = inject(UserService);
  private symptomService = inject(SymptomService);
  private propertyService = inject(PropertyService);
  private plantService = inject(PlantService);
  private recipeService = inject(RecipeService);

  isLoading = true;
  error: string | null = null;

  stats = {
    users: 0,
    symptoms: 0,
    properties: 0,
    plants: 0,
    recipes: 0,
    pendingRecipes: 0,
  };

  pendingRecipes: Recipe[] = [];

  quickActions = [
    { icon: '🌿', label: 'Nouvelle plante', link: '/plants/new', color: '#4CAF50' },
    { icon: '🩺', label: 'Nouveau symptôme', link: '/symptoms/new', color: '#2196F3' },
    { icon: '✨', label: 'Nouvelle propriété', link: '/properties/new', color: '#9C27B0' },
    { icon: '⏳', label: 'Modération', link: '/recipes/moderation', color: '#FF9800' },
  ];

  today: Date = new Date();

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      users: this.userService.getAll(0, 1).pipe(map((p) => p.totalElements)),
      symptoms: this.symptomService.getAll().pipe(map((s) => s.length)),
      properties: this.propertyService.getAll().pipe(map((p) => p.length)),
      plants: this.plantService.getAll(0, 1).pipe(map((p) => p.totalElements)),
      recipes: this.recipeService.getAll(0, 1).pipe(map((p) => p.totalElements)),
      pending: this.recipeService.getAll(0, 5, 'PENDING'),
    }).subscribe({
      next: ({ users, symptoms, properties, plants, recipes, pending }) => {
        this.stats = {
          users,
          symptoms,
          properties,
          plants,
          recipes,
          pendingRecipes: pending.totalElements,
        };
        this.pendingRecipes = pending.content;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des statistiques';
        this.isLoading = false;
      },
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
