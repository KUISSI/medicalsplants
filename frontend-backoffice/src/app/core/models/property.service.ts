import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Property, CreatePropertyRequest, UpdatePropertyRequest } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private readonly apiUrl = `${environment.apiUrl}/properties`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Property[]> {
    return this.http.get<Property[]>(this. apiUrl);
  }

  getById(id: string): Observable<Property> {
    return this. http.get<Property>(`${this.apiUrl}/${id}`);
  }

  create(request: CreatePropertyRequest): Observable<Property> {
    let params = new HttpParams()
      .set('title', request. title)
      .set('propertyFamily', request.propertyFamily);

    if (request.propertyDetail) {
      params = params.set('propertyDetail', request.propertyDetail);
    }

    if (request.symptomIds && request.symptomIds.length > 0) {
      request.symptomIds. forEach(id => {
        params = params.append('symptomIds', id);
      });
    }

    return this.http.post<Property>(this.apiUrl, null, { params });
  }

  update(id: string, request: UpdatePropertyRequest): Observable<Property> {
    const params = new HttpParams()
      .set('title', request. title)
      .set('propertyFamily', request.propertyFamily)
      .set('propertyDetail', request.propertyDetail || '');

    return this.http.put<Property>(`${this.apiUrl}/${id}`, null, { params });
  }

  delete(id: string): Observable<void> {
    return this. http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addSymptom(propertyId: string, symptomId: string): Observable<Property> {
    return this.http.post<Property>(`${this.apiUrl}/${propertyId}/symptoms/${symptomId}`, null);
  }

  removeSymptom(propertyId: string, symptomId: string): Observable<Property> {
    return this.http.delete<Property>(`${this.apiUrl}/${propertyId}/symptoms/${symptomId}`);
  }
}