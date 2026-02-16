import { Plant } from './plant.model';
import { User } from './user.model';
import { Review } from './review.model';

export type RecipeType = 'HOT_DRINK' | 'COLD_DRINK' | 'DISH' | 'LOTION' | 'OTHER';
export type RecipeStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';

export interface Recipe {
  id: string;
  title: string;
  type: RecipeType;
  description?: string;
  preparationTime?: number;
  difficulty?: string;
  servings?: number;
  ingredients?: string;
  instructions?: string;
  premium: boolean;
  status: RecipeStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  author?: User;
  plants?: Plant[];
  reviews?: Review[];
  reviewCount?: number;
  averageRating?: number;
}

export interface RecipePage {
  content: Recipe[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CreateRecipeRequest {
  title: string;
  type: RecipeType;
  description?: string;
  preparationTime?: number;
  difficulty?: string;
  servings?: number;
  ingredients?: string;
  instructions?: string;
  isPremium?: boolean;
  plantIds?: string[];
}

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
  ARCHIVED: 'Archivé'
};