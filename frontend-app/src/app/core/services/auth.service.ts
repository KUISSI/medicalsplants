import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  MessageResponse
} from '../models/user.model';

@Injectable({
  providedIn:  'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Signals pour la réactivité
  private currentUserSignal = signal<User | null>(null);
  private isLoadingSignal = signal<boolean>(false);

  // Computed values
  readonly currentUser = this.currentUserSignal. asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');
  readonly isPremium = computed(() => {
    const role = this.currentUserSignal()?.role;
    return role === 'PREMIUM' || role === 'ADMIN';
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
    private toastr: ToastrService
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = this.storage. get<User>(environment.userKey);
    const token = this.storage. get<string>(environment.tokenKey);

    if (user && token) {
      this.currentUserSignal.set(user);
    }
  }

  register(request: RegisterRequest): Observable<MessageResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<MessageResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        this.isLoadingSignal. set(false);
        this.toastr.success(response.message, 'Inscription réussie');
      }),
      catchError(error => {
        this.isLoadingSignal. set(false);
        return throwError(() => error);
      })
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.isLoadingSignal.set(false);
        this.handleAuthSuccess(response);
        this.toastr.success('Connexion réussie', 'Bienvenue ! ');
      }),
      catchError(error => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    const refreshToken = this.storage.get<string>(environment.refreshTokenKey);

    // Appel API pour invalider le token
    this.http.post<MessageResponse>(`${this.apiUrl}/logout`, { refreshToken })
      .subscribe({
        complete: () => this.handleLogout()
      });

    // Logout local immédiat
    this.handleLogout();
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this. storage.get<string>(environment.refreshTokenKey);

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        this.handleLogout();
        return throwError(() => error);
      })
    );
  }

  forgotPassword(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/forgot-password`, null, {
      params: { email }
    });
  }

  resetPassword(token:  string, newPassword:  string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/reset-password`, null, {
      params: { token, newPassword }
    });
  }

  verifyEmail(token:  string): Observable<MessageResponse> {
    return this.http.get<MessageResponse>(`${this.apiUrl}/verify-email`, {
      params: { token }
    });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => this. currentUserSignal. set(user))
    );
  }

  getAccessToken(): string | null {
    return this.storage.get<string>(environment. tokenKey);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const { accessToken, refreshToken, user } = response. data;

    this.storage. set(environment.tokenKey, accessToken);
    this.storage.set(environment. refreshTokenKey, refreshToken);
    this.storage.set(environment. userKey, user);

    this.currentUserSignal.set(user);
  }

  private handleLogout(): void {
    this.storage.remove(environment. tokenKey);
    this.storage.remove(environment.refreshTokenKey);
    this.storage.remove(environment.userKey);

    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
    this.toastr.info('Vous êtes déconnecté', 'À bientôt !');
  }
}
