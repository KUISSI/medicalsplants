export interface Symptom {
  id: string;
  title: string;
  family: string;
  description?:  string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSymptomRequest {
  title: string;
  family: string;
  description?:  string;
}

export interface UpdateSymptomRequest {
  title:  string;
  family: string;
  description?: string;
}
