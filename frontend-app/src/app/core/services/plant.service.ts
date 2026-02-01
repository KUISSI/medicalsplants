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
      id: '33333333-3333-3333-3333-333333333301',
      title: 'Lavande',
      description: 'La lavande est une plante aux multiples vertus. Elle est connue pour ses propriétés apaisantes et relaxantes.',
      symptomFamilies: ['Cutané', 'Nerveux'],
      properties: [
        { id: '22222222-2222-2222-2222-222222222206', title: 'Cicatrisant', propertyFamily: 'Cutané', createdAt: new Date().toISOString() },
        { id: '22222222-2222-2222-2222-222222222203', title: 'Sédatif', propertyFamily: 'Calmant', createdAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333302',
      title: 'Camomille',
      description: 'La camomille est une plante douce, idéale pour les peaux sensibles et irritées. Elle est réputée pour ses propriétés anti-inflammatoires, adoucissantes et apaisantes. Elle est souvent utilisée en cas d\'eczéma, de psoriasis ou de réactions allergiques.',
      symptomFamilies: ['Cutané', 'Digestif'],
      properties: [
        { id: '550e8400-e29b-41d4-a716-446655440010', title: 'Anti-inflammatoire', propertyFamily: 'Anti-inflammatoire', createdAt: new Date().toISOString() },
        { id: '550e8400-e29b-41d4-a716-446655440012', title: 'Sédatif', propertyFamily: 'Calmant', createdAt: new Date().toISOString() },
        { id: '550e8400-e29b-41d4-a716-446655440013', title: 'Anxiolytique', propertyFamily: 'Calmant', createdAt: new Date().toISOString() },
        { id: '550e8400-e29b-41d4-a716-446655440014', title: 'Digestif', propertyFamily: 'Digestif', createdAt: new Date().toISOString() },
        { id: '550e8400-e29b-41d4-a716-446655440015', title: 'Carminatif', propertyFamily: 'Digestif', createdAt: new Date().toISOString() },
        { id: '550e8400-e29b-41d4-a716-446655440016', title: 'Antiseptique', propertyFamily: 'Antimicrobien', createdAt: new Date().toISOString() },
        { id: '550e8400-e29b-41d4-a716-446655440017', title: 'Antalgique', propertyFamily: 'Analgésique', createdAt: new Date().toISOString() },
        { id: '550e8400-e29b-41d4-a716-446655440018', title: 'Cicatrisant', propertyFamily: 'Cutané', createdAt: new Date().toISOString() },
        { id: '550e8400-e29b-41d4-a716-446655440019', title: 'Antioxydant', propertyFamily: 'Protecteur', createdAt: new Date().toISOString() }
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
    return this.http.get<Plant>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const plant = this.mockPlants.find(p => p.id === id);
        return of(plant as Plant);
      })
    );
  }

  getBySymptomId(symptomId: string, page: number = 0, size: number = 20): Observable<PlantPage> {
    // Return mock plants for symptom 'Nausées' during local development
    if (symptomId === '77777777-7777-7777-7777-777777777777') {
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