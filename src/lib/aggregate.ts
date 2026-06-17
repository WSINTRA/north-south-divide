import type {
  AggregatedSpend,
  CraRow,
  CrimeByYear,
  DashboardData,
  ForceCrimeData,
} from '../types';
import type { CrimeRow } from '../types';
import { YEARS } from './constants';

const sumYears = (row: CraRow): number =>
  row.spend2020_21 +
  row.spend2021_22 +
  row.spend2022_23 +
  row.spend2023_24 +
  row.spend2024_25;

const spendForYear = (row: CraRow, year: string): number => {
  switch (year) {
    case '2020-21':
      return row.spend2020_21;
    case '2021-22':
      return row.spend2021_22;
    case '2022-23':
      return row.spend2022_23;
    case '2023-24':
      return row.spend2023_24;
    case '2024-25':
      return row.spend2024_25;
    default:
      return 0;
  }
};

export const aggregateByCofog = (rows: CraRow[]): AggregatedSpend[] => {
  const grouped = new Map<string, CraRow[]>();
  rows.forEach((row) => {
    const existing = grouped.get(row.cofogLevel0) ?? [];
    existing.push(row);
    grouped.set(row.cofogLevel0, existing);
  });

  return Array.from(grouped.entries()).map(([cofog, cofogRows]) => {
    const total = cofogRows.reduce((acc, r) => acc + sumYears(r), 0);
    const byYear = YEARS.reduce(
      (acc, year) => {
        acc[year] = cofogRows.reduce(
          (sum, r) => sum + spendForYear(r, year),
          0,
        );
        return acc;
      },
      {} as Record<string, number>,
    );

    const cap = cofogRows
      .filter((r) => r.capOrCur === 'CAP')
      .reduce((acc, r) => acc + sumYears(r), 0);
    const cur = cofogRows
      .filter((r) => r.capOrCur === 'CUR')
      .reduce((acc, r) => acc + sumYears(r), 0);
    const id = cofogRows
      .filter((r) => r.idNonId === 'ID')
      .reduce((acc, r) => acc + sumYears(r), 0);
    const nonId = cofogRows
      .filter((r) => r.idNonId === 'Non-ID')
      .reduce((acc, r) => acc + sumYears(r), 0);

    const bySector = cofogRows.reduce(
      (acc, r) => {
        acc[r.sector] = (acc[r.sector] ?? 0) + sumYears(r);
        return acc;
      },
      {} as Record<string, number>,
    );

    return { cofogLevel0: cofog, total, byYear, cap, cur, id, nonId, bySector };
  });
};

export const aggregateByYear = (rows: CraRow[]): Record<string, number> =>
  YEARS.reduce(
    (acc, year) => {
      acc[year] = rows.reduce((sum, r) => sum + spendForYear(r, year), 0);
      return acc;
    },
    {} as Record<string, number>,
  );

export const aggregateCapCur = (
  rows: CraRow[],
): Record<string, { cap: number; cur: number }> =>
  YEARS.reduce(
    (acc, year) => {
      acc[year] = {
        cap: rows
          .filter((r) => r.capOrCur === 'CAP')
          .reduce((sum, r) => sum + spendForYear(r, year), 0),
        cur: rows
          .filter((r) => r.capOrCur === 'CUR')
          .reduce((sum, r) => sum + spendForYear(r, year), 0),
      };
      return acc;
    },
    {} as Record<string, { cap: number; cur: number }>,
  );

export const aggregateIdNonId = (
  rows: CraRow[],
): { id: number; nonId: number } => ({
  id: rows
    .filter((r) => r.idNonId === 'ID')
    .reduce((acc, r) => acc + sumYears(r), 0),
  nonId: rows
    .filter((r) => r.idNonId === 'Non-ID')
    .reduce((acc, r) => acc + sumYears(r), 0),
});

export const aggregateBySector = (rows: CraRow[]): Record<string, number> =>
  rows.reduce(
    (acc, r) => {
      acc[r.sector] = (acc[r.sector] ?? 0) + sumYears(r);
      return acc;
    },
    {} as Record<string, number>,
  );

export const aggregateJusticeSpend = (
  rows: CraRow[],
): Record<string, number> => {
  const justiceRows = rows.filter((r) => r.cofogLevel0.includes('3.'));
  return aggregateByYear(justiceRows);
};

const crimeRowToByYear = (row: CrimeRow): CrimeByYear[] => [
  { year: '2014', offences: row.offences2014, rate: row.rate2014 },
  { year: '2015', offences: row.offences2015, rate: row.rate2015 },
  { year: '2016', offences: row.offences2016, rate: row.rate2016 },
  { year: '2017', offences: row.offences2017, rate: row.rate2017 },
  { year: '2018', offences: row.offences2018, rate: row.rate2018 },
  { year: '2019', offences: row.offences2019, rate: row.rate2019 },
  { year: '2020', offences: row.offences2020, rate: row.rate2020 },
  { year: '2021', offences: row.offences2021, rate: row.rate2021 },
  { year: '2022', offences: row.offences2022, rate: row.rate2022 },
  { year: '2023', offences: row.offences2023, rate: row.rate2023 },
  { year: '2024', offences: row.offences2024, rate: row.rate2024 },
];

const crimeRowToForceData = (row: CrimeRow): ForceCrimeData => ({
  force: row.policeForce,
  byYear: crimeRowToByYear(row),
  total2024: row.offences2024,
  rate2024: row.rate2024,
});

export const buildDashboardData = (
  craRows: CraRow[],
  crimeRows: CrimeRow[],
): DashboardData => {
  const spendByCofog = aggregateByCofog(craRows);
  const spendByYear = aggregateByYear(craRows);
  const spendCapCur = aggregateCapCur(craRows);
  const spendIdNonId = aggregateIdNonId(craRows);
  const spendBySector = aggregateBySector(craRows);
  const justiceSpendByYear = aggregateJusticeSpend(craRows);

  const neRows = crimeRows.filter((r) =>
    ['Northumbria', 'Cleveland', 'Durham'].includes(r.policeForce),
  );
  const ewRow = crimeRows.find((r) => r.policeForce === 'England and Wales');

  const crimeByForce = neRows.map(crimeRowToForceData);
  const zeroRow: CrimeRow = {
    policeForce: 'North East',
    offences2014: 0,
    offences2015: 0,
    offences2016: 0,
    offences2017: 0,
    offences2018: 0,
    offences2019: 0,
    offences2020: 0,
    offences2021: 0,
    offences2022: 0,
    offences2023: 0,
    offences2024: 0,
    rate2014: 0,
    rate2015: 0,
    rate2016: 0,
    rate2017: 0,
    rate2018: 0,
    rate2019: 0,
    rate2020: 0,
    rate2021: 0,
    rate2022: 0,
    rate2023: 0,
    rate2024: 0,
  };

  const aggregatedCrime = neRows.reduce(
    (acc, r) => ({
      ...acc,
      offences2014: acc.offences2014 + r.offences2014,
      offences2015: acc.offences2015 + r.offences2015,
      offences2016: acc.offences2016 + r.offences2016,
      offences2017: acc.offences2017 + r.offences2017,
      offences2018: acc.offences2018 + r.offences2018,
      offences2019: acc.offences2019 + r.offences2019,
      offences2020: acc.offences2020 + r.offences2020,
      offences2021: acc.offences2021 + r.offences2021,
      offences2022: acc.offences2022 + r.offences2022,
      offences2023: acc.offences2023 + r.offences2023,
      offences2024: acc.offences2024 + r.offences2024,
      rate2014: acc.rate2014 + r.rate2014,
      rate2015: acc.rate2015 + r.rate2015,
      rate2016: acc.rate2016 + r.rate2016,
      rate2017: acc.rate2017 + r.rate2017,
      rate2018: acc.rate2018 + r.rate2018,
      rate2019: acc.rate2019 + r.rate2019,
      rate2020: acc.rate2020 + r.rate2020,
      rate2021: acc.rate2021 + r.rate2021,
      rate2022: acc.rate2022 + r.rate2022,
      rate2023: acc.rate2023 + r.rate2023,
      rate2024: acc.rate2024 + r.rate2024,
    }),
    zeroRow,
  );

  const crimeAggregate = crimeRowToByYear(aggregatedCrime);
  const crimeEwAvg = ewRow ? crimeRowToByYear(ewRow) : [];

  return {
    spendByCofog,
    spendByYear,
    spendCapCur,
    spendIdNonId,
    spendBySector,
    justiceSpendByYear,
    crimeByForce,
    crimeAggregate,
    crimeEwAvg,
  };
};
