import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Receipt, ReceiptPage, CreateReceiptRequest } from '../models/receipt.model';
import { MessageResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  private readonly apiUrl = `${environment.apiUrl}/receipts`;

  private mockReceipts: Receipt[] = [
    {
      id: '1',
      title: 'Tisane relaxante',
      type: 'HOT_DRINK',
      description: 'Une tisane parfaite pour se détendre avant de dormir.',
      isPremium: false,
      status: 'PUBLISHED',
      plants: [
        {
          id: '2',
          title: 'Camomille',
          symptomFamilies: ['Cutané', 'Digestif'],
          createdAt: new Date().toISOString()
        }
      ],
      ingredients: ['1 cuillère à café de fleurs de camomille séchées', '250 ml d\'eau chaude', '1 cuillère à café de miel (optionnel)'],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Lotion apaisante à la lavande',
      type: 'LOTION',
      description: 'Une lotion maison pour apaiser les irritations de la peau.',
      isPremium: true,
      status: 'PUBLISHED',
      plants: [
        {
          id: '1',
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

  getPublished(page: number = 0, size: number = 20): Observable<ReceiptPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ReceiptPage>(this.apiUrl, { params }).pipe(
      catchError(() => {
        const receiptPage: ReceiptPage = {
          content: this.mockReceipts,
          totalElements: this.mockReceipts.length,
          totalPages: 1,
          size: this.mockReceipts.length,
          number: 0,
          first: true,
          last: true
        };
        return of(receiptPage);
      })
    );
  }

  getById(id:  string): Observable<Receipt> {
    return this.http.get<Receipt>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const receipt = this.mockReceipts.find(r => r.id === id);
        return of(receipt as Receipt);
      })
    );
  }

  getByPlantId(plantId: string, page:  number = 0, size: number = 20): Observable<ReceiptPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ReceiptPage>(`${this.apiUrl}/plant/${plantId}`, { params }).pipe(
      catchError(() => {
        const filteredReceipts = this.mockReceipts.filter(r => r.plants && r.plants.some(p => p.id === plantId));
        const receiptPage: ReceiptPage = {
          content: filteredReceipts,
          totalElements: filteredReceipts.length,
          totalPages: 1,
          size: filteredReceipts.length,
          number: 0,
          first: true,
          last: true
        };
        return of(receiptPage);
      })
    );
  }

  create(request: CreateReceiptRequest): Observable<Receipt> {
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

    return this.http.post<Receipt>(this.apiUrl, null, { params });
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