import Papa from 'papaparse';
import type { CrimeRow } from '../types';

const parseNumber = (raw: string): number => {
  const cleaned = raw.replace(/,/g, '').trim();
  return cleaned === 'u' ? 0 : Number(cleaned);
};

const HEADER_ROW_INDEX = 5;

const findHeaderRow = (lines: string[]): number => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line?.startsWith('Police Force Area,')) return i;
  }
  return HEADER_ROW_INDEX;
};

export const parseCrimeCsv = (csv: string): CrimeRow[] => {
  const lines = csv.split('\n');
  const headerIdx = findHeaderRow(lines);
  const headerLine = lines[headerIdx] ?? '';
  const dataLines = lines.slice(headerIdx + 1);
  const csvForParsing = [headerLine, ...dataLines].join('\n');

  const result = Papa.parse<Record<string, string>>(csvForParsing, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data
    .filter((row) => row['Police Force Area'])
    .map((row) => ({
      policeForce: row['Police Force Area'] ?? '',
      offences2024: parseNumber(row['Number of offences: 2024'] ?? '0'),
      rate2024: parseNumber(row['Rate per 100,000: 2024 [note 10]'] ?? '0'),
    }));
};

export const extractForces = (
  rows: CrimeRow[],
  forceNames: readonly string[],
): CrimeRow[] => rows.filter((row) => forceNames.includes(row.policeForce));
