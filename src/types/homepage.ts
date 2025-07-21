
export interface ActionSection {
  title: string;
  description: string;
  image: string;
  imageHint: string;
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
  actions: ActionSection[];
  engagement: EngagementSection;
}

    