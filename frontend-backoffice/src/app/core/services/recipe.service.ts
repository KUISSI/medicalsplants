import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe, RecipePage, CreateRecipeRequest } from '../models/recipe.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = environment.apiUrl + '/recipes';

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number): Observable<RecipePage> {
    return this.http.get<RecipePage>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getPublished(page: number, size: number): Observable<RecipePage> {
    return this.http.get<RecipePage>(`${this.apiUrl}/published?page=${page}&size=${size}`);
  }

  getPending(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/pending`);
  }

  approve(id: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${id}/approve`, null);
  }

  archive(id: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${id}/archive`, null);
  }

  create(request: CreateRecipeRequest): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, request);
  }
}
