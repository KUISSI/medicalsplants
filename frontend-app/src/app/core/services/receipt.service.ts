import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Receipt, ReceiptPage, CreateReceiptRequest } from '../models/receipt.model';
import { MessageResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  private readonly apiUrl = `${environment.apiUrl}/receipts`;

  constructor(private http: HttpClient) {}

  getPublished(page: number = 0, size: number = 20): Observable<ReceiptPage> {
    const params = new HttpParams()
      .set('page', page. toString())
      .set('size', size.toString());

    return this.http.get<ReceiptPage>(this.apiUrl, { params });
  }

  getById(id:  string): Observable<Receipt> {
    return this.http.get<Receipt>(`${this.apiUrl}/${id}`);
  }

  getByPlantId(plantId: string, page:  number = 0, size: number = 20): Observable<ReceiptPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ReceiptPage>(`${this.apiUrl}/plant/${plantId}`, { params });
  }

  create(request: CreateReceiptRequest): Observable<Receipt> {
    const params = new HttpParams()
      .set('title', request.title)
      .set('type', request.type)
      .set('description', request. description || '')
      .set('isPremium', (request.isPremium || false).toString());

    // Ajouter les plantIds si présents
    let finalParams = params;
    if (request. plantIds && request. plantIds.length > 0) {
      request.plantIds.forEach(id => {
        finalParams = finalParams. append('plantIds', id);
      });
    }

    return this.http.post<Receipt>(this.apiUrl, null, { params: finalParams });
  }

  update(id: string, request:  Partial<CreateReceiptRequest>): Observable<Receipt> {
    let params = new HttpParams();

    if (request. title) params = params.set('title', request. title);
    if (request.type) params = params.set('type', request. type);
    if (request.description !== undefined) params = params.set('description', request.description);
    if (request. isPremium !== undefined) params = params.set('isPremium', request.isPremium.toString());

    return this.http.put<Receipt>(`${this.apiUrl}/${id}`, null, { params });
  }

  submitForReview(id: string): Observable<Receipt> {
    return this.http.post<Receipt>(`${this.apiUrl}/${id}/submit`, null);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}