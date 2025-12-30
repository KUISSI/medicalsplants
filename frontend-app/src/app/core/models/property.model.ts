import { Symptom } from './symptom. model';

export interface Property {
  id: string;
  title: string;
  propertyFamily: string;
  propertyDetail?: string;
  symptoms?:  Symptom[];
  createdAt: string;
  updatedAt?: string;
}