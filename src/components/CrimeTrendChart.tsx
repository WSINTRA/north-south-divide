import { AreaChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';

function CrimeTrendChart() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  const chartData = data.crimeAggregate.map((d, i) => ({
    year: d.year,
    ne: d.offences,
    ew: data.crimeEwAvg[i]?.offences ?? 0,
  }));

  return (
    <AreaChart
      h={300}
      data={chartData}
      dataKey="year"
      series={[
        { name: 'ne', label: 'North East', color: 'red.6' },
        { name: 'ew', label: 'England & Wales', color: 'gray.6' },
      ]}
      withGradient
      withTooltip
      curveType="monotone"
    />
  );
}

export default CrimeTrendChart;
