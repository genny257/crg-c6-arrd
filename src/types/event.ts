

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  PAST = 'PAST',
  CANCELLED = 'CANCELLED'
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO 8601 format
  location: string;
  description: string;
  image?: string | null;
  imageHint?: string | null;
  status: EventStatus;
  href?: string;
  createdAt: string;
  updatedAt: string;
}
