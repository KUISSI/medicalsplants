import { Property } from './property.model';

export interface Plant {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  properties?: Property[];
  createdAt: string;
  updatedAt?: string;
}

export interface PlantPage {
  content: Plant[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CreatePlantRequest {
  title: string;
  description?:  string;
  propertyIds?: string[];
}

export interface UpdatePlantRequest {
  title:  string;
  description?: string;
}
