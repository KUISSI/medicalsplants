// auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let toastrMock: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    toastrMock = jasmine.createSpyObj('ToastrService', ['warning']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
    });
  });

  const runGuard = (url = '/plants') =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
    );

  it('should allow access when authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);
    expect(runGuard()).toBeTrue();
  });

  it('should redirect to /login when not authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);
    expect(runGuard('/plants')).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/plants' },
    });
  });

  it('should show a toastr warning when not authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);
    runGuard();
    expect(toastrMock.warning).toHaveBeenCalled();
  });
});
