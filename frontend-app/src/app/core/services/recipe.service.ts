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
    return this.http.post<Recipe>(this.apiUrl, request);
  }

  update(id: string, request: Partial<CreateRecipeRequest>): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, request);
  }

  submitForReview(id: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${id}/submit`, null);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}