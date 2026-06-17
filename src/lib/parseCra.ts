import Papa from 'papaparse';
import type { CraRow } from '../types';

const parseSpendValue = (raw: string): number => {
  const cleaned = raw.replace(/,/g, '');
  return Number(cleaned) * 1000;
};

export const parseCraCsv = (csv: string): CraRow[] => {
  const result = Papa.parse<CraRow>(csv, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    departmentName: row['Department Name'] ?? '',
    organisationName: row['Organisation Name'] ?? '',
    craSegmentCode: row['CRA Segment Code'] ?? '',
    craSegmentName: row['CRA Segment Name'] ?? '',
    cofogLevel0: row['COFOG Level 0'] ?? '',
    hmtFunction: row['HMT Function'] ?? '',
    cofogLevel1: row['COFOG Level 1'] ?? '',
    hmtSubfunction: row['HMT Subfunction'] ?? '',
    idNonId: (row['ID/non-ID'] ?? 'ID') as 'ID' | 'Non-ID',
    capOrCur: (row['CAP or CUR'] ?? 'CUR') as 'CAP' | 'CUR',
    sector: (row['CG, LG, PC, BOE, PSP'] ?? 'CG') as
      | 'CG'
      | 'LG'
      | 'PC'
      | 'BOE'
      | 'PSP',
    allocatedBy: (row['Allocated by HMT or DEPT'] ?? 'DEPT') as 'HMT' | 'DEPT',
    itlRegion: row['ITL Region'] ?? '',
    country: row['Country'] ?? '',
    spend2020_21: parseSpendValue(row['2020-21'] ?? '0'),
    spend2021_22: parseSpendValue(row['2021-22'] ?? '0'),
    spend2022_23: parseSpendValue(row['2022-23'] ?? '0'),
    spend2023_24: parseSpendValue(row['2023-24'] ?? '0'),
    spend2024_25: parseSpendValue(row['2024-25'] ?? '0'),
  }));
};

export const filterByRegion = (rows: CraRow[], region: string): CraRow[] =>
  rows.filter((row) => row.itlRegion === region);
