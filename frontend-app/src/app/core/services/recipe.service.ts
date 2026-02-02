import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Recipe, RecipePage, CreateRecipeRequest } from '../models/recipe.model';
import { MessageResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

private readonly apiUrl = `${environment.apiUrl}/recipes`;
  private mockRecipes: Recipe[] = [
    {
      id: '55555555-5555-5555-5555-555555555501',
      title: 'Tisane relaxante',
      type: 'HOT_DRINK',
      description: 'Mélange de plantes pour favoriser la détente et le sommeil.',
      isPremium: false,
      status: 'PUBLISHED',
      plants: [
        {
          id: '33333333-3333-3333-3333-333333333302',
          title: 'Camomille',
          symptomFamilies: ['Cutané', 'Digestif'],
          createdAt: new Date().toISOString()
        }
      ],
      ingredients: ['1 cuillère à café de fleurs de camomille séchées', '250 ml d\'eau chaude', '1 cuillère à café de miel (optionnel)'],
      createdAt: new Date().toISOString()
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      title: 'Lotion apaisante à la lavande',
      type: 'LOTION',
      description: 'Une lotion maison pour apaiser les irritations de la peau.',
      isPremium: true,
      status: 'PUBLISHED',
      plants: [
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          title: 'Lavande',
          symptomFamilies: ['Cutané', 'Nerveux'],
          createdAt: new Date().toISOString()
        }
      ],
      ingredients: ['10 gouttes d\'huile essentielle de lavande', '100 ml d\'huile de coco', '50 ml d\'aloe vera'],
      createdAt: new Date().toISOString()
    }
  ];

  constructor(private http: HttpClient) {}

  getPublished(page: number = 0, size: number = 20): Observable<RecipePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<RecipePage>(this.apiUrl, { params }).pipe(
      catchError(() => {
        const RecipePage: RecipePage = {
          content: this.mockRecipes,
          totalElements: this.mockRecipes.length,
          totalPages: 1,
          size: this.mockRecipes.length,
          number: 0,
          first: true,
          last: true
        };
        return of(RecipePage);
      })
    );
  }

  getById(id:  string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const Recipe = this.mockRecipes.find(r => r.id === id);
        return of(Recipe as Recipe);
      })
    );
  }

  getByPlantId(plantId: string, page:  number = 0, size: number = 20): Observable<RecipePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<RecipePage>(`${this.apiUrl}/plant/${plantId}`, { params }).pipe(
      catchError(() => {
        const filteredRecipes = this.mockRecipes.filter(r => r.plants && r.plants.some(p => p.id === plantId));
        const RecipePage: RecipePage = {
          content: filteredRecipes,
          totalElements: filteredRecipes.length,
          totalPages: 1,
          size: filteredRecipes.length,
          number: 0,
          first: true,
          last: true
        };
        return of(RecipePage);
      })
    );
  }

  create(request: CreateRecipeRequest): Observable<Recipe> {
    let params = new HttpParams()
      .set('title', request.title)
      .set('type', request.type)
      .set('description', request. description || '')
      .set('isPremium', (request.isPremium || false).toString());

    if (request. plantIds && request. plantIds.length > 0) {
      request.plantIds.forEach(id => {
        params = params. append('plantIds', id);
      });
    }

    if (request.ingredients && request.ingredients.length > 0) {
      request.ingredients.forEach(ingredient => {
        params = params.append('ingredients', ingredient);
      });
    }

    return this.http.post<Recipe>(this.apiUrl, null, { params });
  }

  update(id: string, request:  Partial<CreateRecipeRequest>): Observable<Recipe> {
    let params = new HttpParams();

    if (request. title) params = params.set('title', request. title);
    if (request.type) params = params.set('type', request. type);
    if (request.description !== undefined) params = params.set('description', request.description);
    if (request. isPremium !== undefined) params = params.set('isPremium', request.isPremium.toString());

    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, null, { params });
  }

  submitForReview(id: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${id}/submit`, null);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}