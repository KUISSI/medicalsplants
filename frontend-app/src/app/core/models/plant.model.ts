import { Property } from './property.model';

export type AdministrationMode = 'ORAL_ROUTE' | 'EPIDERMAL_ROUTE' | 'NASAL_ROUTE' | 'TOPICAL_ROUTE' | 'OTHER';

export const ADMINISTRATION_MODE_LABELS: Record<AdministrationMode, string> = {
  ORAL_ROUTE: 'Voie orale',
  EPIDERMAL_ROUTE: 'Voie épidermique',
  NASAL_ROUTE: 'Voie nasale',
  TOPICAL_ROUTE: 'Voie topique',
  OTHER: 'Autre',
};

export interface Plant {
  id: string;
  title: string;
  description?:  string;
  symptomFamilies?: string[];
  imageUrl?: string;
  properties?: Property[];
  administrationMode?: AdministrationMode;
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
