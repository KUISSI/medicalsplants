export const SYMPTOM_FAMILY_ICONS: Record<string, string> = {
  'Neurologique': '🧠',
  'Sommeil': '😴',
  'Psychologique': '🧘',
  'Respiratoire': '🫁',
  'Digestif': '🍽️',
  'General': '💪',
  'Cutané': '🧴',
  'Cardiovasculaire': '❤️',
  'Musculaire': '💪',
  'Immunitaire': '🛡️'
};

export const SYMPTOM_FAMILY_COLORS: Record<string, string> = {
  'Neurologique': '#9C27B0',
  'Sommeil': '#3F51B5',
  'Psychologique': '#00BCD4',
  'Respiratoire': '#4CAF50',
  'Digestif': '#FF9800',
  'General': '#607D8B',
  'Cutané': '#E91E63',
  'Cardiovasculaire': '#F44336',
  'Musculaire': '#795548',
  'Immunitaire': '#009688'
};

export function getSymptomIcon(family: string): string {
  return SYMPTOM_FAMILY_ICONS[family] || '🌿';
}

export function getFamilyColor(family: string): string {
  return SYMPTOM_FAMILY_COLORS[family] || '#4CAF50';
}