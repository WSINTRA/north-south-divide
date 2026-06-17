export interface CraRow {
  departmentName: string;
  organisationName: string;
  craSegmentCode: string;
  craSegmentName: string;
  cofogLevel0: string;
  hmtFunction: string;
  cofogLevel1: string;
  hmtSubfunction: string;
  idNonId: 'ID' | 'Non-ID';
  capOrCur: 'CAP' | 'CUR';
  sector: 'CG' | 'LG' | 'PC' | 'BOE' | 'PSP';
  allocatedBy: 'HMT' | 'DEPT';
  itlRegion: string;
  country: string;
  spend2024_25: number;
}

export interface CrimeRow {
  policeForce: string;
  offences2024: number;
  rate2024: number;
}

export interface RegionSpend {
  total: number;
  perCapita: number;
  byCategory: Array<{ category: string; spend: number }>;
  bySector: Record<string, number>;
  cap: number;
  cur: number;
  id: number;
  nonId: number;
  justiceSpend: number;
}

export interface RegionCrime {
  totalOffences: number;
  ratePer100k: number;
  byForce: Array<{ force: string; offences: number; rate: number }>;
}

export interface DashboardData {
  ne: {
    spend: RegionSpend;
    crime: RegionCrime;
  };
  london: {
    spend: RegionSpend;
    crime: RegionCrime;
  };
}
