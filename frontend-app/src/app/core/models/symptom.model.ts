export interface Symptom {
  id: string;
  title: string;
  symptomFamily: string;
  symptomDetail?:  string;
  createdAt: string;
  updatedAt?:  string;
}

export interface SymptomGroup {
  family: string;
  symptoms: Symptom[];
}