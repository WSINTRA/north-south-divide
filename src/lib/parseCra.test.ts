import { describe, expect, it } from 'vitest';
import { LONDON_REGION, NE_REGION } from './constants';
import { filterByRegion, parseCraCsv } from './parseCra';

const sampleCsv = `Department Name,Organisation Name,CRA Segment Code,CRA Segment Name,COFOG Level 0,HMT Function,COFOG Level 1,HMT Subfunction,ID/non-ID,CAP or CUR,"CG, LG, PC, BOE, PSP",Allocated by HMT or DEPT,ITL Region,Country,2024-25
DHSC,NHS England,SEG001,SEG001,7. Health,7. Health,7.1 Medical services,7.1 Medical services,ID,CUR,CG,HMT,ENGLAND_North East,ENGLAND,"10,000"
DHSC,NHS England,SEG002,SEG002,1. General public services,1. General public services,1.1 Executive services,1.1 Executive services,Non-ID,CAP,LG,DEPT,ENGLAND_London,ENGLAND,"5,000"
MOJ,Court Service,SEG003,SEG003,3. Defence,3. Defence,3.1 General defence services,3.1 General defence services,ID,CUR,CG,HMT,ENGLAND_North East,ENGLAND,"2,500"`;

describe('parseCraCsv', () => {
  it('parses CSV into typed CraRow objects', () => {
    const rows = parseCraCsv(sampleCsv);
    expect(rows).toHaveLength(3);
    expect(rows[0]?.departmentName).toBe('DHSC');
  });

  it('strips commas from spend values and multiplies by 1000', () => {
    const rows = parseCraCsv(sampleCsv);
    expect(rows[0]?.spend2024_25).toBe(10_000_000);
  });

  it('handles zero spend values', () => {
    const csv = `Department Name,Organisation Name,CRA Segment Code,CRA Segment Name,COFOG Level 0,HMT Function,COFOG Level 1,HMT Subfunction,ID/non-ID,CAP or CUR,"CG, LG, PC, BOE, PSP",Allocated by HMT or DEPT,ITL Region,Country,2024-25
Test,Test,TEST,TEST,1. General,1. General,1.1,1.1,ID,CUR,CG,HMT,ENGLAND_North East,ENGLAND,0`;
    const rows = parseCraCsv(csv);
    expect(rows[0]?.spend2024_25).toBe(0);
  });
});

describe('filterByRegion', () => {
  it('filters rows to North East region', () => {
    const rows = parseCraCsv(sampleCsv);
    const neRows = filterByRegion(rows, NE_REGION);
    expect(neRows).toHaveLength(2);
    expect(neRows.every((r) => r.itlRegion === NE_REGION)).toBe(true);
  });

  it('filters rows to London region', () => {
    const rows = parseCraCsv(sampleCsv);
    const londonRows = filterByRegion(rows, LONDON_REGION);
    expect(londonRows).toHaveLength(1);
    expect(londonRows[0]?.spend2024_25).toBe(5_000_000);
  });
});
