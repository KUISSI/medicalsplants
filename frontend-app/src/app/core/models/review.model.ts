import { User } from './user.model';

export interface Review {
  id: string;
  content: string;
  sender: User;
  recipeId: string;
  parentReviewId?: string;
  replies?: Review[];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateReviewRequest {
  recipeId: string;
  content: string;
  parentReviewId?: string;
}