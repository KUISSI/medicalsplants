import { Plant } from './plant.model';
import { User } from './user.model';
import { Review } from './review.model';

export type RecipeType = 'HOT_DRINK' | 'COLD_DRINK' | 'DISH' | 'LOTION';
export type RecipeStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';

export interface Recipe {
  id:  string;
  title: string;
  type: RecipeType;
  description?: string;
  imageUrl?: string;
  isPremium:  boolean;
  status: RecipeStatus;
  author?:  User;
  plants?: Plant[];
  ingredients?: string[];
  reviews?: Review[];
  createdAt:  string;
  updatedAt?: string;
}

export interface RecipePage {
  content: Recipe[];
  totalElements: number;
  totalPages: number;
  size: number;
  number:  number;
  first: boolean;
  last: boolean;
}

export interface CreateRecipeRequest {
  title: string;
  type: RecipeType;
  description?: string;
  isPremium?:  boolean;
  plantIds?: string[];
  ingredients?: string[];
}

export const Recipe_TYPE_LABELS: Record<RecipeType, string> = {
  'HOT_DRINK': 'Boisson chaude',
  'COLD_DRINK': 'Boisson froide',
  'DISH': 'Plat',
  'LOTION': 'Lotion'
};

export const Recipe_STATUS_LABELS: Record<RecipeStatus, string> = {
  'DRAFT':  'Brouillon',
  'PENDING': 'En attente',
  'PUBLISHED': 'Publié',
  'REJECTED': 'Rejeté'
};
