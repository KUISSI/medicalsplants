// auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  const isAuthenticated = vi.fn();
  const navigate = vi.fn();
  const warning = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated } },
        { provide: Router, useValue: { navigate } },
        { provide: ToastrService, useValue: { warning } },
      ],
    });
  });

  const runGuard = (url = '/plants') =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
    );

  it('should allow access when authenticated', () => {
    isAuthenticated.mockReturnValue(true);
    expect(runGuard()).toBe(true);
  });

  it('should redirect to /login when not authenticated', () => {
    isAuthenticated.mockReturnValue(false);
    expect(runGuard('/plants')).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/plants' },
    });
  });

  it('should show a toastr warning when not authenticated', () => {
    isAuthenticated.mockReturnValue(false);
    runGuard();
    expect(warning).toHaveBeenCalledWith(
      'Vous devez être connecté pour accéder à cette page',
      'Accès refusé',
    );
  });
});
