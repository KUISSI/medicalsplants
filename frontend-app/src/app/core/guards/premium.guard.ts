import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const premiumGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (!authService.isAuthenticated()) {
    toastr.warning('Vous devez être connecté pour accéder à cette page', 'Accès refusé');
    router.navigate(['/login'], { 
      queryParams:  { returnUrl: state.url } 
    });
    return false;
  }

  if (authService.isPremium()) {
    return true;
  }

  toastr.info('Cette fonctionnalité est réservée aux membres Premium', 'Contenu Premium');
  router.navigate(['/']);
  return false;
};