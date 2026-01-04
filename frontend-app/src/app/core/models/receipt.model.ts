import { Plant } from './plant.model';
import { User } from './user.model';
import { Review } from './review.model';

export type ReceiptType = 'HOT_DRINK' | 'COLD_DRINK' | 'DISH' | 'LOTION';
export type ReceiptStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';

export interface Receipt {
  id:  string;
  title: string;
  type: ReceiptType;
  description?: string;
  imageUrl?: string;
  isPremium:  boolean;
  status: ReceiptStatus;
  author?:  User;
  plants?: Plant[];
  reviews?: Review[];
  createdAt:  string;
  updatedAt?: string;
}

export interface ReceiptPage {
  content: Receipt[];
  totalElements: number;
  totalPages: number;
  size: number;
  number:  number;
  first: boolean;
  last: boolean;
}

export interface CreateReceiptRequest {
  title: string;
  type: ReceiptType;
  description?: string;
  isPremium?:  boolean;
  plantIds?: string[];
}

export const RECEIPT_TYPE_LABELS: Record<ReceiptType, string> = {
  'HOT_DRINK': 'Boisson chaude',
  'COLD_DRINK': 'Boisson froide',
  'DISH': 'Plat',
  'LOTION': 'Lotion'
};

export const RECEIPT_STATUS_LABELS: Record<ReceiptStatus, string> = {
  'DRAFT':  'Brouillon',
  'PENDING': 'En attente',
  'PUBLISHED': 'Publié',
  'REJECTED': 'Rejeté'
};
