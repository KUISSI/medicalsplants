import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue';

      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de contacter le serveur';
          toastr.error(errorMessage, 'Erreur de connexion');
          break;

        case 400:
          errorMessage = error.error?.error?.message || 'Requête invalide';
          toastr.error(errorMessage, 'Erreur');
          break;

        case 401:
          if (
            !req.url.includes('/auth/logout') &&
            !req.url.includes('/auth/refresh') &&
            !req.url.includes('/auth/login')
          ) {
            errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            toastr.warning(errorMessage, 'Non autorisé');
            authService.logout();
          }
          break;

        case 403:
          errorMessage = 'Accès non autorisé';
          toastr.warning(errorMessage, 'Accès refusé');
          break;

        case 404:
          errorMessage = 'Ressource non trouvée';
          toastr.error(errorMessage, 'Non trouvé');
          break;

        case 409:
          errorMessage = error.error?.error?.message || 'Conflit de données';
          toastr.error(errorMessage, 'Conflit');
          break;

        case 500:
          errorMessage = 'Erreur serveur';
          toastr.error(errorMessage, 'Erreur');
          break;

        default:
          toastr.error(errorMessage, 'Erreur');
      }

      return throwError(() => error);
    }),
  );
};
