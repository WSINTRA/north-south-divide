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
  spend2020_21: number;
  spend2021_22: number;
  spend2022_23: number;
  spend2023_24: number;
  spend2024_25: number;
}

export interface CrimeRow {
  policeForce: string;
  offences2014: number;
  offences2015: number;
  offences2016: number;
  offences2017: number;
  offences2018: number;
  offences2019: number;
  offences2020: number;
  offences2021: number;
  offences2022: number;
  offences2023: number;
  offences2024: number;
  rate2014: number;
  rate2015: number;
  rate2016: number;
  rate2017: number;
  rate2018: number;
  rate2019: number;
  rate2020: number;
  rate2021: number;
  rate2022: number;
  rate2023: number;
  rate2024: number;
}

export interface AggregatedSpend {
  cofogLevel0: string;
  total: number;
  byYear: Record<string, number>;
  cap: number;
  cur: number;
  id: number;
  nonId: number;
  bySector: Record<string, number>;
}

export interface CrimeByYear {
  year: string;
  offences: number;
  rate: number;
}

export interface ForceCrimeData {
  force: string;
  byYear: CrimeByYear[];
  total2024: number;
  rate2024: number;
}

export interface DashboardData {
  spendByCofog: AggregatedSpend[];
  spendByYear: Record<string, number>;
  spendCapCur: Record<string, { cap: number; cur: number }>;
  spendIdNonId: { id: number; nonId: number };
  spendBySector: Record<string, number>;
  justiceSpendByYear: Record<string, number>;
  crimeByForce: ForceCrimeData[];
  crimeAggregate: CrimeByYear[];
  crimeEwAvg: CrimeByYear[];
}
