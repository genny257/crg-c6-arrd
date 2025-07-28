
export type DonationStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';
export type DonationMethod = 'AirtelMoney' | 'MoovMoney' | 'PayPal';

export interface Donation {
  id: string;
  name: string;
  amount: number;
  type: 'Ponctuel' | 'Mensuel';
  method: DonationMethod;
  createdAt: string; // ISO 8601 format
  status: DonationStatus;
  email: string;
  airtelMoneyId?: string;
}
