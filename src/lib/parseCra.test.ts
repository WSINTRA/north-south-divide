import { describe, expect, it } from 'vitest';
import { filterByRegion, parseCraCsv } from './parseCra';

const sampleCsv = `Department Name,Organisation Name,CRA Segment Code,CRA Segment Name,COFOG Level 0,HMT Function,COFOG Level 1,HMT Subfunction,ID/non-ID,CAP or CUR,"CG, LG, PC, BOE, PSP",Allocated by HMT or DEPT,ITL Region,Country,2020-21,2021-22,2022-23,2023-24,2024-25
Test Dept,Test Org,SEG001,Segment 1,3. Public order and safety,3. Public order and safety,3.1 Police,3.1 Police,ID,CAP,CG,DEPT,ENGLAND_North East,ENGLAND,"100,000","110,000","120,000","130,000","140,000"
Test Dept,Test Org,SEG002,Segment 2,7. Health,7. Health,7.1 Medical,7.1 Medical,ID,CUR,LG,DEPT,ENGLAND_North East,ENGLAND,"50,000","55,000","60,000","65,000","70,000"
Other Dept,Other Org,SEG003,Segment 3,9. Education,9. Education,9.1 Primary,9.1 Primary,ID,CUR,CG,DEPT,ENGLAND_London,ENGLAND,"200,000","210,000","220,000","230,000","240,000"`;

describe('parseCraCsv', () => {
  it('parses CSV into typed CraRow objects', () => {
    const rows = parseCraCsv(sampleCsv);
    expect(rows).toHaveLength(3);
  });

  it('strips commas from expenditure values and converts to pounds', () => {
    const rows = parseCraCsv(sampleCsv);
    const firstRow = rows[0];
    expect(firstRow.spend2020_21).toBe(100_000_000);
    expect(firstRow.spend2024_25).toBe(140_000_000);
  });

  it('maps CSV columns to correct type properties', () => {
    const rows = parseCraCsv(sampleCsv);
    const firstRow = rows[0];
    expect(firstRow.departmentName).toBe('Test Dept');
    expect(firstRow.cofogLevel0).toBe('3. Public order and safety');
    expect(firstRow.idNonId).toBe('ID');
    expect(firstRow.capOrCur).toBe('CAP');
    expect(firstRow.sector).toBe('CG');
    expect(firstRow.itlRegion).toBe('ENGLAND_North East');
  });
});

describe('filterByRegion', () => {
  it('filters rows to only include specified region', () => {
    const rows = parseCraCsv(sampleCsv);
    const filtered = filterByRegion(rows, 'ENGLAND_North East');
    expect(filtered).toHaveLength(2);
    expect(filtered.every((r) => r.itlRegion === 'ENGLAND_North East')).toBe(
      true,
    );
  });
});
