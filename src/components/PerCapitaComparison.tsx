import { BarChart } from '@mantine/charts';
import { Group, Paper, Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';
import type { DashboardData } from '../types';

interface Props {
  data?: DashboardData;
}

function PerCapitaComparison({ data: propData }: Props) {
  const hookData = useDashboardData();
  const { data, loading, error } = propData
    ? { data: propData, loading: false, error: null }
    : hookData;

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;
  const formatCurrency = (v: number): string => `£${v.toLocaleString()}`;
  const ne = data.ne.spend.perCapita;
  const london = data.london.spend.perCapita;
  const ratio = london / ne;

  const chartData = [
    { region: 'North East', perCapita: ne, fill: 'var(--mantine-color-red-6)' },
    {
      region: 'London',
      perCapita: london,
      fill: 'var(--mantine-color-blue-6)',
    },
  ];

  return (
    <div>
      <Group justify="center" gap="xl" mb="md" wrap="wrap">
        <Paper p="md" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            North East (pop. 2.7M)
          </Text>
          <Text fw={700} size="xl" c="red.6">
            {formatCurrency(ne)}/person
          </Text>
        </Paper>
        <Paper p="md" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            London (pop. 8.8M)
          </Text>
          <Text fw={700} size="xl" c="blue.6">
            {formatCurrency(london)}/person
          </Text>
        </Paper>
      </Group>
      <BarChart
        h={200}
        data={chartData}
        dataKey="region"
        tooltipAnimationDuration={200}
        series={[
          { name: 'perCapita', label: 'Per Person Spend', color: 'green.6' },
        ]}
        yAxisProps={{
          tickFormatter: (v: number) => `£${v.toLocaleString()}`,
        }}
        barProps={{
          label: {
            position: 'top',
            fill: 'var(--mantine-color-dimmed)',
            fontSize: 11,
          },
        }}
      />
      <Text size="sm" c="dimmed" ta="center" mt="sm">
        London spends <strong>{ratio.toFixed(1)}x</strong> more per person than
        the North East
      </Text>
    </div>
  );
}

export default PerCapitaComparison;
