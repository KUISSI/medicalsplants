import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);

  sidebarOpen = signal(true);
  mobileMenuOpen = signal(false);

  pageTitle = signal('Dashboard');

  navGroups: NavGroup[] = [
    {
      label: 'Général',
      items: [
        { path: '/', label: 'Dashboard', icon: 'bi-speedometer2', exact: true }
      ]
    },
    {
      label: 'Gestion',
      items: [
        { path: '/users',      label: 'Utilisateurs', icon: 'bi-people' },
        { path: '/plants',     label: 'Plantes',       icon: 'bi-flower1' },
        { path: '/symptoms',   label: 'Symptômes',     icon: 'bi-activity' },
        { path: '/properties', label: 'Propriétés',    icon: 'bi-stars' },
        { path: '/recipes',    label: 'Recettes',      icon: 'bi-book',    exact: true }
      ]
    },
    {
      label: 'Modération',
      items: [
        { path: '/recipes/moderation', label: 'Recettes',  icon: 'bi-shield-check', exact: true },
        { path: '/reviews',            label: 'Avis',      icon: 'bi-chat-square-text', exact: true }
      ]
    }
  ];

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.resolveTitleFromUrl(this.router.url))
    ).subscribe(title => this.pageTitle.set(title));

    // Set initial title
    this.pageTitle.set(this.resolveTitleFromUrl(this.router.url));
  }

  private resolveTitleFromUrl(url: string): string {
    if (url === '/' || url === '') return 'Dashboard';
    if (url.includes('/users'))                   return 'Utilisateurs';
    if (url.includes('/plants/new'))              return 'Nouvelle plante';
    if (url.includes('/plants') && url.includes('/edit')) return 'Modifier la plante';
    if (url.includes('/plants'))                  return 'Plantes';
    if (url.includes('/symptoms/new'))            return 'Nouveau symptôme';
    if (url.includes('/symptoms') && url.includes('/edit')) return 'Modifier le symptôme';
    if (url.includes('/symptoms'))                return 'Symptômes';
    if (url.includes('/properties/new'))          return 'Nouvelle propriété';
    if (url.includes('/properties') && url.includes('/edit')) return 'Modifier la propriété';
    if (url.includes('/properties'))              return 'Propriétés';
    if (url.includes('/recipes/moderation'))      return 'Modération des recettes';
    if (url.includes('/recipes'))                 return 'Recettes';
    if (url.includes('/reviews'))                 return 'Modération des avis';
    return 'Administration';
  }

  get userInitial(): string {
    const user = this.authService.currentUser();
    return user?.pseudo?.charAt(0).toUpperCase() ?? 'A';
  }

  get userPseudo(): string {
    return this.authService.currentUser()?.pseudo ?? 'Administrateur';
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
  }

  logout(): void {
    this.authService.logout();
  }
}
