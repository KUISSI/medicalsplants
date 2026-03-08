import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { HeaderGuestComponent } from './shared/components/header-guest/header-guest.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, HeaderGuestComponent, FooterComponent],
  template: `
    <app-header-guest *ngIf="!authService.isAuthenticated()" />
    <app-header *ngIf="authService.isAuthenticated()" />
    <router-outlet />
    <app-footer />
  `
})
export class AppComponent {
  title = 'Medicals Plants';
  authService = inject(AuthService);
}
