import { BarChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';

const sectorLabels: Record<string, string> = {
  CG: 'Central Government',
  LG: 'Local Government',
  PC: 'Public Corporations',
  BOE: 'Bank of England',
  PSP: 'Public Sector Pensions',
};

function SectorChart() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  const chartData = Object.entries(data.spendBySector)
    .sort(([, a], [, b]) => b - a)
    .map(([sector, value]) => ({
      sector: sectorLabels[sector] ?? sector,
      spend: value,
    }));

  return (
    <BarChart
      h={300}
      data={chartData}
      dataKey="sector"
      series={[{ name: 'spend', label: 'Total Spend', color: 'blue.6' }]}
      withTooltip
      xAxisProps={{ tickFormatter: (v: string) => v }}
      yAxisProps={{
        tickFormatter: (v: number) => `£${(v / 1_000_000_000).toFixed(1)}B`,
      }}
    />
  );
}

export default SectorChart;
