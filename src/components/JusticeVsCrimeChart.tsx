import { LineChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';

function JusticeVsCrimeChart() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  const crimeYears = data.crimeAggregate.map((d) => d.year);
  const spendYears = Object.keys(data.justiceSpendByYear);

  const chartData = crimeYears.map((year) => ({
    year,
    crimeRate: data.crimeAggregate.find((d) => d.year === year)?.rate ?? 0,
    justiceSpend: spendYears.includes(year)
      ? (data.justiceSpendByYear[year] ?? 0)
      : 0,
  }));

  return (
    <LineChart
      h={300}
      data={chartData}
      dataKey="year"
      series={[
        { name: 'crimeRate', label: 'Crime Rate (/100k)', color: 'red.6' },
        { name: 'justiceSpend', label: 'Justice Spend (£)', color: 'blue.6' },
      ]}
      withTooltip
      withDots
      curveType="monotone"
      yAxisProps={{
        tickFormatter: (v: number) =>
          v > 1_000_000_000 ? `£${(v / 1_000_000_000).toFixed(1)}B` : String(v),
      }}
    />
  );
}

export default JusticeVsCrimeChart;
