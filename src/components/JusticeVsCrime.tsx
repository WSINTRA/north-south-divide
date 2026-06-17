import { Group, Paper, Text } from '@mantine/core';
import { LONDON_POPULATION, NE_POPULATION } from '../lib/constants';
import useDashboardData from '../lib/useDashboardData';

function JusticeVsCrime() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  const neJusticeTotal = data.ne.spend.justiceSpend;
  const londonJusticeTotal = data.london.spend.justiceSpend;
  const neJusticePerCap = Math.round(neJusticeTotal / NE_POPULATION);
  const londonJusticePerCap = Math.round(
    londonJusticeTotal / LONDON_POPULATION,
  );
  const neCrimeRate = data.ne.crime.ratePer100k;
  const londonCrimeRate = data.london.crime.ratePer100k;

  return (
    <div>
      <Text size="sm" fw={600} mb="xs">
        Justice Spending
      </Text>
      <Group justify="center" gap="xl" mb="md" wrap="wrap">
        <Paper p="md" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            North East
          </Text>
          <Text fw={700} size="lg" c="red.6">
            £{neJusticePerCap.toLocaleString()}/person
          </Text>
          <Text size="xs" c="dimmed">
            £{(neJusticeTotal / 1_000_000_000).toFixed(1)}B total
          </Text>
        </Paper>
        <Paper p="md" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            London
          </Text>
          <Text fw={700} size="lg" c="blue.6">
            £{londonJusticePerCap.toLocaleString()}/person
          </Text>
          <Text size="xs" c="dimmed">
            £{(londonJusticeTotal / 1_000_000_000).toFixed(1)}B total
          </Text>
        </Paper>
      </Group>
      <Text size="sm" fw={600} mb="xs">
        Knife Crime Rate
      </Text>
      <Group justify="center" gap="xl" wrap="wrap">
        <Paper p="md" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            North East
          </Text>
          <Text fw={700} size="lg" c="red.6">
            {neCrimeRate}/100k
          </Text>
        </Paper>
        <Paper p="md" withBorder style={{ flex: 1 }}>
          <Text size="xs" c="dimmed">
            London
          </Text>
          <Text fw={700} size="lg" c="blue.6">
            {londonCrimeRate}/100k
          </Text>
        </Paper>
      </Group>
    </div>
  );
}

export default JusticeVsCrime;
