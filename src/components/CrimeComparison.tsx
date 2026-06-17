import { BarChart } from '@mantine/charts';
import { Group, Paper, Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';
import type { DashboardData } from '../types';

interface Props {
  data?: DashboardData;
}

function CrimeComparison({ data: propData }: Props) {
  const hookData = useDashboardData();
  const { data, loading, error } = propData
    ? { data: propData, loading: false, error: null }
    : hookData;

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;
  const neRate = data.ne.crime.ratePer100k;
  const londonRate = data.london.crime.ratePer100k;
  const neOffences = data.ne.crime.totalOffences;
  const londonOffences = data.london.crime.totalOffences;
  const ratio = neRate / londonRate;

  const chartData = [
    { region: 'North East', rate: neRate, offences: neOffences },
    { region: 'London', rate: londonRate, offences: londonOffences },
  ];

  return (
    <div>
      <Text size="sm" fw={600} mb="xs">
        Knife Crime Rate per 100k
      </Text>
      <BarChart
        h={250}
        data={chartData}
        tooltipAnimationDuration={200}
        dataKey="region"
        series={[{ name: 'rate', label: 'Rate per 100k', color: 'yellow.6' }]}
        barProps={{
          label: {
            position: 'top',
            fill: 'var(--mantine-color-dimmed)',
            fontSize: 12,
            fontWeight: 700,
          },
        }}
      />
      <Group justify="center" gap="xl" mt="md" wrap="wrap">
        <Paper p="sm" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            NE offences
          </Text>
          <Text fw={700} c="red.6">
            {neOffences.toLocaleString()}
          </Text>
        </Paper>
        <Paper p="sm" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            London offences
          </Text>
          <Text fw={700} c="blue.6">
            {londonOffences.toLocaleString()}
          </Text>
        </Paper>
        <Paper p="sm" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            NE rate is
          </Text>
          <Text fw={700} c="orange.6">
            {ratio.toFixed(1)}x higher
          </Text>
        </Paper>
      </Group>
    </div>
  );
}

export default CrimeComparison;
