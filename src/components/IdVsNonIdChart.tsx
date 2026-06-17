import { DonutChart } from '@mantine/charts';
import { Group, Paper, Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';

function IdVsNonIdChart() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  const total = data.spendIdNonId.id + data.spendIdNonId.nonId;
  const idPercent = ((data.spendIdNonId.id / total) * 100).toFixed(1);
  const nonIdPercent = ((data.spendIdNonId.nonId / total) * 100).toFixed(1);

  const chartData = [
    { name: 'Identifiable', value: data.spendIdNonId.id, color: 'blue.6' },
    {
      name: 'Non-Identifiable',
      value: data.spendIdNonId.nonId,
      color: 'gray.6',
    },
  ];

  return (
    <Group justify="center" gap="xl" wrap="wrap">
      <DonutChart
        data={chartData}
        withLabels
        withLabelsLine
        labelsType="percent"
        size={200}
        thickness={25}
      />
      <div>
        <Paper p="sm" withBorder mb="xs">
          <Text fw={600}>Identifiable: {idPercent}%</Text>
          <Text size="sm" c="dimmed">
            £{(data.spendIdNonId.id / 1_000_000_000).toFixed(1)}B — spent for
            the benefit of the North East
          </Text>
        </Paper>
        <Paper p="sm" withBorder>
          <Text fw={600}>Non-Identifiable: {nonIdPercent}%</Text>
          <Text size="sm" c="dimmed">
            £{(data.spendIdNonId.nonId / 1_000_000_000).toFixed(1)}B — UK-wide,
            not attributable to region
          </Text>
        </Paper>
      </div>
    </Group>
  );
}

export default IdVsNonIdChart;
