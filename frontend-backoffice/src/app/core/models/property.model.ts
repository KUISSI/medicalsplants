import { Symptom } from './symptom.model';

export interface Property {
  id: string;
  title: string;
  family: string;
  description: string;
  symptoms?: Symptom[];
  createdAt: string;
}

export interface CreatePropertyRequest {
  title: string;
  family: string;
  description: string;
  symptomIds?: string[];
}

export interface UpdatePropertyRequest {
  title: string;
  family: string;
  description: string;
}
