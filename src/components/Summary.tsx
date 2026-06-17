import { Badge, Group, Paper, SimpleGrid, Text, Title } from '@mantine/core';

function Summary() {
  return (
    <Paper p="lg" withBorder radius="md" mb="xl">
      <Title order={3} mb="md">
        What You're Looking At
      </Title>
      <Text size="sm" mb="md">
        We're comparing how the UK government spends money in the{' '}
        <strong>North East</strong> versus <strong>London</strong> — and what
        that means for knife crime. All spending data is from 2024-25, crime
        data from 2024.
      </Text>

      <Group gap="md" mb="md">
        <Badge color="red" variant="light">
          North East
        </Badge>
        <Badge color="blue" variant="light">
          London
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Paper p="md" withBorder radius="sm">
          <Text size="sm" fw={600} mb="xs">
            💰 How Spending Compares
          </Text>
          <Text size="sm" c="dimmed">
            Four key numbers side by side: total spend, per person, justice
            funding, and crime rates.
          </Text>
        </Paper>

        <Paper p="md" withBorder radius="sm">
          <Text size="sm" fw={600} mb="xs">
            📊 Spending Per Person
          </Text>
          <Text size="sm" c="dimmed">
            The fairest comparison — total spending divided by population.
          </Text>
        </Paper>

        <Paper p="md" withBorder radius="sm">
          <Text size="sm" fw={600} mb="xs">
            🍩 Where The Money Goes
          </Text>
          <Text size="sm" c="dimmed">
            Donut charts showing the top spending categories — health,
            education, defence, and more.
          </Text>
        </Paper>

        <Paper p="md" withBorder radius="sm">
          <Text size="sm" fw={600} mb="xs">
            🔪 Knife Crime Rates
          </Text>
          <Text size="sm" c="dimmed">
            Offences per 100,000 people — the standard way to compare crime
            across regions.
          </Text>
        </Paper>

        <Paper p="md" withBorder radius="sm">
          <Text size="sm" fw={600} mb="xs">
            🏗️ Capital vs Current
          </Text>
          <Text size="sm" c="dimmed">
            Long-term investments (buildings, infrastructure) versus day-to-day
            running costs.
          </Text>
        </Paper>

        <Paper p="md" withBorder radius="sm">
          <Text size="sm" fw={600} mb="xs">
            🏛️ Who's Spending
          </Text>
          <Text size="sm" c="dimmed">
            Central government, local councils, or public corporations — where
            the money comes from.
          </Text>
        </Paper>
      </SimpleGrid>

      <Text size="sm" c="dimmed" ta="center" mt="md">
        Scroll down to see the <strong>Key Findings</strong> at the bottom.
      </Text>
    </Paper>
  );
}

export default Summary;
