import { Group, Text, Title } from '@mantine/core';

function Header() {
  return (
    <Group justify="space-between" align="flex-start" mb="xl">
      <div>
        <Title order={1}>North East vs London</Title>
        <Title order={2} c="dimmed">
          Public Spending & Knife Crime Comparison
        </Title>
        <Text c="dimmed" mt="xs">
          2024-25 Government Spending (CRA 2025) &bull; 2024 Knife Crime Rates
        </Text>
      </div>
    </Group>
  );
}

export default Header;
