import { Group, Paper, Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';

const formatBillions = (value: number): string =>
  `£${(value / 1_000_000_000).toFixed(1)}B`;

function SpendComparison() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  const neSpend = data.ne.spend.total;
  const londonSpend = data.london.spend.total;

  return (
    <div>
      <Group justify="center" gap="xl" mb="md">
        <Paper p="md" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            North East
          </Text>
          <Text fw={700} size="xl" c="red.6">
            {formatBillions(neSpend)}
          </Text>
        </Paper>
        <Paper p="md" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            London
          </Text>
          <Text fw={700} size="xl" c="blue.6">
            {formatBillions(londonSpend)}
          </Text>
        </Paper>
      </Group>
      <Text size="sm" c="dimmed" ta="center">
        London receives {(londonSpend / neSpend).toFixed(1)}x more total
        spending than the North East
      </Text>
    </div>
  );
}

export default SpendComparison;
