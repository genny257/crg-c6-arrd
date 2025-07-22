

import type { Volunteer } from './volunteer';

export interface Mission {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO 8601 format
  endDate: string;   // ISO 8601 format
  status: 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
  requiredSkills: string[];
  participants?: Volunteer[]; // Now an array of Volunteer objects
  maxParticipants?: number;
}
