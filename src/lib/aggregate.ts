import type {
  CraRow,
  CrimeRow,
  DashboardData,
  RegionCrime,
  RegionSpend,
} from '../types';

const sumSpend = (rows: CraRow[]): number =>
  rows.reduce((acc, r) => acc + r.spend2024_25, 0);

const aggregateSpendForRegion = (
  rows: CraRow[],
  population: number,
): RegionSpend => {
  const total = sumSpend(rows);

  const byCategoryMap = new Map<string, number>();
  rows.forEach((row) => {
    const cat = row.cofogLevel0.replace(/^\d+\.\s*/, '');
    byCategoryMap.set(cat, (byCategoryMap.get(cat) ?? 0) + row.spend2024_25);
  });

  const byCategory = Array.from(byCategoryMap.entries())
    .map(([category, spend]) => ({ category, spend }))
    .sort((a, b) => b.spend - a.spend);

  const bySector = rows.reduce(
    (acc, r) => {
      acc[r.sector] = (acc[r.sector] ?? 0) + r.spend2024_25;
      return acc;
    },
    {} as Record<string, number>,
  );

  const cap = rows
    .filter((r) => r.capOrCur === 'CAP')
    .reduce((acc, r) => acc + r.spend2024_25, 0);
  const cur = rows
    .filter((r) => r.capOrCur === 'CUR')
    .reduce((acc, r) => acc + r.spend2024_25, 0);
  const id = rows
    .filter((r) => r.idNonId === 'ID')
    .reduce((acc, r) => acc + r.spend2024_25, 0);
  const nonId = rows
    .filter((r) => r.idNonId === 'Non-ID')
    .reduce((acc, r) => acc + r.spend2024_25, 0);

  const justiceRows = rows.filter((r) => r.cofogLevel0.includes('3.'));
  const justiceSpend = sumSpend(justiceRows);

  return {
    total,
    perCapita: Math.round(total / population),
    byCategory,
    bySector,
    cap,
    cur,
    id,
    nonId,
    justiceSpend,
  };
};

const aggregateCrimeForRegion = (forces: CrimeRow[]): RegionCrime => {
  const totalOffences = forces.reduce((acc, r) => acc + r.offences2024, 0);
  const totalRate = forces.reduce((acc, r) => acc + r.rate2024, 0);

  const byForce = forces.map((f) => ({
    force: f.policeForce,
    offences: f.offences2024,
    rate: f.rate2024,
  }));

  return { totalOffences, ratePer100k: totalRate, byForce };
};

export const buildDashboardData = (
  neCraRows: CraRow[],
  londonCraRows: CraRow[],
  neCrimeRows: CrimeRow[],
  londonCrimeRows: CrimeRow[],
  nePopulation: number,
  londonPopulation: number,
): DashboardData => {
  const neSpend = aggregateSpendForRegion(neCraRows, nePopulation);
  const londonSpend = aggregateSpendForRegion(londonCraRows, londonPopulation);
  const neCrime = aggregateCrimeForRegion(neCrimeRows);
  const londonCrime = aggregateCrimeForRegion(londonCrimeRows);

  return {
    ne: { spend: neSpend, crime: neCrime },
    london: { spend: londonSpend, crime: londonCrime },
  };
};
