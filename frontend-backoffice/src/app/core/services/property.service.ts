import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Property, CreatePropertyRequest, UpdatePropertyRequest } from '../models/property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private readonly apiUrl = `${environment.apiUrl}/properties`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Property[]> {
    return this.http.get<Property[] | any>(this.apiUrl).pipe(
      map((res) => (Array.isArray(res) ? res : [])),
      catchError(() => of([])),
    );
  }

  getById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  create(request: CreatePropertyRequest): Observable<Property> {
    return this.http.post<Property>(this.apiUrl, request);
  }

  update(id: string, request: UpdatePropertyRequest): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addSymptom(propertyId: string, symptomId: string): Observable<Property> {
    return this.http.post<Property>(`${this.apiUrl}/${propertyId}/symptoms/${symptomId}`, null);
  }

  removeSymptom(propertyId: string, symptomId: string): Observable<Property> {
    return this.http.delete<Property>(`${this.apiUrl}/${propertyId}/symptoms/${symptomId}`);
  }
}
