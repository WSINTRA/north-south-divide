import {
  Badge,
  Group,
  List,
  Paper,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

function Summary() {
  return (
    <Paper p="lg" withBorder radius="md" mb="xl">
      <Title order={3} mb="md">
        How To Read This Dashboard
      </Title>
      <Text size="sm" mb="md">
        This dashboard compares two regions of England: the{' '}
        <strong>North East</strong> (Northumbria, Cleveland, Durham police
        areas) and <strong>London</strong> (Metropolitan Police, City of
        London). All spending figures are for the 2024-25 financial year from
        the Central Government Spending Database (CRA 2025). Knife crime figures
        are for 2024 from the Ministry of Justice.
      </Text>

      <Group gap="md" mb="md">
        <Badge color="red" variant="light">
          Red bars = North East
        </Badge>
        <Badge color="blue" variant="light">
          Blue bars = London
        </Badge>
      </Group>

      <List
        spacing="xs"
        size="sm"
        icon={
          <ThemeIcon color="blue" size={20} radius="xl">
            <IconInfoCircle size={14} />
          </ThemeIcon>
        }
      >
        <List.Item>
          <strong>How Spending Compares:</strong> Animated horizontal bar chart
          comparing four key metrics: Total Spend, Per Person, Justice per
          Person, and Knife Crime Rate between the two regions.
        </List.Item>
        <List.Item>
          <strong>Spending Per Person:</strong> Stat cards and bar chart showing
          total spending divided by population — the fairest way to compare
          regions of different sizes.
        </List.Item>
        <List.Item>
          <strong>Spending Categories (Donut):</strong> Two donut charts showing
          the top 7 COFOG spending categories (Health, Education, Defence, etc.)
          for each region with percentage labels.
        </List.Item>
        <List.Item>
          <strong>Spending by Category (Top 6):</strong> Grouped bar chart
          comparing the top 6 spending categories side by side.
        </List.Item>
        <List.Item>
          <strong>Knife Crime Rate Comparison:</strong> Bar chart and stat cards
          showing knife crime offences per 100,000 people for each region.
        </List.Item>
        <List.Item>
          <strong>Capital vs Current Spending:</strong> Stacked bar chart
          breaking down spending into Capital (long-term assets) and Current
          (day-to-day services).
        </List.Item>
        <List.Item>
          <strong>Spending by Sector:</strong> Grouped bar chart showing whether
          spending comes from Central Government (CG), Local Government (LG), or
          Public Corporations (PC).
        </List.Item>
        <List.Item>
          <strong>Key Findings:</strong> Summary cards at the bottom
          highlighting the spending gap, crime disparity, and justice spending
          ratio between the two regions.
        </List.Item>
      </List>
    </Paper>
  );
}

export default Summary;
