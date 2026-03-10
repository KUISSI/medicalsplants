import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Symptom } from '../models/symptom.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SymptomService {
  private apiUrl = `${environment.apiUrl}/symptoms`;

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

  getFamilies(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/families`);
  }

  /**
   * Récupère les symptômes groupés par famille, avec filtres optionnels.
   * @param searchTerm Filtre de recherche (optionnel)
   * @param family Famille sélectionnée (optionnel)
   */
  getGroupedByFamily(
    searchTerm?: string,
    family?: string
  ): Observable<{ [family: string]: Symptom[] }> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (family) params = params.set('family', family);

    // Appel du bon endpoint groupé
    return this.http.get<{ [family: string]: Symptom[] }>(
      `${this.apiUrl}/grouped`,
      { params }
    );
  }
}