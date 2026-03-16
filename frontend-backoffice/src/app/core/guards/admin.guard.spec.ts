// admin.guard.spec.ts
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { vi } from "vitest";
import { adminGuard } from "./admin.guard";
import { AuthService } from "../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

describe("adminGuard", () => {
  const isAuthenticated = vi.fn();
  const isAdmin = vi.fn();
  const navigate = vi.fn();
  const warning = vi.fn();
  const error = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated, isAdmin } },
        { provide: Router, useValue: { navigate } },
        { provide: ToastrService, useValue: { warning, error } },
      ],
    });
  });

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  it("should allow access when authenticated and admin", () => {
    isAuthenticated.mockReturnValue(true);
    isAdmin.mockReturnValue(true);
    expect(runGuard()).toBe(true);
  });

  it("should redirect to /login when not authenticated", () => {
    isAuthenticated.mockReturnValue(false);
    expect(runGuard()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(["/login"]);
    expect(warning).toHaveBeenCalled();
  });

  it("should redirect to /login when authenticated but not admin", () => {
    isAuthenticated.mockReturnValue(true);
    isAdmin.mockReturnValue(false);
    expect(runGuard()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(["/login"]);
    expect(error).toHaveBeenCalled();
  });
});
