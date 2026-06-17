import { describe, expect, it } from 'vitest';
import { extractForces, parseCrimeCsv } from './parseCrime';

const sampleCsv = `Police Force Area,Number of offences: 2024,Rate per 100,000: 2024 [note 10]
England and Wales,20422,38
Northumbria,608,46
Cleveland,386,74
Durham,220,38
Metropolitan Police,3783,48
City of London,36,u`;

describe('parseCrimeCsv', () => {
  it('parses CSV into typed CrimeRow objects', () => {
    const rows = parseCrimeCsv(sampleCsv);
    expect(rows).toHaveLength(6);
    expect(rows[0]?.policeForce).toBe('England and Wales');
  });

  it('strips commas from offence numbers', () => {
    const rows = parseCrimeCsv(sampleCsv);
    const metro = rows.find((r) => r.policeForce === 'Metropolitan Police');
    expect(metro?.offences2024).toBe(3783);
  });

  it('handles "u" values as zero', () => {
    const rows = parseCrimeCsv(sampleCsv);
    const city = rows.find((r) => r.policeForce === 'City of London');
    expect(city?.rate2024).toBe(0);
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

  it('extracts London forces', () => {
    const rows = parseCrimeCsv(sampleCsv);
    const forces = extractForces(rows, [
      'Metropolitan Police',
      'City of London',
    ]);
    expect(forces).toHaveLength(2);
  });
});
