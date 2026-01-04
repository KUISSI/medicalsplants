import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl:  './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  authService = inject(AuthService);

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year:  'numeric'
    });
  }

  getRoleBadge(role:  string): { label: string; class: string } {
    switch (role) {
      case 'ADMIN': 
        return { label:  '👑 Administrateur', class:  'badge--admin' };
      case 'PREMIUM':
        return { label: '⭐ Premium', class: 'badge--premium' };
      default:
        return { label: '👤 Utilisateur', class: 'badge--user' };
    }
  }

  logout(): void {
    this.authService.logout();
  }
}