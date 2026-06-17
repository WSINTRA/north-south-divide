import { BarChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';
import type { DashboardData } from '../types';

interface Props {
  data?: DashboardData;
}

function CategoryComparison({ data: propData }: Props) {
  const hookData = useDashboardData();
  const { data, loading, error } = propData
    ? { data: propData, loading: false, error: null }
    : hookData;

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;
  const topCategories = data.ne.spend.byCategory
    .slice(0, 6)
    .map((c) => c.category);

  const chartData = topCategories.map((cat) => {
    const neSpend =
      data.ne.spend.byCategory.find((c) => c.category === cat)?.spend ?? 0;
    const londonSpend =
      data.london.spend.byCategory.find((c) => c.category === cat)?.spend ?? 0;
    const shortName = cat.length > 20 ? `${cat.slice(0, 20)}...` : cat;
    return {
      category: shortName,
      ne: neSpend,
      london: londonSpend,
    };
  });

  return (
    <BarChart
      h={300}
      data={chartData}
      dataKey="category"
      type="default"
      series={[
        { name: 'ne', label: 'North East', color: 'red.6' },
        { name: 'london', label: 'London', color: 'blue.6' },
      ]}
      tooltipAnimationDuration={200}
      valueFormatter={(v: number) => `£${(v / 1_000_000_000).toFixed(1)}B`}
      yAxisProps={{
        tickFormatter: (v: number) => `£${(v / 1_000_000_000).toFixed(1)}B`,
      }}
    />
  );
}

export default CategoryComparison;
