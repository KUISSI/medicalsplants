import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Symptom, SymptomGroup } from '../models/symptom.model';

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

  getByFamily(family: string): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(`${this.apiUrl}/family/${family}`);
  }

  getAllFamilies(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/families`);
  }

  getGroupedByFamily(): Observable<Record<string, Symptom[]>> {
    return this. http.get<Record<string, Symptom[]>>(`${this.apiUrl}/grouped`);
  }
}