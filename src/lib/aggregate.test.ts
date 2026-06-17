import { describe, expect, it } from 'vitest';
import type { CraRow, CrimeRow } from '../types';
import { buildDashboardData } from './aggregate';

const makeCraRow = (
  region: string,
  cofog: string,
  sector: 'CG' | 'LG' | 'PC',
  spend: number,
  capOrCur: 'CAP' | 'CUR' = 'CUR',
  idNonId: 'ID' | 'Non-ID' = 'ID',
): CraRow => ({
  departmentName: 'Test',
  organisationName: 'Test',
  craSegmentCode: 'TEST',
  craSegmentName: 'Test',
  cofogLevel0: cofog,
  hmtFunction: cofog,
  cofogLevel1: '1.1 Test',
  hmtSubfunction: '1.1 Test',
  idNonId,
  capOrCur,
  sector,
  allocatedBy: 'HMT',
  itlRegion: region,
  country: 'ENGLAND',
  spend2024_25: spend,
});

const makeCrimeRow = (
  force: string,
  offences: number,
  rate: number,
): CrimeRow => ({
  policeForce: force,
  offences2024: offences,
  rate2024: rate,
});

describe('buildDashboardData', () => {
  const neRows = [
    makeCraRow('ENGLAND_North East', '7. Health', 'CG', 100_000),
    makeCraRow(
      'ENGLAND_North East',
      '1. General public services',
      'LG',
      50_000,
      'CAP',
    ),
    makeCraRow('ENGLAND_North East', '3. Defence', 'CG', 30_000),
  ];
  const londonRows = [
    makeCraRow('ENGLAND_London', '7. Health', 'CG', 200_000),
    makeCraRow(
      'ENGLAND_London',
      '1. General public services',
      'LG',
      80_000,
      'CAP',
    ),
    makeCraRow('ENGLAND_London', '3. Defence', 'CG', 60_000),
  ];
  const neCrime = [
    makeCrimeRow('Northumbria', 608, 46),
    makeCrimeRow('Cleveland', 386, 74),
    makeCrimeRow('Durham', 220, 38),
  ];
  const londonCrime = [
    makeCrimeRow('Metropolitan Police', 3783, 48),
    makeCrimeRow('City of London', 36, 0),
  ];

  const data = buildDashboardData(
    neRows,
    londonRows,
    neCrime,
    londonCrime,
    2_700_000,
    8_800_000,
  );

  it('calculates total spend for each region', () => {
    expect(data.ne.spend.total).toBe(180_000);
    expect(data.london.spend.total).toBe(340_000);
  });

  it('calculates per capita spend', () => {
    expect(data.ne.spend.perCapita).toBe(Math.round(180_000 / 2_700_000));
    expect(data.london.spend.perCapita).toBe(Math.round(340_000 / 8_800_000));
  });

  it('aggregates spend by category', () => {
    expect(data.ne.spend.byCategory).toHaveLength(3);
    const health = data.ne.spend.byCategory.find(
      (c) => c.category === 'Health',
    );
    expect(health?.spend).toBe(100_000);
  });

  it('splits capital vs current spend', () => {
    expect(data.ne.spend.cap).toBe(50_000);
    expect(data.ne.spend.cur).toBe(130_000);
  });

  it('splits identifiable vs non-identifiable spend', () => {
    expect(data.ne.spend.id).toBe(180_000);
    expect(data.ne.spend.nonId).toBe(0);
  });

  it('aggregates crime data for each region', () => {
    expect(data.ne.crime.totalOffences).toBe(608 + 386 + 220);
    expect(data.ne.crime.ratePer100k).toBe(46 + 74 + 38);
    expect(data.ne.crime.byForce).toHaveLength(3);
  });

  it('calculates justice spend correctly', () => {
    expect(data.ne.spend.justiceSpend).toBe(30_000);
    expect(data.london.spend.justiceSpend).toBe(60_000);
  });

  it('aggregates spend by sector', () => {
    expect(data.ne.spend.bySector['CG']).toBe(130_000);
    expect(data.ne.spend.bySector['LG']).toBe(50_000);
  });
});
