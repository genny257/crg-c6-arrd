export type DonationStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface Donation {
  id: string;
  name: string;
  amount: number;
  type: 'Ponctuel' | 'Mensuel';
  method: 'Mobile Money' | 'Carte_Bancaire';
  createdAt: string; // ISO 8601 format
  status: DonationStatus;
  email: string;
}
