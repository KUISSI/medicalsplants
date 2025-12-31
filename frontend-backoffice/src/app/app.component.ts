import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header. component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    @if (authService.isAuthenticated()) {
      <div class="admin-layout">
        <app-header></app-header>
        <main class="admin-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `,
  styles: [`
    .admin-layout {
      min-height: 100vh;
      display:  flex;
      flex-direction: column;
    }

    .admin-content {
      flex: 1;
      padding: 25px;
      padding-top: 90px; /* Header height + spacing */
      background: #f4f6f9;
      min-height: calc(100vh - 65px);

      @media (max-width: 768px) {
        padding: 15px;
        padding-top: 80px;
      }
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
}