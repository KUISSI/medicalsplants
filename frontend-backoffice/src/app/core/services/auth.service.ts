import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { User, LoginRequest, AuthResponse, MessageResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSignal = signal<User | null>(null);
  private isLoadingSignal = signal<boolean>(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
    private toastr: ToastrService,
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = this.storage.get<User>(environment.userKey);
    const token = this.storage.get<string>(environment.tokenKey);

    if (user && token && user.role === 'ADMIN') {
      this.currentUserSignal.set(user);
    } else {
      // Si pas admin, on nettoie
      this.clearStorage();
    }
  }

  loginMock(user: User): void {
    this.storage.set(environment.tokenKey, 'mock-token');
    this.storage.set(environment.userKey, user);
    this.currentUserSignal.set(user);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        this.isLoadingSignal.set(false);

        // Vérifier que c'est un admin
        if (response.data.user.role !== 'ADMIN') {
          this.toastr.error('Accès réservé aux administrateurs', 'Accès refusé');
          throw new Error('Not an admin');
        }

        this.handleAuthSuccess(response);
        this.toastr.success("Bienvenue dans l'administration", 'Connexion réussie');
      }),
      catchError((error) => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    this.http
      .post<MessageResponse>(`${this.apiUrl}/logout`, {})
      .pipe(catchError(() => of(null)))
      .subscribe({ complete: () => {} });

    this.handleLogout();
  }

  getAccessToken(): string | null {
    return this.storage.get<string>(environment.tokenKey);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const { accessToken, user } = response.data;

    this.storage.set(environment.tokenKey, accessToken);
    this.storage.set(environment.userKey, user);

    this.currentUserSignal.set(user);
  }

  private handleLogout(): void {
    this.clearStorage();
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
    this.toastr.info('Vous êtes déconnecté', 'À bientôt !');
  }

  private clearStorage(): void {
    this.storage.remove(environment.tokenKey);
    this.storage.remove(environment.userKey);
  }
}
