import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { PlantService } from '../../core/services/plant.service';
import { RecipeService } from '../../core/services/recipe.service';
import { Plant } from '../../core/models/plant.model';
import { Recipe } from '../../core/models/recipe.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  favoriteService = inject(FavoriteService);
  plantService = inject(PlantService);
  recipeService = inject(RecipeService);

  favoritePlants: Plant[] = [];
  favoriteRecipes: Recipe[] = [];

  private favSub?: Subscription;

  ngOnInit() {
    this.loadFavoritePlants();
    this.loadFavoriteRecipes();
    // Pour la réactivité si favoris changent ailleurs
    this.favSub = this.favoriteService.favoritesChanged?.subscribe(() => {
      this.loadFavoritePlants();
      this.loadFavoriteRecipes();
    });
  }

  ngOnDestroy() {
    this.favSub?.unsubscribe();
  }

  loadFavoritePlants() {
    const favoriteIds = this.favoriteService.getFavoritePlants();
    this.plantService.getAll(0, 1000, '', 'title,asc').subscribe(response => {
      this.favoritePlants = response.content.filter((plant: Plant) => favoriteIds.includes(plant.id));
    });
  }

 loadFavoriteRecipes() {
  const favoriteIds = this.favoriteService.getFavoriteRecipes();
  this.recipeService.getPublished(0, 1000, 'title,asc').subscribe(response => {
    this.favoriteRecipes = response.content.filter((recipe: any) => favoriteIds.includes(recipe.id));
  });
}

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year:  'numeric'
    });
  }

  getRoleBadge(role:  string): { label: string; class: string } {
    switch (role) {
      case 'ADMIN': 
        return { label:  '👑 Administrateur', class:  'badge--admin' };
      case 'PREMIUM':
        return { label: '⭐ Premium', class: 'badge--premium' };
      default:
        return { label: '👤 Utilisateur', class: 'badge--user' };
    }
  }

  logout(): void {
    this.authService.logout();
  }
}