import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // Login (accessible uniquement si non connecté)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'Connexion - Admin',
  },

  // Routes protégées (Admin uniquement) — wrapped dans le layout
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
    canActivate: [adminGuard],
    children: [
      // Dashboard
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Dashboard - Admin',
      },

      // Users
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/user-list/user-list.component').then((m) => m.UserListComponent),
        title: 'Utilisateurs - Admin',
      },

      // Symptoms
      {
        path: 'symptoms',
        loadComponent: () =>
          import('./features/symptoms/symptom-list/symptom-list.component').then(
            (m) => m.SymptomListComponent,
          ),
        title: 'Symptômes - Admin',
      },

      // Properties
      {
        path: 'properties',
        loadComponent: () =>
          import('./features/properties/property-list/property-list.component').then(
            (m) => m.PropertyListComponent,
          ),
        title: 'Propriétés - Admin',
      },

      // Plants
      {
        path: 'plants',
        loadComponent: () =>
          import('./features/plants/plant-list/plant-list.component').then(
            (m) => m.PlantListComponent,
          ),
        title: 'Plantes - Admin',
      },

      // Recipes
      {
        path: 'recipes',
        loadComponent: () =>
          import('./features/recipes/recipe-list/recipe-list.component').then(
            (m) => m.RecipeListComponent,
          ),
        title: 'Recettes - Admin',
      },
      {
        path: 'recipes/moderation',
        loadComponent: () =>
          import('./features/recipes/recipe-moderation/recipe-moderation.component').then(
            (m) => m.RecipeModerationComponent,
          ),
        title: 'Modération recettes - Admin',
      },

      // Reviews
      {
        path: 'reviews',
        loadComponent: () =>
          import('./features/reviews/review-list/review-list.component').then(
            (m) => m.ReviewListComponent,
          ),
        title: 'Avis - Admin',
      },

      // User Edit
      {
        path: 'users/:id/edit',
        loadComponent: () =>
          import('./features/users/user-edit/user-edit.component').then((m) => m.UserEditComponent),
        title: 'Modifier utilisateur - Admin',
      },

      // Symptoms form (new & edit)
      {
        path: 'symptoms/new',
        loadComponent: () =>
          import('./features/symptoms/symptom-form/symptom-form.component').then(
            (m) => m.SymptomFormComponent,
          ),
        title: 'Nouveau symptome - Admin',
      },
      {
        path: 'symptoms/:id/edit',
        loadComponent: () =>
          import('./features/symptoms/symptom-form/symptom-form.component').then(
            (m) => m.SymptomFormComponent,
          ),
        title: 'Modifier symptome - Admin',
      },

      // Properties form (new & edit)
      {
        path: 'properties/new',
        loadComponent: () =>
          import('./features/properties/property-form/property-form.component').then(
            (m) => m.PropertyFormComponent,
          ),
        title: 'Nouvelle propriete - Admin',
      },
      {
        path: 'properties/:id/edit',
        loadComponent: () =>
          import('./features/properties/property-form/property-form.component').then(
            (m) => m.PropertyFormComponent,
          ),
        title: 'Modifier propriete - Admin',
      },

      // Plants form (new & edit)
      {
        path: 'plants/new',
        loadComponent: () =>
          import('./features/plants/plant-form/plant-form.component').then(
            (m) => m.PlantFormComponent,
          ),
        title: 'Nouvelle plante - Admin',
      },
      {
        path: 'plants/:id/edit',
        loadComponent: () =>
          import('./features/plants/plant-form/plant-form.component').then(
            (m) => m.PlantFormComponent,
          ),
        title: 'Modifier plante - Admin',
      },

      // Receipts
      {
        path: 'receipts/moderation',
        loadComponent: () =>
          import('./features/receipts/receipt-moderation/receipt-moderation.component').then(
            (m) => m.ReceiptModerationComponent,
          ),
        title: 'Moderation recettes - Admin',
      },
      {
        path: 'receipts',
        loadComponent: () =>
          import('./features/receipts/receipt-list/receipt-list.component').then(
            (m) => m.ReceiptListComponent,
          ),
        title: 'Recettes - Admin',
      },
    ],
  },

  // 404
  {
    path: '**',
    redirectTo: '',
  },
];
