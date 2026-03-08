import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor:  HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next:  HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Ne pas ajouter le token pour les routes publiques
  const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/verify-email'];
  const isPublicPath = publicPaths.some(path => req. url.includes(path));

  if (isPublicPath) {
    return next(req);
  }

  const token = authService. getAccessToken();

  if (token) {
    const authReq = req. clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};