import { BarChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';
import type { DashboardData } from '../types';

interface Props {
  data?: DashboardData;
}

function CapVsCurComparison({ data: propData }: Props) {
  const hookData = useDashboardData();
  const { data, loading, error } = propData
    ? { data: propData, loading: false, error: null }
    : hookData;

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;
  const chartData = [
    {
      region: 'North East',
      Capital: data.ne.spend.cap,
      Current: data.ne.spend.cur,
    },
    {
      region: 'London',
      Capital: data.london.spend.cap,
      Current: data.london.spend.cur,
    },
  ];

  return (
    <BarChart
      h={300}
      data={chartData}
      dataKey="region"
      type="stacked"
      series={[
        { name: 'Capital', label: 'Capital', color: 'blue.6' },
        { name: 'Current', label: 'Current', color: 'green.6' },
      ]}
      tooltipAnimationDuration={200}
      withLegend
      yAxisProps={{
        tickFormatter: (v: number) => `£${(v / 1_000_000_000).toFixed(1)}B`,
      }}
    />
  );
}

export default CapVsCurComparison;
