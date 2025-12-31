import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (!authService.isAuthenticated()) {
    toastr.warning('Veuillez vous connecter', 'Accès refusé');
    router.navigate(['/login']);
    return false;
  }

  if (! authService.isAdmin()) {
    toastr.error('Accès réservé aux administrateurs', 'Accès refusé');
    router.navigate(['/login']);
    return false;
  }

  return true;
};