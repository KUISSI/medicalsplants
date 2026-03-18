import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe, RecipePage, CreateRecipeRequest } from '../models/recipe.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = environment.apiUrl + '/recipes';

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number): Observable<RecipePage> {
    return this.http.get<RecipePage>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getPublished(page: number, size: number): Observable<RecipePage> {
    return this.http.get<RecipePage>(`${this.apiUrl}/all?page=${page}&size=${size}&status=PUBLISHED`);
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

  search(q: string): Observable<RecipePage> {
    return this.http.get<RecipePage>(`${this.apiUrl}/search?q=${encodeURIComponent(q)}`);
  }

  getAllAdmin(
    page: number,
    size: number,
    status: string = '',
    sort: string = 'title,asc',
  ): Observable<RecipePage> {
    let url = `${this.apiUrl}/all?page=${page}&size=${size}&sort=${sort}`;
    if (status) url += `&status=${status}`;
    return this.http.get<RecipePage>(url);
  }

  getById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchAdmin(q: string, page: number, size: number): Observable<RecipePage> {
    return this.http.get<RecipePage>(
      `${this.apiUrl}/search?q=${encodeURIComponent(q)}&page=${page}&size=${size}`,
    );
  }
}
