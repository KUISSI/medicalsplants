import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Review, CreateReviewRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getByReceiptId(receiptId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/receipt/${receiptId}`);
  }

  getById(id: string): Observable<Review> {
    return this. http.get<Review>(`${this.apiUrl}/${id}`);
  }

  getMyReviews(page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page. toString())
      .set('size', size.toString());

    return this.http.get(`${this.apiUrl}/me`, { params });
  }

  create(request:  CreateReviewRequest): Observable<Review> {
    let params = new HttpParams()
      .set('receiptId', request. receiptId)
      .set('content', request.content);

    if (request.parentReviewId) {
      params = params.set('parentReviewId', request. parentReviewId);
    }

    return this.http.post<Review>(this.apiUrl, null, { params });
  }

  update(id:  string, content: string): Observable<Review> {
    const params = new HttpParams().set('content', content);
    return this.http.put<Review>(`${this.apiUrl}/${id}`, null, { params });
  }

  delete(id: string): Observable<void> {
    return this. http.delete<void>(`${this.apiUrl}/${id}`);
  }
}