
export interface Event {
  id: string;
  title: string;
  date: string; // ISO 8601 format
  location: string;
  description: string;
  image?: string;
  imageHint?: string;
  status: 'À venir' | 'Terminé' | 'Annulé';
  href?: string;
}
