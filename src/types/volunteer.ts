
export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  educationLevel?: string;
  profession?: string;
  skills?: string[];
  volunteerExperience?: string;
  availability?: string[];
  causes?: string[];
  motivation?: string;
  residence: {
    province?: string;
    departement?: string;
    communeCanton?: string;
    arrondissement?: string;
    quartierVillage?: string;
  };
  interventionZone: {
    province?: string;
    departement?: string;
    communeCanton?: string;
    arrondissement?: string;
    quartierVillage?: string;
  };
  idCardFront?: string;
  idCardBack?: string;
  termsAccepted: boolean;
  createdAt: string;
  status?: string;
}
