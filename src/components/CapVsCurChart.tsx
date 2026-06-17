import { BarChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';

function CapVsCurChart() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  const chartData = Object.entries(data.spendCapCur).map(([year, values]) => ({
    year,
    cap: values.cap,
    cur: values.cur,
  }));

  return (
    <BarChart
      h={300}
      data={chartData}
      dataKey="year"
      type="stacked"
      series={[
        { name: 'cap', label: 'Capital', color: 'blue.6' },
        { name: 'cur', label: 'Current', color: 'green.6' },
      ]}
      withTooltip
      yAxisProps={{
        tickFormatter: (v: number) => `£${(v / 1_000_000_000).toFixed(1)}B`,
      }}
    />
  );
}

export default CapVsCurChart;
