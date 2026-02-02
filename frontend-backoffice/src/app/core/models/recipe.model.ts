import { Plant } from './plant.model';
import { User } from './user. model';

export type recipeType = 'HOT_DRINK' | 'COLD_DRINK' | 'DISH' | 'LOTION';
export type recipeStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';

export interface recipe {
  id:  string;
  title: string;
  type: recipeType;
  description?: string;
  imageUrl?: string;
  isPremium:  boolean;
  status: recipeStatus;
  author?:  User;
  plants?: Plant[];
  createdAt: string;
  updatedAt?: string;
}

export interface recipePage {
  content: recipe[];
  totalElements:  number;
  totalPages: number;
  size: number;
  number: number;
}

export const recipe_TYPE_LABELS: Record<recipeType, string> = {
  'HOT_DRINK': 'Boisson chaude',
  'COLD_DRINK': 'Boisson froide',
  'DISH': 'Plat',
  'LOTION': 'Lotion'
};

export const recipe_STATUS_LABELS:  Record<recipeStatus, string> = {
  'DRAFT': 'Brouillon',
  'PENDING': 'En attente',
  'PUBLISHED': 'Publié',
  'REJECTED': 'Rejeté'
};

export const recipe_STATUS_COLORS:  Record<recipeStatus, string> = {
  'DRAFT': '#9e9e9e',
  'PENDING': '#ff9800',
  'PUBLISHED': '#4caf50',
  'REJECTED': '#f44336'
};