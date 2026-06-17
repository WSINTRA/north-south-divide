import { describe, expect, it } from 'vitest';
import type { CraRow } from '../types';
import {
  aggregateByCofog,
  aggregateBySector,
  aggregateByYear,
  aggregateCapCur,
  aggregateIdNonId,
} from './aggregate';

const sampleRows: CraRow[] = [
  {
    departmentName: 'Home Office',
    organisationName: 'Home Office',
    craSegmentCode: 'SEG001',
    craSegmentName: 'Police',
    cofogLevel0: '3. Public order and safety',
    hmtFunction: '3. Public order and safety',
    cofogLevel1: '3.1 Police',
    hmtSubfunction: '3.1 Police',
    idNonId: 'ID',
    capOrCur: 'CAP',
    sector: 'CG',
    allocatedBy: 'DEPT',
    itlRegion: 'ENGLAND_North East',
    country: 'ENGLAND',
    spend2020_21: 100_000_000,
    spend2021_22: 110_000_000,
    spend2022_23: 120_000_000,
    spend2023_24: 130_000_000,
    spend2024_25: 140_000_000,
  },
  {
    departmentName: 'DHSC',
    organisationName: 'NHS',
    craSegmentCode: 'SEG002',
    craSegmentName: 'Health',
    cofogLevel0: '7. Health',
    hmtFunction: '7. Health',
    cofogLevel1: '7.1 Medical',
    hmtSubfunction: '7.1 Medical',
    idNonId: 'ID',
    capOrCur: 'CUR',
    sector: 'LG',
    allocatedBy: 'DEPT',
    itlRegion: 'ENGLAND_North East',
    country: 'ENGLAND',
    spend2020_21: 50_000_000,
    spend2021_22: 55_000_000,
    spend2022_23: 60_000_000,
    spend2023_24: 65_000_000,
    spend2024_25: 70_000_000,
  },
  {
    departmentName: 'DfE',
    organisationName: 'DfE',
    craSegmentCode: 'SEG003',
    craSegmentName: 'Education',
    cofogLevel0: '9. Education',
    hmtFunction: '9. Education',
    cofogLevel1: '9.1 Primary',
    hmtSubfunction: '9.1 Primary',
    idNonId: 'Non-ID',
    capOrCur: 'CUR',
    sector: 'CG',
    allocatedBy: 'HMT',
    itlRegion: 'ENGLAND_North East',
    country: 'ENGLAND',
    spend2020_21: 200_000_000,
    spend2021_22: 210_000_000,
    spend2022_23: 220_000_000,
    spend2023_24: 230_000_000,
    spend2024_25: 240_000_000,
  },
];

describe('aggregateByCofog', () => {
  it('groups spending by COFOG Level 0 category', () => {
    const result = aggregateByCofog(sampleRows);
    expect(result).toHaveLength(3);
    const justice = result.find(
      (r) => r.cofogLevel0 === '3. Public order and safety',
    );
    expect(justice?.total).toBe(600_000_000);
  });
});

describe('aggregateByYear', () => {
  it('sums total spending by year', () => {
    const result = aggregateByYear(sampleRows);
    expect(result['2020-21']).toBe(350_000_000);
    expect(result['2024-25']).toBe(450_000_000);
  });
});

describe('aggregateCapCur', () => {
  it('splits spending into capital and current', () => {
    const result = aggregateCapCur(sampleRows);
    expect(result['2020-21'].cap).toBe(100_000_000);
    expect(result['2020-21'].cur).toBe(250_000_000);
  });
});

describe('aggregateIdNonId', () => {
  it('splits spending into identifiable and non-identifiable', () => {
    const result = aggregateIdNonId(sampleRows);
    expect(result.id).toBe(900_000_000);
    expect(result.nonId).toBe(1_100_000_000);
  });
});

describe('aggregateBySector', () => {
  it('groups spending by sector', () => {
    const result = aggregateBySector(sampleRows);
    expect(result['CG']).toBe(1_700_000_000);
    expect(result['LG']).toBe(300_000_000);
  });
});
