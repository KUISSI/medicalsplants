import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Plant, PlantPage } from '../models/plant.model';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private readonly apiUrl = `${environment.apiUrl}/plants`;

  constructor(private http: HttpClient) {}

  getAll(page?: number, size?: number, searchTerm?: string, sort?: string): Observable<PlantPage> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());
    if (searchTerm && searchTerm.trim()) params = params.set('search', searchTerm.trim());
    if (sort && sort.trim()) params = params.set('sort', sort.trim());
    return this.http.get<PlantPage>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/${id}`);
  }

  getBySymptomId(symptomId: string, page: number = 0, size: number = 20, sort?: string): Observable<PlantPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (sort && sort.trim()) params = params.set('sort', sort.trim());
    return this.http.get<PlantPage>(`${this.apiUrl}/symptom/${symptomId}`, { params });
  }

  getByPropertyId(propertyId: string): Observable<Plant[]> {
    return this.http.get<Plant[]>(`${this.apiUrl}/property/${propertyId}`);
  }

  getPlantsForSymptom(symptomId: string): Observable<Plant[]> {
    return this.http.get<Plant[]>(`${environment.apiUrl}/symptoms/${symptomId}/plants`);
  }
}