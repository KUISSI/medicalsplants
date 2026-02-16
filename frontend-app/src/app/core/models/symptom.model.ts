import { Property } from './property.model';

export interface Symptom {
  id: string;
  title: string;
  family: string;
  description?:  string;
  properties?: Property[];
  createdAt: string;
  updatedAt?:  string;
}

export interface SymptomGroup {
  family: string;
  symptoms: Symptom[];
}