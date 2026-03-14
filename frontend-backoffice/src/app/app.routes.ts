import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
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
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Dashboard - Admin',
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/user-list/user-list.component').then((m) => m.UserListComponent),
        title: 'Utilisateurs - Admin',
      },
      {
        path: 'users/: id',
        loadComponent: () =>
          import('./features/users/user-edit/user-edit.component').then((m) => m.UserEditComponent),
        title: 'Modifier utilisateur - Admin',
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
      {
        path: 'symptoms/new',
        loadComponent: () =>
          import('./features/symptoms/symptom-form/symptom-form.component').then(
            (m) => m.SymptomFormComponent,
          ),
        title: 'Nouveau symptôme - Admin',
      },
      {
        path: 'symptoms/: id/edit',
        loadComponent: () =>
          import('./features/symptoms/symptom-form/symptom-form. component').then(
            (m) => m.SymptomFormComponent,
          ),
        title: 'Modifier symptôme - Admin',
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
      {
        path: 'properties/new',
        loadComponent: () =>
          import('./features/properties/property-form/property-form.component').then(
            (m) => m.PropertyFormComponent,
          ),
        title: 'Nouvelle propriété - Admin',
      },
      {
        path: 'properties/:id/edit',
        loadComponent: () =>
          import('./features/properties/property-form/property-form.component').then(
            (m) => m.PropertyFormComponent,
          ),
        title: 'Modifier propriété - Admin',
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
        path: 'receipts',
        loadComponent: () =>
          import('./features/receipts/receipt-list/receipt-list.component').then(
            (m) => m.ReceiptListComponent,
          ),
        title: 'Recettes - Admin',
      },
      {
        path: 'receipts/moderation',
        loadComponent: () =>
          import('./features/receipts/receipt-moderation/receipt-moderation.component').then(
            (m) => m.ReceiptModerationComponent,
          ),
        title: 'Modération - Admin',
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
