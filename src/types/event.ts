
export type EventStatus = 'UPCOMING' | 'PAST' | 'CANCELLED';

export interface Event {
  id: string;
  title: string;
  date: string; // ISO 8601 format
  location: string;
  description: string;
  image?: string;
  imageHint?: string;
  status: EventStatus;
  href?: string;
  createdAt: string;
  updatedAt: string;
}
