import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../environments/environment';
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
    private toastr: ToastrService,
  ) {
    this.restoreSession();
  }

  private restoreSession(): void {
    this.http
      .get<User>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe((user) => {
        if (user && user.role === 'ADMIN') {
          this.currentUserSignal.set(user);
        } else {
          this.currentUserSignal.set(null);
        }
      });
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request, { withCredentials: true })
      .pipe(
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
    this.handleLogout();

    this.http
      .post<MessageResponse>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`,{},{withCredentials:true}).pipe(tap(r=>this.handleAuthSuccess(r)),catchError(e=>throwError(()=>e)));
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const { user } = response.data;
    this.currentUserSignal.set(user);
  }

  private handleLogout(): void {
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
    this.toastr.info('Vous êtes déconnecté', 'À bientôt !');
  }
}
