import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe, RecipePage, CreateRecipeRequest } from '../models/recipe.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = environment.apiUrl + '/recipes';

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number, status?: string): Observable<RecipePage> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<RecipePage>(this.apiUrl, { params });
  }

  getPublished(page: number, size: number): Observable<RecipePage> {
    return this.http.get<RecipePage>(`${this.apiUrl}/published?page=${page}&size=${size}`);
  }

  updateStatus(id: string, status: string): Observable<Recipe> {
    return this.http.patch<Recipe>(`${this.apiUrl}/${id}/status`, null, {
      params: new HttpParams().set('status', status),
    });
  }

  create(request: CreateRecipeRequest): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
