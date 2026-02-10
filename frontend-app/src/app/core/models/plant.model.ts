import { Property } from './property.model';

export interface Plant {
  id: string;
  title: string;
  description?:  string;
  symptomFamilies?: string[];
  imageUrl?: string;
  properties?: Property[];
  consumedPart?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PlantPage {
  content: Plant[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
