import { Group, Paper, Text, ThemeIcon, Title } from '@mantine/core';
import {
  IconAlertCircle,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';
import { LONDON_POPULATION, NE_POPULATION } from '../lib/constants';
import useDashboardData from '../lib/useDashboardData';

function Conclusion() {
  const { data, loading } = useDashboardData();

  if (loading || !data) return null;

  const spendRatio = data.london.spend.total / data.ne.spend.total;
  const perCapitaRatio = data.london.spend.perCapita / data.ne.spend.perCapita;
  const crimeRatio = data.ne.crime.ratePer100k / data.london.crime.ratePer100k;
  const justiceRatio =
    data.london.spend.justiceSpend /
    LONDON_POPULATION /
    (data.ne.spend.justiceSpend / NE_POPULATION);

  return (
    <Paper p="lg" withBorder radius="md" mb="xl">
      <Title order={3} mb="md">
        Key Findings
      </Title>

      <Group gap="lg" mb="lg" wrap="wrap">
        <div style={{ flex: 1, minWidth: 200 }}>
          <Group gap="sm" mb="xs">
            <ThemeIcon color="blue" size={32} radius="xl">
              <IconTrendingUp size={18} />
            </ThemeIcon>
            <Text fw={600}>Total Spending Gap</Text>
          </Group>
          <Text size="sm">
            London receives <strong>{spendRatio.toFixed(1)}x</strong> more
            government spending than the North East. Even accounting for
            London's larger population (
            {(LONDON_POPULATION / 1_000_000).toFixed(1)}M vs{' '}
            {(NE_POPULATION / 1_000_000).toFixed(1)}M), London gets{' '}
            <strong>{perCapitaRatio.toFixed(1)}x</strong> more per person.
          </Text>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <Group gap="sm" mb="xs">
            <ThemeIcon color="red" size={32} radius="xl">
              <IconAlertCircle size={18} />
            </ThemeIcon>
            <Text fw={600}>Knife Crime Disparity</Text>
          </Group>
          <Text size="sm">
            The North East has a knife crime rate of{' '}
            <strong>{data.ne.crime.ratePer100k} per 100,000</strong> compared to
            London's{' '}
            <strong>{data.london.crime.ratePer100k} per 100,000</strong>. The
            North East's rate is <strong>{crimeRatio.toFixed(1)}x</strong>{' '}
            higher despite receiving significantly less government funding.
          </Text>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <Group gap="sm" mb="xs">
            <ThemeIcon color="orange" size={32} radius="xl">
              <IconTrendingDown size={18} />
            </ThemeIcon>
            <Text fw={600}>Justice Spending</Text>
          </Group>
          <Text size="sm">
            London spends <strong>{justiceRatio.toFixed(1)}x</strong> more per
            person on justice services (police, courts, prisons) than the North
            East. Yet the North East faces a higher knife crime rate, suggesting
            that higher spending does not automatically translate to lower
            crime.
          </Text>
        </div>
      </Group>

      <Paper
        p="md"
        withBorder
        radius="md"
        style={{ backgroundColor: 'var(--mantine-color-dark-6)' }}
      >
        <Text size="sm" fw={600} mb="xs">
          What This May Mean
        </Text>
        <Text size="sm" c="dimmed">
          The data suggests a significant funding imbalance between the North
          East and London. While correlation does not prove causation, the North
          East receives substantially less government spending per person while
          experiencing higher knife crime rates. This could indicate that
          underfunded public services, fewer economic opportunities, and reduced
          investment in prevention programs contribute to higher crime rates.
          However, crime is influenced by many factors beyond government
          spending alone, including demographics, urban density, social
          programs, and historical trends.
        </Text>
      </Paper>
    </Paper>
  );
}

export default Conclusion;
