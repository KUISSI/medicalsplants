import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // Login (accessible uniquement si non connecté)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'Connexion - Admin'
  },

  // Routes protégées (Admin uniquement) — wrapped dans le layout
  {
    path: '',
    loadComponent: () => import('./shared/components/admin-layout/admin-layout.component')
      .then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      // Dashboard
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Dashboard - Admin'
      },

      // Users
      {
        path: 'users',
        loadComponent: () => import('./features/users/user-list/user-list.component')
          .then(m => m.UserListComponent),
        title: 'Utilisateurs - Admin'
      },

      // Symptoms
      {
        path: 'symptoms',
        loadComponent: () => import('./features/symptoms/symptom-list/symptom-list.component')
          .then(m => m.SymptomListComponent),
        title: 'Symptômes - Admin'
      },

      // Properties
      {
        path: 'properties',
        loadComponent: () => import('./features/properties/property-list/property-list.component')
          .then(m => m.PropertyListComponent),
        title: 'Propriétés - Admin'
      },

      // Plants
      {
        path: 'plants',
        loadComponent: () => import('./features/plants/plant-list/plant-list.component')
          .then(m => m.PlantListComponent),
        title: 'Plantes - Admin'
      },

      // Recipes
      {
        path: 'recipes',
        loadComponent: () => import('./features/recipes/recipe-list/recipe-list.component')
          .then(m => m.RecipeListComponent),
        title: 'Recettes - Admin'
      },
      {
        path: 'recipes/moderation',
        loadComponent: () => import('./features/recipes/recipe-moderation/recipe-moderation.component')
          .then(m => m.RecipeModerationComponent),
        title: 'Modération recettes - Admin'
      },

      // Reviews
      {
        path: 'reviews',
        loadComponent: () => import('./features/reviews/review-list/review-list.component')
          .then(m => m.ReviewListComponent),
        title: 'Avis - Admin'
      }
    ]
  },

  // 404
  {
    path: '**',
    redirectTo: ''
  }
];
