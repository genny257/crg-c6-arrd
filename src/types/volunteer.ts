
export interface Volunteer {
  id: string;
  matricule?: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace?: string;
  sex?: 'masculin' | 'féminin';
  maritalStatus?: 'célibataire' | 'marié(e)' | 'divorcé(e)' | 'veuf(ve)';
  idCardType?: string;
  idCardNumber?: string;
  phone: string;
  email: string;
  address: string;
  educationLevel?: string;
  profession?: string;
  skills?: string[];
  volunteerExperience?: string;
  availability?: string[];
  causes?: string[];
  assignedCell?: string;
  residence?: {
    province?: string;
    departement?: string;
    communeCanton?: string;
    arrondissement?: string;
    quartierVillage?: string;
  };
  photo?: string;
  idCardFront?: string;
  idCardBack?: string;
  termsAccepted: boolean;
  createdAt: string;
  status?: 'En attente' | 'Actif' | 'Inactif' | 'Rejeté';
}
