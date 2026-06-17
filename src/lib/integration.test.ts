import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildDashboardData } from './aggregate';
import {
  LONDON_FORCES,
  LONDON_POPULATION,
  LONDON_REGION,
  NE_FORCES,
  NE_POPULATION,
  NE_REGION,
} from './constants';
import { filterByRegion, parseCraCsv } from './parseCra';
import { extractForces, parseCrimeCsv } from './parseCrime';

const craPath = join(__dirname, '../../public/CRA_2025_Spending_Data.csv');
const crimePath = join(
  __dirname,
  '../../public/OFFICAL_SENSITIVE_Knife_and_Offensive_Weapon_Sentencing_Q4_2024.csv',
);

describe('full data pipeline with real CSVs', () => {
  const craCsv = readFileSync(craPath, 'utf-8');
  const crimeCsv = readFileSync(crimePath, 'utf-8');

  it('parses CRA CSV and filters to both regions', () => {
    const allRows = parseCraCsv(craCsv);
    expect(allRows.length).toBeGreaterThan(10_000);

    const neRows = filterByRegion(allRows, NE_REGION);
    const londonRows = filterByRegion(allRows, LONDON_REGION);

    expect(neRows.length).toBeGreaterThan(1_000);
    expect(londonRows.length).toBeGreaterThan(1_000);
    expect(neRows.every((r) => r.itlRegion === NE_REGION)).toBe(true);
    expect(londonRows.every((r) => r.itlRegion === LONDON_REGION)).toBe(true);
  });

  it('parses crime CSV and extracts NE and London forces', () => {
    const allRows = parseCrimeCsv(crimeCsv);
    const neForces = extractForces(allRows, NE_FORCES);
    const londonForces = extractForces(allRows, LONDON_FORCES);

    expect(neForces).toHaveLength(3);
    expect(londonForces).toHaveLength(2);
    expect(neForces.map((f) => f.policeForce).sort()).toEqual([
      'Cleveland',
      'Durham',
      'Northumbria',
    ]);
    expect(londonForces.map((f) => f.policeForce).sort()).toEqual([
      'City of London',
      'Metropolitan Police',
    ]);
  });

  it('builds complete dashboard data with correct structure', () => {
    const craRows = parseCraCsv(craCsv);
    const neRows = filterByRegion(craRows, NE_REGION);
    const londonRows = filterByRegion(craRows, LONDON_REGION);

    const crimeRows = parseCrimeCsv(crimeCsv);
    const neForces = extractForces(crimeRows, NE_FORCES);
    const londonForces = extractForces(crimeRows, LONDON_FORCES);

    const data = buildDashboardData(
      neRows,
      londonRows,
      neForces,
      londonForces,
      NE_POPULATION,
      LONDON_POPULATION,
    );

    expect(data.ne.spend.total).toBeGreaterThan(0);
    expect(data.london.spend.total).toBeGreaterThan(0);
    expect(data.ne.spend.byCategory.length).toBeGreaterThan(0);
    expect(data.ne.crime.byForce).toHaveLength(3);
    expect(data.london.crime.byForce).toHaveLength(2);
    expect(data.ne.spend.perCapita).toBeGreaterThan(0);
    expect(data.london.spend.perCapita).toBeGreaterThan(0);
  });

  it('London total spend exceeds North East', () => {
    const craRows = parseCraCsv(craCsv);
    const neRows = filterByRegion(craRows, NE_REGION);
    const londonRows = filterByRegion(craRows, LONDON_REGION);

    const data = buildDashboardData(
      neRows,
      londonRows,
      extractForces(parseCrimeCsv(crimeCsv), NE_FORCES),
      extractForces(parseCrimeCsv(crimeCsv), LONDON_FORCES),
      NE_POPULATION,
      LONDON_POPULATION,
    );

    expect(data.london.spend.total).toBeGreaterThan(data.ne.spend.total);
  });

  it('Cleveland has highest crime rate among NE forces', () => {
    const crimeRows = parseCrimeCsv(crimeCsv);
    const neForces = extractForces(crimeRows, NE_FORCES);
    const data = buildDashboardData(
      [],
      [],
      neForces,
      extractForces(crimeRows, LONDON_FORCES),
      NE_POPULATION,
      LONDON_POPULATION,
    );

    const cleveland = data.ne.crime.byForce.find(
      (f) => f.force === 'Cleveland',
    );
    const durham = data.ne.crime.byForce.find((f) => f.force === 'Durham');
    const northumbria = data.ne.crime.byForce.find(
      (f) => f.force === 'Northumbria',
    );

    expect(cleveland?.rate).toBeGreaterThan(durham?.rate ?? 0);
    expect(cleveland?.rate).toBeGreaterThan(northumbria?.rate ?? 0);
    expect(cleveland?.rate).toBe(74);
  });

  it('Metropolitan Police has most offences among London forces', () => {
    const crimeRows = parseCrimeCsv(crimeCsv);
    const londonForces = extractForces(crimeRows, LONDON_FORCES);
    const data = buildDashboardData(
      [],
      [],
      extractForces(crimeRows, NE_FORCES),
      londonForces,
      NE_POPULATION,
      LONDON_POPULATION,
    );

    const metro = data.london.crime.byForce.find(
      (f) => f.force === 'Metropolitan Police',
    );
    const city = data.london.crime.byForce.find(
      (f) => f.force === 'City of London',
    );

    expect(metro?.offences).toBeGreaterThan(city?.offences ?? 0);
  });

  it('Central Government is the largest spending sector for NE', () => {
    const craRows = parseCraCsv(craCsv);
    const neRows = filterByRegion(craRows, NE_REGION);
    const data = buildDashboardData(
      neRows,
      [],
      extractForces(parseCrimeCsv(crimeCsv), NE_FORCES),
      [],
      NE_POPULATION,
      LONDON_POPULATION,
    );

    const cg = data.ne.spend.bySector['CG'] ?? 0;
    const lg = data.ne.spend.bySector['LG'] ?? 0;
    expect(cg).toBeGreaterThan(lg);
  });
});
