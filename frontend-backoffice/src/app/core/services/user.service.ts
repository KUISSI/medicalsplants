import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User, UserPage, UpdateUserRequest, MessageResponse } from '../models/user.model';

@Injectable({
  providedIn:  'root'
})
export class UserService {

  private readonly apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 20, search?: string): Observable<UserPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size. toString());

    if (search) {
      params = params. set('search', search);
    }

    return this.http.get<UserPage>(this.apiUrl, { params });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  update(id: string, request:  UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, request);
  }

  updateRole(id: string, role: 'USER' | 'PREMIUM' | 'ADMIN'): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/role`, null, {
      params: { role }
    });
  }

  updateStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/status`, null, {
      params: { status }
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
