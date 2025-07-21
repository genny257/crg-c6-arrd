
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
