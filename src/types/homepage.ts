export interface ActionSection {
  id: string;
  title: string;
  description: string;
  image: string;
  imageHint?: string | null;
  dialogTitle: string;
  dialogDescription: string;
  dialogList: string[];
}

export interface EngagementSection {
    title: string;
    description: string;
    volunteerTitle: string;
    volunteerDescription: string;
    donationTitle: string;
    donationDescription: string;
}

export interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  engagement: EngagementSection;
}

export interface AnnualStatData {
    id: string;
    year: number;
    bases: number;
    agents: number;
    firstAidGraduates: number;
    assistedHouseholds: number;
    sensitizedPeople: number;
    condomsDistributed: number;
}

export interface Partner {
    id: string;
    name: string;
    logoUrl: string;
    websiteUrl: string | null;
    order: number;
}
