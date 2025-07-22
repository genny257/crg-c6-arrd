export interface Donation {
  id: string;
  name: string;
  amount: number;
  type: 'Ponctuel' | 'Mensuel';
  method: 'Mobile Money' | 'Carte Bancaire' | 'Carte_Bancaire';
  createdAt: string; // ISO 8601 format
  status: 'Confirmé' | 'En_attente' | 'Échoué';
  email: string;
}
