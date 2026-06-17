import { BarChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';
import type { DashboardData } from '../types';

const sectorLabels: Record<string, string> = {
  CG: 'Central Govt',
  LG: 'Local Govt',
  PC: 'Public Corps',
  BOE: 'Bank of England',
  PSP: 'Pensions',
};

interface Props {
  data?: DashboardData;
}

function SectorComparison({ data: propData }: Props) {
  const hookData = useDashboardData();
  const { data, loading, error } = propData
    ? { data: propData, loading: false, error: null }
    : hookData;

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  const allSectors = Array.from(
    new Set([
      ...Object.keys(data.ne.spend.bySector),
      ...Object.keys(data.london.spend.bySector),
    ]),
  ).sort();

  const chartData = allSectors.map((sector) => ({
    sector: sectorLabels[sector] ?? sector,
    ne: data.ne.spend.bySector[sector] ?? 0,
    london: data.london.spend.bySector[sector] ?? 0,
  }));

  return (
    <div>
      <BarChart
        h={300}
        data={chartData}
        tooltipAnimationDuration={200}
        valueFormatter={(v: number) => `£${(v / 1_000_000_000).toFixed(1)}B`}
        dataKey="sector"
        type="default"
        series={[
          { name: 'ne', label: 'North East', color: 'red.6' },
          { name: 'london', label: 'London', color: 'blue.6' },
        ]}
        withLegend
        yAxisProps={{
          tickFormatter: (v: number) => `£${(v / 1_000_000_000).toFixed(1)}B`,
        }}
      />
    </div>
  );
}

export default SectorComparison;
