import { Container, Paper, SimpleGrid, Text, Title } from '@mantine/core';
import CapVsCurChart from './components/CapVsCurChart';
import CrimeTrendChart from './components/CrimeTrendChart';
import Header from './components/Header';
import IdVsNonIdChart from './components/IdVsNonIdChart';
import JusticeVsCrimeChart from './components/JusticeVsCrimeChart';
import MapChart from './components/MapChart';
import SectorChart from './components/SectorChart';
import SpendCategoryChart from './components/SpendCategoryChart';

function App() {
  return (
    <Container size="xl" py="xl">
      <Header />

      <Text size="sm" c="dimmed" mb="md">
        Data: CRA 2025 (ONS) • Knife & Offensive Weapon Sentencing (Ministry of
        Justice)
      </Text>

      <Paper mb="xl" p="md" withBorder radius="md">
        <Title order={3} mb="md">
          North East Counties — 2024 Knife Crime Rate
        </Title>
        <MapChart />
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <Paper p="md" withBorder radius="md">
          <Title order={3} mb="md">
            Crime Trend — NE vs England & Wales (2014-2024)
          </Title>
          <CrimeTrendChart />
        </Paper>

        <Paper p="md" withBorder radius="md">
          <Title order={3} mb="md">
            Public Spending by Category (2020-25)
          </Title>
          <SpendCategoryChart />
        </Paper>

        <Paper p="md" withBorder radius="md">
          <Title order={3} mb="md">
            Justice Spend vs Crime Rate
          </Title>
          <JusticeVsCrimeChart />
        </Paper>

        <Paper p="md" withBorder radius="md">
          <Title order={3} mb="md">
            Capital vs Current Spending
          </Title>
          <CapVsCurChart />
        </Paper>

        <Paper p="md" withBorder radius="md">
          <Title order={3} mb="md">
            Identifiable vs Non-Identifiable Spend
          </Title>
          <IdVsNonIdChart />
        </Paper>

        <Paper p="md" withBorder radius="md">
          <Title order={3} mb="md">
            Spending by Sector
          </Title>
          <SectorChart />
        </Paper>
      </SimpleGrid>
    </Container>
  );
}

export default App;
