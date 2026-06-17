import { Group, Text, Title } from '@mantine/core';

function Header() {
  return (
    <Group justify="space-between" align="flex-start" mb="xl">
      <div>
        <Title order={1}>North East England</Title>
        <Title order={2} c="dimmed">
          Public Spending & Knife Crime Dashboard
        </Title>
        <Text c="dimmed" mt="xs">
          CRA 2025 Spending Data • Knife & Offensive Weapon Sentencing 2014-2024
        </Text>
      </div>
    </Group>
  );
}

export default Header;
