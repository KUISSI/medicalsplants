import { User } from './user.model';

export interface Review {
  id: string;
  content: string;
  rating?: number;
  author?: User;
  recipeId?: string;
  parentId?: string;
  replies?: Review[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  recipeId: string;
  content: string;
  rating?: number;
  parentId?: string;
}