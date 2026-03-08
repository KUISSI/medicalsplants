import { Property } from './property.model';

export type AdministrationMode = 'ORAL_ROUTE' | 'NASAL_ROUTE' | 'EPIDERMAL_ROUTE';

export interface Plant {
  id: string;
  title: string;
  description?: string;
  administrationMode: AdministrationMode;
  consumedPart?: string;
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
  administrationMode: AdministrationMode;
  consumedPart?:  string;
  propertyIds?: string[];
}

export interface UpdatePlantRequest {
  title:  string;
  description?: string;
  administrationMode: AdministrationMode;
  consumedPart?: string;
}

export const ADMINISTRATION_MODE_LABELS:  Record<AdministrationMode, string> = {
  'ORAL_ROUTE': 'Voie orale',
  'NASAL_ROUTE': 'Voie nasale',
  'EPIDERMAL_ROUTE': 'Voie cutanée'
};