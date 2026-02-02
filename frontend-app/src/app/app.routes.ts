import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // Home
  {
    path: '',
    loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent),
    title: 'Accueil - Medicals Plants'
  },

  // Auth (accessible uniquement aux visiteurs non connectés)
  {
    path:  'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'Connexion - Medicals Plants'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component')
      .then(m => m.RegisterComponent),
    canActivate:  [guestGuard],
    title:  'Inscription - Medicals Plants'
  },
  {
    path:  'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent),
    canActivate:  [guestGuard],
    title:  'Mot de passe oublié - Medicals Plants'
  },

  // Symptoms
  {
    path: 'symptoms',
    loadComponent: () => import('./features/symptoms/symptom-list/symptom-list.component')
      .then(m => m.SymptomListComponent),
    title: 'Symptômes - Medicals Plants'
  },
  {
    path: 'symptoms/:id',
    loadComponent: () => import('./features/symptoms/symptom-detail/symptom-detail.component')
      .then(m => m.SymptomDetailComponent),
    title: 'Détail du symptôme - Medicals Plants'
  },

  // Plants
  {
    path: 'plants',
    loadComponent: () => import('./features/plants/plant-list/plant-list.component')
      .then(m => m.PlantListComponent),
    title: 'Plantes - Medicals Plants'
  },
  {
    path: 'plants/:id',
    loadComponent: () => import('./features/plants/plant-detail/plant-detail.component')
      .then(m => m.PlantDetailComponent),
    title: 'Détail de la plante - Medicals Plants'
  },

  // Recipes
  {
    path:  'recipes',
    loadComponent:  () => import('./features/recipes/recipe-list/recipe-list.component')
      .then(m => m.RecipeListComponent),
    title: 'Recettes - Medicals Plants'
  },
  {
    path: 'recipes/create',
    loadComponent: () => import('./features/recipes/recipe-create/recipe-create.component')
      .then(m => m.RecipeCreateComponent),
    canActivate: [authGuard],
    title: 'Créer une recette - Medicals Plants'
  },
  {
    path: 'recipes/:id',
    loadComponent: () => import('./features/recipes/recipe-detail/recipe-detail.component')
      .then(m => m.RecipeDetailComponent),
    title: 'Détail de la recette - Medicals Plants'
  },

  // Profile (protégé)
  {
    path:  'profile',
    loadComponent: () => import('./features/profile/profile.component')
      .then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'Mon profil - Medicals Plants'
  },

  // Authenticated Home (nouvelle page d'accueil pour utilisateurs connectés)
  {
    path: 'home',
    loadComponent: () => import('./features/home/home-auth.component')
      .then(m => m.HomeAuthComponent),
    canActivate: [authGuard],
    title: 'Accueil - Medicals Plants'
  },

  // 404 - Page non trouvée
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component')
      .then(m => m.NotFoundComponent),
    title: 'Page non trouvée - Medicals Plants'
  }
];