import { Container, Paper, SimpleGrid, Text, Title } from '@mantine/core';

import {
  DEFAULT_THEME,
  MantineProvider,
  createTheme,
  mergeMantineTheme,
} from '@mantine/core';

import CapVsCurComparison from './components/CapVsCurComparison';
import CategoryComparison from './components/CategoryComparison';
import Conclusion from './components/Conclusion';
import CrimeComparison from './components/CrimeComparison';
import D3ComparisonChart from './components/D3ComparisonChart';
import D3DonutChart from './components/D3DonutChart';
import Header from './components/Header';
import PerCapitaComparison from './components/PerCapitaComparison';
import SectorComparison from './components/SectorComparison';
import Summary from './components/Summary';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
const themeOverride = createTheme({
  primaryColor: 'blue',
  headings: { fontWeight: '600' },
});
const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);

function App() {
  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      <Container size="xl" py="xl">
        <Header />
        <Summary />

        <Text size="sm" c="dimmed" mb="md">
          Data: CRA 2025 (ONS) &bull; Knife & Offensive Weapon Sentencing
          (Ministry of Justice)
        </Text>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb="xl">
          <Paper p="md" withBorder radius="md">
            <Title order={3} mb="md">
              How Spending Compares
            </Title>
            <D3ComparisonChart />
          </Paper>

          <Paper p="md" withBorder radius="md">
            <Title order={3} mb="md">
              Spending Per Person
            </Title>
            <PerCapitaComparison />
          </Paper>
        </SimpleGrid>

        <Paper mb="xl" p="md" withBorder radius="md">
          <Title order={3} mb="md">
            Spending Categories — North East vs London
          </Title>
          <D3DonutChart />
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Paper p="md" withBorder radius="md">
            <Title order={3} mb="md">
              Spending by Category (Top 6)
            </Title>
            <CategoryComparison />
          </Paper>

          <Paper p="md" withBorder radius="md">
            <Title order={3} mb="md">
              Knife Crime Rate Comparison
            </Title>
            <CrimeComparison />
          </Paper>

          <Paper p="md" withBorder radius="md">
            <Title order={3} mb="md">
              Capital vs Current Spending
            </Title>
            <CapVsCurComparison />
          </Paper>

          <Paper p="md" withBorder radius="md">
            <Title order={3} mb="md">
              Spending by Sector
            </Title>
            <SectorComparison />
          </Paper>
        </SimpleGrid>

        <Conclusion />

        <Text size="xs" c="dimmed" ta="center" mt="xl">
          Central Government Spending Database (CRA 2025) &bull; Office for
          National Statistics &bull; Ministry of Justice Knife Crime Sentencing
          Data
        </Text>
      </Container>
    </MantineProvider>
  );
}

export default App;
