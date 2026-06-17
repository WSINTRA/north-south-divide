import Papa from 'papaparse';
import type { CrimeRow } from '../types';

const parseNumber = (raw: string): number => {
  const cleaned = raw.replace(/,/g, '').trim();
  return cleaned === 'u' ? 0 : Number(cleaned);
};

export const parseCrimeCsv = (csv: string): CrimeRow[] => {
  const result = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data
    .filter((row) => row['Police Force Area'])
    .map((row) => ({
      policeForce: row['Police Force Area'] ?? '',
      offences2014: parseNumber(row['Number of offences: 2014'] ?? '0'),
      offences2015: parseNumber(row['Number of offences: 2015'] ?? '0'),
      offences2016: parseNumber(row['Number of offences: 2016'] ?? '0'),
      offences2017: parseNumber(row['Number of offences: 2017'] ?? '0'),
      offences2018: parseNumber(row['Number of offences: 2018'] ?? '0'),
      offences2019: parseNumber(row['Number of offences: 2019'] ?? '0'),
      offences2020: parseNumber(row['Number of offences: 2020'] ?? '0'),
      offences2021: parseNumber(row['Number of offences: 2021'] ?? '0'),
      offences2022: parseNumber(row['Number of offences: 2022'] ?? '0'),
      offences2023: parseNumber(row['Number of offences: 2023'] ?? '0'),
      offences2024: parseNumber(row['Number of offences: 2024'] ?? '0'),
      rate2014: parseNumber(row['Rate per 100,000: 2014 [note 10]'] ?? '0'),
      rate2015: parseNumber(row['Rate per 100,000: 2015 [note 10]'] ?? '0'),
      rate2016: parseNumber(row['Rate per 100,000: 2016 [note 10]'] ?? '0'),
      rate2017: parseNumber(row['Rate per 100,000: 2017 [note 10]'] ?? '0'),
      rate2018: parseNumber(row['Rate per 100,000: 2018 [note 10]'] ?? '0'),
      rate2019: parseNumber(row['Rate per 100,000: 2019 [note 10]'] ?? '0'),
      rate2020: parseNumber(row['Rate per 100,000: 2020 [note 10]'] ?? '0'),
      rate2021: parseNumber(row['Rate per 100,000: 2021 [note 10]'] ?? '0'),
      rate2022: parseNumber(row['Rate per 100,000: 2022 [note 10]'] ?? '0'),
      rate2023: parseNumber(row['Rate per 100,000: 2023 [note 10]'] ?? '0'),
      rate2024: parseNumber(row['Rate per 100,000: 2024 [note 10]'] ?? '0'),
    }));
};

export const extractForces = (
  rows: CrimeRow[],
  forceNames: string[],
): CrimeRow[] => rows.filter((row) => forceNames.includes(row.policeForce));

export const aggregateNeCrime = (forces: CrimeRow[]): CrimeRow => {
  const sum = (getter: (r: CrimeRow) => number) =>
    forces.reduce((acc, r) => acc + getter(r), 0);

  return {
    policeForce: 'North East',
    offences2014: sum((r) => r.offences2014),
    offences2015: sum((r) => r.offences2015),
    offences2016: sum((r) => r.offences2016),
    offences2017: sum((r) => r.offences2017),
    offences2018: sum((r) => r.offences2018),
    offences2019: sum((r) => r.offences2019),
    offences2020: sum((r) => r.offences2020),
    offences2021: sum((r) => r.offences2021),
    offences2022: sum((r) => r.offences2022),
    offences2023: sum((r) => r.offences2023),
    offences2024: sum((r) => r.offences2024),
    rate2014: sum((r) => r.rate2014),
    rate2015: sum((r) => r.rate2015),
    rate2016: sum((r) => r.rate2016),
    rate2017: sum((r) => r.rate2017),
    rate2018: sum((r) => r.rate2018),
    rate2019: sum((r) => r.rate2019),
    rate2020: sum((r) => r.rate2020),
    rate2021: sum((r) => r.rate2021),
    rate2022: sum((r) => r.rate2022),
    rate2023: sum((r) => r.rate2023),
    rate2024: sum((r) => r.rate2024),
  };
};
