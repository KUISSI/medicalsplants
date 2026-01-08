import { Property } from './property.model';

export interface Symptom {
  id: string;
  title: string;
  symptomFamily: string;
  symptomDetail?:  string;
  description?: string;
  properties?: Property[];
  createdAt: string;
  updatedAt?:  string;
}

export interface SymptomGroup {
  family: string;
  symptoms: Symptom[];
}