import { User } from './user. model';

export interface Review {
  id: string;
  content: string;
  sender: User;
  receiptId: string;
  parentReviewId?: string;
  replies?: Review[];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateReviewRequest {
  receiptId: string;
  content: string;
  parentReviewId?: string;
}