import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError, switchMap, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (
  req:  HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue';

      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de contacter le serveur.  Vérifiez votre connexion.';
          toastr.error(errorMessage, 'Erreur de connexion');
          break;

        case 400:
          errorMessage = error.error?.error?. message || 'Requête invalide';
          toastr.error(errorMessage, 'Erreur de validation');
          break;

        case 401:
          // Tentative de refresh automatique si refreshToken présent
          const refreshToken = authService['storage'].get<string>(environment.refreshTokenKey);
          if (refreshToken) {
            return authService.refreshToken().pipe(
              switchMap(() => {
                // On rejoue la requête initiale avec le nouveau token
                const newToken = authService.getAccessToken();
                if (newToken) {
                  const authReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${newToken}` }
                  });
                  return next(authReq);
                }
                // Si pas de nouveau token, logout
                authService.logout();
                toastr.warning('Session expirée. Veuillez vous reconnecter.', 'Non autorisé');
                return throwError(() => error);
              }),
              catchError(() => {
                authService.logout();
                toastr.warning('Session expirée. Veuillez vous reconnecter.', 'Non autorisé');
                return throwError(() => error);
              })
            );
          } else {
            errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            toastr.warning(errorMessage, 'Non autorisé');
            authService.logout();
          }
          break;

        case 403:
          errorMessage = error.error?.error?. message || 'Accès refusé';
          toastr.warning(errorMessage, 'Accès interdit');
          break;

        case 404:
          errorMessage = 'Ressource non trouvée';
          toastr.error(errorMessage, 'Non trouvé');
          break;

        case 409:
          errorMessage = error.error?.error?. message || 'Conflit de données';
          toastr.error(errorMessage, 'Conflit');
          break;

        case 500:
          errorMessage = 'Erreur interne du serveur';
          toastr.error(errorMessage, 'Erreur serveur');
          break;

        default:
          errorMessage = error.error?.error?. message || 'Une erreur inattendue est survenue';
          toastr.error(errorMessage, 'Erreur');
      }

      return throwError(() => error);
    })
  );
};