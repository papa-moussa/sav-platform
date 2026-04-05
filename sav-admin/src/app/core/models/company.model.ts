export type CompanyStatus = 'ACTIVE' | 'SUSPENDED';

export interface Company {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  status: CompanyStatus;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRequest {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
}
