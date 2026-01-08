import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Plant, PlantPage } from '../models/plant.model';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private readonly apiUrl = `${environment.apiUrl}/plants`;

  private mockPlants: Plant[] = [
    {
      id: '1',
      title: 'Lavande',
      description: 'La lavande est une plante aux multiples vertus. Elle est connue pour ses propriétés apaisantes et relaxantes, mais aussi pour ses bienfaits sur la peau. Elle est traditionnellement utilisée pour soulager les irritations cutanées, les piqûres d\'insectes et les coups de soleil.',
      symptomFamilies: ['Cutané', 'Nerveux'],
      properties: [
        { id: '11', title: 'Cicatrisant', propertyFamily: 'Cicatrisant', createdAt: new Date().toISOString() },
        { id: '10', title: 'Anti-inflammatoire', propertyFamily: 'Anti-inflammatoire', createdAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Camomille',
      description: 'La camomille est une plante douce, idéale pour les peaux sensibles et irritées. Elle est réputée pour ses propriétés anti-inflammatoires, adoucissantes et apaisantes. Elle est souvent utilisée en cas d\'eczéma, de psoriasis ou de réactions allergiques.',
      symptomFamilies: ['Cutané', 'Digestif'],
      properties: [
        { id: '10', title: 'Anti-inflammatoire', propertyFamily: 'Anti-inflammatoire', createdAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString()
    }
  ];

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 20): Observable<PlantPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PlantPage>(this.apiUrl, { params }).pipe(
      catchError(() => {
        const plantPage: PlantPage = {
          content: this.mockPlants,
          totalElements: this.mockPlants.length,
          totalPages: 1,
          size: this.mockPlants.length,
          number: 0,
          first: true,
          last: true
        };
        return of(plantPage);
      })
    );
  }

  getById(id: string): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/${id}`);
  }

  getBySymptomId(symptomId: string, page: number = 0, size: number = 20): Observable<PlantPage> {
    if (symptomId === '16') {
      const plantPage: PlantPage = {
        content: this.mockPlants,
        totalElements: this.mockPlants.length,
        totalPages: 1,
        size: this.mockPlants.length,
        number: 0,
        first: true,
        last: true
      };
      return of(plantPage);
    }
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size. toString());

    return this.http.get<PlantPage>(`${this.apiUrl}/symptom/${symptomId}`, { params }).pipe(
      catchError(() => {
        const plantPage: PlantPage = {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: 0,
          number: 0,
          first: true,
          last: true
        };
        return of(plantPage);
      })
    );
  }

  getByPropertyId(propertyId: string): Observable<Plant[]> {
    return this.http.get<Plant[]>(`${this.apiUrl}/property/${propertyId}`);
  }
}