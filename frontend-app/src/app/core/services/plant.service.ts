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
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
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
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      title: 'Camomille',
      description: 'La camomille est une plante douce, idéale pour les peaux sensibles et irritées. Elle est réputée pour ses propriétés anti-inflammatoires, adoucissantes et apaisantes. Elle est souvent utilisée en cas d\'eczéma, de psoriasis ou de réactions allergiques.',
      symptomFamilies: ['Cutané', 'Digestif'],
      properties: [
        { id: '10', title: 'Anti-inflammatoire', propertyFamily: 'Anti-inflammatoire', createdAt: new Date().toISOString() },
        { id: '12', title: 'Sédatif', propertyFamily: 'Calmant', createdAt: new Date().toISOString() },
        { id: '13', title: 'Anxiolytique', propertyFamily: 'Calmant', createdAt: new Date().toISOString() },
        { id: '14', title: 'Digestif', propertyFamily: 'Digestif', createdAt: new Date().toISOString() },
        { id: '15', title: 'Carminatif', propertyFamily: 'Digestif', createdAt: new Date().toISOString() },
        { id: '16', title: 'Antiseptique', propertyFamily: 'Antimicrobien', createdAt: new Date().toISOString() },
        { id: '17', title: 'Antalgique', propertyFamily: 'Analgésique', createdAt: new Date().toISOString() },
        { id: '18', title: 'Cicatrisant', propertyFamily: 'Cutané', createdAt: new Date().toISOString() },
        { id: '19', title: 'Antioxydant', propertyFamily: 'Protecteur', createdAt: new Date().toISOString() }
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