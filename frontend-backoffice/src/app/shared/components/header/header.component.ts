import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls:  ['./header.component.scss']
})
export class HeaderComponent {
  authService = inject(AuthService);
  isMenuOpen = false;

  menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/users', label: 'Utilisateurs', icon: '👥', exact: false },
    { path: '/symptoms', label: 'Symptômes', icon: '🩺', exact: false },
    { path: '/properties', label: 'Propriétés', icon: '✨', exact: false },
    { path:  '/plants', label: 'Plantes', icon: '🌿', exact: false },
    { path:  '/receipts', label: 'Recettes', icon: '📖', exact: false },
    { path:  '/receipts/moderation', label: 'Modération', icon: '⏳', exact: false }
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
  }
}