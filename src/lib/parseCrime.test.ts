import { describe, expect, it } from 'vitest';
import { aggregateNeCrime, extractForces, parseCrimeCsv } from './parseCrime';

const sampleCsv = `Police Force Area,Number of offences: 2014,Number of offences: 2015,Number of offences: 2024,Rate per 100,000: 2014 [note 10],Rate per 100,000: 2015 [note 10],Rate per 100,000: 2024 [note 10]
England and Wales,16312,17476,20422,33,35,38
Northumbria,521,591,608,41,46,46
Cleveland,257,255,386,52,52,74
Durham,236,234,220,43,42,38
Metropolitan Police,3393,4054,3783,47,55,48`;

describe('parseCrimeCsv', () => {
  it('parses CSV into typed CrimeRow objects', () => {
    const rows = parseCrimeCsv(sampleCsv);
    expect(rows).toHaveLength(5);
  });

  it('strips commas from offence numbers', () => {
    const rows = parseCrimeCsv(sampleCsv);
    const metro = rows.find((r) => r.policeForce === 'Metropolitan Police');
    expect(metro?.offences2014).toBe(3393);
  });
});

describe('extractForces', () => {
  it('extracts only specified police forces', () => {
    const rows = parseCrimeCsv(sampleCsv);
    const forces = extractForces(rows, ['Northumbria', 'Cleveland', 'Durham']);
    expect(forces).toHaveLength(3);
    expect(forces.map((f) => f.policeForce)).toEqual([
      'Northumbria',
      'Cleveland',
      'Durham',
    ]);
  });
});

describe('aggregateNeCrime', () => {
  it('sums offences across NE forces by year', () => {
    const rows = parseCrimeCsv(sampleCsv);
    const forces = extractForces(rows, ['Northumbria', 'Cleveland', 'Durham']);
    const aggregate = aggregateNeCrime(forces);
    expect(aggregate.offences2024).toBe(608 + 386 + 220);
  });
});
