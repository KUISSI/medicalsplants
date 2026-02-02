import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Recipe, RecipePage, CreateRecipeRequest } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private readonly apiUrl = `${environment.apiUrl}/recipes`;

  constructor(private http: HttpClient) {}

  getPublished(page: number = 0, size: number = 20): Observable<RecipePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<RecipePage>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  getByPlantId(plantId: string, page: number = 0, size: number = 20): Observable<RecipePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<RecipePage>(`${this.apiUrl}/plant/${plantId}`, { params });
  }

  search(query: string, page: number = 0, size: number = 20): Observable<RecipePage> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<RecipePage>(`${this.apiUrl}/search`, { params });
  }

  getMyRecipes(page: number = 0, size: number = 20): Observable<RecipePage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<RecipePage>(`${this.apiUrl}/my`, { params });
  }

  create(request: CreateRecipeRequest): Observable<Recipe> {
    let params = new HttpParams()
      .set('title', request.title)
      .set('type', request.type)
      .set('description', request.description)
      .set('ingredients', request.ingredients)
      .set('instructions', request.instructions)
      .set('preparationTimeMinutes', request.preparationTimeMinutes.toString())
      .set('difficulty', request.difficulty)
      .set('servings', request.servings.toString())
      .set('plantId', request.plantId);

    if (request.imageUrl) {
      params = params.set('imageUrl', request.imageUrl);
    }

    return this.http.post<Recipe>(this.apiUrl, null, { params });
  }

  update(id: string, request: Partial<CreateRecipeRequest>): Observable<Recipe> {
    let params = new HttpParams();

    if (request.title) params = params.set('title', request.title);
    if (request.type) params = params.set('type', request.type);
    if (request.description) params = params.set('description', request.description);
    if (request.ingredients) params = params.set('ingredients', request.ingredients);
    if (request.instructions) params = params.set('instructions', request.instructions);
    if (request.preparationTimeMinutes !== undefined) {
      params = params.set('preparationTimeMinutes', request.preparationTimeMinutes.toString());
    }
    if (request.difficulty) params = params.set('difficulty', request.difficulty);
    if (request.servings !== undefined) {
      params = params.set('servings', request.servings.toString());
    }
    if (request.plantId) params = params.set('plantId', request.plantId);
    if (request.imageUrl) params = params.set('imageUrl', request.imageUrl);

    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, null, { params });
  }

  submitForReview(id: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${id}/submit`, null);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}