export interface MonthlyData {
  name: string;
  count?: number;
  total?: number;
}

export interface StatsData {
  keyMetrics: {
    activeVolunteers: number;
    newVolunteersThisMonth: number;
    ongoingMissions: number;
    donationsThisMonth: number;
    donationChangePercentage: number;
    engagementRate: number;
  };
  charts: {
    volunteersHistory: MonthlyData[];
    donationsHistory: MonthlyData[];
  };
}

export interface SecurityStats {
    totalRequests: number;
    totalThreats: number;
    totalBlocked: number;
    uniqueVisitors: number;
}

export interface AnnualStat {
    id: string;
    year: number;
    bases: number;
    agents: number;
    firstAidGraduates: number;
    assistedHouseholds: number;
    sensitizedPeople: number;
    condomsDistributed: number;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
}
