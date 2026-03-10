import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Review, CreateReviewRequest } from '../models/review.model';

export interface ReviewPage {
  content: Review[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getAllReviews(params: { page?: number; size?: number; sort?: string; searchTerm?: string }): Observable<ReviewPage> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 8).toString())
      .set('sort', params.sort ?? 'createdAt,desc');
    if (params.searchTerm) {
      httpParams = httpParams.set('searchTerm', params.searchTerm);
    }
    return this.http.get<ReviewPage>(`${this.apiUrl}`, { params: httpParams });
  }

  getByRecipeId(recipeId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/recipe/${recipeId}`);
  }

  getById(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  getMyReviews(page: number = 0, size: number = 20): Observable<ReviewPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ReviewPage>(`${this.apiUrl}/me`, { params });
  }

  create(request: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, request);
  }

  update(id: string, request: CreateReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}