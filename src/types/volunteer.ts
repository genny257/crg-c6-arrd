

export type UserStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED';

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
  educationLevel?: string | { name: string };
  profession?: string | { name: string };
  skills?: string[] | {id: string, name: string}[];
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
  status: UserStatus;
  isVolunteerOfTheMonth?: boolean;
}
