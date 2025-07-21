
export interface Donation {
  id: string;
  name: string;
  amount: number;
  type: 'Ponctuel' | 'Mensuel';
  method: 'Mobile Money' | 'Carte Bancaire';
  date: string; // ISO 8601 format
  status: 'Confirmé' | 'En attente' | 'Échoué';
  email: string;
}
