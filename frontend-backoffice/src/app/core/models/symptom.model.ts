export interface Symptom {
  id: string;
  title: string;
  symptomFamily: string;
  symptomDetail?:  string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSymptomRequest {
  title: string;
  symptomFamily: string;
  symptomDetail?:  string;
}

export interface UpdateSymptomRequest {
  title:  string;
  symptomFamily: string;
  symptomDetail?: string;
}
