import { Plant } from './plant.model';
import { User } from './user.model';

// Types (PascalCase)
export type RecipeType = 'HOT_DRINK' | 'COLD_DRINK' | 'DISH' | 'LOTION' | 'OTHER';
export type RecipeStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';

// Interfaces (PascalCase)
export interface Recipe {
  id: string;
  title: string;
  type: RecipeType;
  description?: string;
  imageUrl?: string;
  isPremium: boolean;
  status: RecipeStatus;
  author?: User;
  plants?: Plant[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRecipeRequest {
  title: string;
  type: RecipeType;
  description?: string;
  imageUrl?: string;
  isPremium?: boolean;
  plantIds?: string[];
}

export interface RecipePage {
  content: Recipe[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Constantes (SNAKE_CASE)
export const RECIPE_TYPE_LABELS: Record<RecipeType, string> = {
  HOT_DRINK: 'Boisson chaude',
  COLD_DRINK: 'Boisson froide',
  DISH: 'Plat',
  LOTION: 'Lotion',
  OTHER: 'Autre'
};

export const RECIPE_STATUS_LABELS: Record<RecipeStatus, string> = {
  DRAFT: 'Brouillon',
  PENDING: 'En attente',
  PUBLISHED: 'Publié',
  REJECTED: 'Rejeté'
};

export const RECIPE_STATUS_COLORS: Record<RecipeStatus, string> = {
  DRAFT: '#9e9e9e',
  PENDING: '#ff9800',
  PUBLISHED: '#4caf50',
  REJECTED: '#f44336'
};