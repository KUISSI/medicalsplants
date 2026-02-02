import { Plant } from './plant.model';
import { User } from './user. model';

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
  createdAt: string;
  updatedAt?: string;
}

export interface ReceiptPage {
  content: Receipt[];
  totalElements:  number;
  totalPages: number;
  size: number;
  number: number;
}

export const RECEIPT_TYPE_LABELS: Record<ReceiptType, string> = {
  'HOT_DRINK': 'Boisson chaude',
  'COLD_DRINK': 'Boisson froide',
  'DISH': 'Plat',
  'LOTION': 'Lotion'
};

export const RECEIPT_STATUS_LABELS:  Record<ReceiptStatus, string> = {
  'DRAFT': 'Brouillon',
  'PENDING': 'En attente',
  'PUBLISHED': 'Publié',
  'REJECTED': 'Rejeté'
};

export const RECEIPT_STATUS_COLORS:  Record<ReceiptStatus, string> = {
  'DRAFT': '#9e9e9e',
  'PENDING': '#ff9800',
  'PUBLISHED': '#4caf50',
  'REJECTED': '#f44336'
};