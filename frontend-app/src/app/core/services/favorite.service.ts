import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private plantKey = 'favoritePlants';
  private recipeKey = 'favoriteRecipes';

  favoritesChanged = new Subject<void>();

  // Plantes
  getFavoritePlants(): string[] {
    return JSON.parse(localStorage.getItem(this.plantKey) || '[]');
  }
  isPlantFavorite(id: string): boolean {
    return this.getFavoritePlants().includes(id);
  }
  togglePlantFavorite(id: string): void {
    const favorites = this.getFavoritePlants();
    const index = favorites.indexOf(id);
    if (index > -1) favorites.splice(index, 1);
    else favorites.push(id);
    localStorage.setItem(this.plantKey, JSON.stringify(favorites));
    this.favoritesChanged.next();
  }

  // Recettes
  getFavoriteRecipes(): string[] {
    return JSON.parse(localStorage.getItem(this.recipeKey) || '[]');
  }
  isRecipeFavorite(id: string): boolean {
    return this.getFavoriteRecipes().includes(id);
  }
  toggleRecipeFavorite(id: string): void {
    const favorites = this.getFavoriteRecipes();
    const index = favorites.indexOf(id);
    if (index > -1) favorites.splice(index, 1);
    else favorites.push(id);
    localStorage.setItem(this.recipeKey, JSON.stringify(favorites));
    this.favoritesChanged.next();
  }
}