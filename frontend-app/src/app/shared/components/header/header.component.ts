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
  isDropdownOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.isDropdownOpen = false;
  }

  toggleDropdown(event?: Event): void {
    if (event) { event.stopPropagation(); }
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }
}