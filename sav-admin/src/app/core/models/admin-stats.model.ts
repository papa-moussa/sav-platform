export interface ActivityItem {
  type: 'COMPANY_CREATED' | 'USER_CREATED' | 'TICKET_CREATED' | 'FEEDBACK_SUBMITTED';
  description: string;
  companyName: string;
  timestamp: string;
}

export interface AdminStats {
  totalCompanies: number;
  activeCompanies: number;
  suspendedCompanies: number;
  totalUsers: number;
  totalTickets: number;
  totalFeedbacks: number;
  averageRating: number;
  recentActivity: ActivityItem[];
}
