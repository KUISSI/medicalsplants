import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Symptom, CreateSymptomRequest, UpdateSymptomRequest } from '../models/symptom.model';

@Injectable({
  providedIn:  'root'
})
export class SymptomService {

  private readonly apiUrl = `${environment.apiUrl}/symptoms`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(this.apiUrl);
  }

  getById(id: string): Observable<Symptom> {
    return this.http.get<Symptom>(`${this.apiUrl}/${id}`);
  }

  getAllFamilies(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/families`);
  }

  create(request: CreateSymptomRequest): Observable<Symptom> {
    const params = new HttpParams()
      .set('title', request.title)
      .set('symptomFamily', request. symptomFamily)
      .set('symptomDetail', request. symptomDetail || '');

    return this.http.post<Symptom>(this.apiUrl, null, { params });
  }

  update(id: string, request: UpdateSymptomRequest): Observable<Symptom> {
    const params = new HttpParams()
      .set('title', request.title)
      .set('symptomFamily', request.symptomFamily)
      .set('symptomDetail', request.symptomDetail || '');

    return this.http.put<Symptom>(`${this.apiUrl}/${id}`, null, { params });
  }

  delete(id:  string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}