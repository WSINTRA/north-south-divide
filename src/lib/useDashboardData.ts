import { useEffect, useState } from 'react';
import { buildDashboardData } from '../lib/aggregate';
import { NE_FORCES, NE_REGION } from '../lib/constants';
import { filterByRegion, parseCraCsv } from '../lib/parseCra';
import { extractForces, parseCrimeCsv } from '../lib/parseCrime';
import type { DashboardData } from '../types';

const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [craRes, crimeRes] = await Promise.all([
          fetch('/CRA_2025_Spending_Data.csv'),
          fetch(
            '/OFFICAL_SENSITIVE_Knife_and_Offensive_Weapon_Sentencing_Q4_2024.csv',
          ),
        ]);

        if (!craRes.ok || !crimeRes.ok) {
          throw new Error('Failed to load CSV data');
        }

        const [craCsv, crimeCsv] = await Promise.all([
          craRes.text(),
          crimeRes.text(),
        ]);

        const craRows = parseCraCsv(craCsv);
        const neRows = filterByRegion(craRows, NE_REGION);

        const crimeRows = parseCrimeCsv(crimeCsv);
        const neForces = extractForces(crimeRows, NE_FORCES);

        const dashboardData = buildDashboardData(neRows, [
          ...neForces,
          ...crimeRows.filter((r) => r.policeForce === 'England and Wales'),
        ]);
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};

export default useDashboardData;
