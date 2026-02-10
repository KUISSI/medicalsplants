import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Plant, PlantPage, CreatePlantRequest, UpdatePlantRequest } from '../models/plant.model';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private readonly apiUrl = `${environment.apiUrl}/plants`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size:  number = 20): Observable<PlantPage> {
    const params = new HttpParams()
      .set('page', page. toString())
      .set('size', size.toString());

    return this.http.get<PlantPage>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/${id}`);
  }

  create(request: CreatePlantRequest): Observable<Plant> {
    let params = new HttpParams()
      .set('title', request. title);

    if (request.description) {
      params = params.set('description', request.description);
    }
    if (request. consumedPart) {
      params = params.set('consumedPart', request.consumedPart);
    }
    if (request. propertyIds && request.propertyIds.length > 0) {
      request.propertyIds. forEach(id => {
        params = params.append('propertyIds', id);
      });
    }

    return this. http.post<Plant>(this.apiUrl, null, { params });
  }

  update(id:  string, request: UpdatePlantRequest): Observable<Plant> {
    let params = new HttpParams()
      .set('title', request. title)

    if (request.description !== undefined) {
      params = params.set('description', request. description);
    }
    

    return this.http.put<Plant>(`${this.apiUrl}/${id}`, null, { params });
  }

  delete(id:  string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addProperty(plantId: string, propertyId: string): Observable<Plant> {
    return this. http.post<Plant>(`${this.apiUrl}/${plantId}/properties/${propertyId}`, null);
  }

  removeProperty(plantId: string, propertyId: string): Observable<Plant> {
    return this.http.delete<Plant>(`${this.apiUrl}/${plantId}/properties/${propertyId}`);
  }
}