import { BarChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';

function SpendCategoryChart() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  const years = Object.keys(data.spendByYear);
  const topCategories = data.spendByCofog
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)
    .map((c) => c.cofogLevel0.replace(/^\d+\.\s*/, ''));

  const chartData = years.map((year) => {
    const row: Record<string, unknown> = { year };
    topCategories.forEach((cat) => {
      const fullCat = data.spendByCofog.find(
        (c) => c.cofogLevel0.replace(/^\d+\.\s*/, '') === cat,
      );
      row[cat] = fullCat?.byYear[year] ?? 0;
    });
    return row;
  });

  const colors = [
    'blue.6',
    'green.6',
    'yellow.6',
    'orange.6',
    'red.6',
    'violet.6',
  ];

  return (
    <BarChart
      h={300}
      data={chartData}
      dataKey="year"
      type="stacked"
      series={topCategories.map((cat, i) => ({
        name: cat,
        label: cat,
        color: colors[i % colors.length],
      }))}
      withTooltip
      yAxisProps={{
        tickFormatter: (v: number) => `£${(v / 1_000_000_000).toFixed(1)}B`,
      }}
    />
  );
}

export default SpendCategoryChart;
