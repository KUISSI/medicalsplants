import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

const notify=(fn:()=>void):void=>{setTimeout(fn,0);};

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
          errorMessage = 'Impossible de contacter le serveur. Verifiez votre connexion.';
          notify(()=>toastr.error(errorMessage, 'Erreur de connexion'));
          break;

        case 400:
          errorMessage = error.error?.error?.message || 'Requete invalide';
          notify(()=>toastr.error(errorMessage, 'Erreur de validation'));
          break;

        case 401:
          if (!req.url.includes('/auth/logout') && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
            return authService.refreshToken().pipe(
              switchMap(() => next(req.clone({ withCredentials: true }))),
              catchError(() => { authService.logout(); notify(()=>toastr.warning('Session expiree. Veuillez vous reconnecter.', 'Non autorise')); return throwError(() => error); }),
            );
          }
          break;

        case 403:
          errorMessage = error.error?.error?.message || 'Acces refuse';
          notify(()=>toastr.warning(errorMessage, 'Acces interdit'));
          break;

        case 404:
          notify(()=>toastr.error('Ressource non trouvee', 'Non trouve'));
          break;

        case 409:
          errorMessage = error.error?.error?.message || 'Conflit de donnees';
          notify(()=>toastr.error(errorMessage, 'Conflit'));
          break;

        case 500:
          notify(()=>toastr.error('Erreur interne du serveur', 'Erreur serveur'));
          break;

        default:
          errorMessage = error.error?.error?.message || 'Une erreur inattendue est survenue';
          notify(()=>toastr.error(errorMessage, 'Erreur'));
      }

      return throwError(() => error);
    }),
  );
};
