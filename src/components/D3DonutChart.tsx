import { DonutChart } from '@mantine/charts';
import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import useDashboardData from '../lib/useDashboardData';
import type { DashboardData } from '../types';

interface Props {
  data?: DashboardData;
}

const DONUT_COLORS = [
  '#fa5252',
  '#be4bdb',
  '#4c6ef5',
  '#15aabf',
  '#82c91e',
  '#fab005',
  '#fd7e14',
];

const formatValue = (v: number): string =>
  `£${(v / 1_000_000_000).toFixed(1)}B`;

function D3DonutChart({ data: propData }: Props) {
  const hookData = useDashboardData();
  const { data, loading, error } = propData
    ? { data: propData, loading: false, error: null }
    : hookData;

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  const neCategories = data.ne.spend.byCategory.slice(0, 7);
  const londonCategories = data.london.spend.byCategory.slice(0, 7);

  const neDonutData = neCategories.map((c, i) => ({
    name: c.category,
    value: c.spend,
    color: DONUT_COLORS[i % DONUT_COLORS.length] as string,
  }));

  const londonDonutData = londonCategories.map((c, i) => ({
    name: c.category,
    value: c.spend,
    color: DONUT_COLORS[i % DONUT_COLORS.length] as string,
  }));

  const allCategories = Array.from(
    new Set([
      ...neCategories.map((c) => c.category),
      ...londonCategories.map((c) => c.category),
    ]),
  ).slice(0, 7);

  return (
    <div>
      <Group justify="center" gap="xl" wrap="wrap" mb="md">
        <Paper p="md" withBorder radius="md" style={{ textAlign: 'center' }}>
          <Text size="sm" fw={600} mb="md">
            North East
          </Text>
          <DonutChart
            data={neDonutData}
            size={220}
            thickness={24}
            paddingAngle={2}
            w={260}
            h={260}
            valueFormatter={formatValue}
          />
        </Paper>

        <Paper p="md" withBorder radius="md" style={{ textAlign: 'center' }}>
          <Text size="sm" fw={600} mb="md">
            London
          </Text>
          <DonutChart
            data={londonDonutData}
            size={220}
            thickness={24}
            paddingAngle={2}
            w={260}
            h={260}
            valueFormatter={formatValue}
          />
        </Paper>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xs">
        {allCategories.map((cat, i) => (
          <Group key={cat} gap="xs">
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length],
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
            <Text size="xs" c="dimmed">
              {cat}
            </Text>
          </Group>
        ))}
      </SimpleGrid>
    </div>
  );
}

export default D3DonutChart;
