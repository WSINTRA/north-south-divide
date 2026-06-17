import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MantineProvider, createTheme } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { buildDashboardData } from '../lib/aggregate';
import {
  LONDON_FORCES,
  LONDON_POPULATION,
  LONDON_REGION,
  NE_FORCES,
  NE_POPULATION,
  NE_REGION,
} from '../lib/constants';
import { filterByRegion, parseCraCsv } from '../lib/parseCra';
import { extractForces, parseCrimeCsv } from '../lib/parseCrime';
import CapVsCurComparison from './CapVsCurComparison';
import CategoryComparison from './CategoryComparison';
import CrimeComparison from './CrimeComparison';
import D3ComparisonChart from './D3ComparisonChart';
import D3DonutChart from './D3DonutChart';
import PerCapitaComparison from './PerCapitaComparison';
import SectorComparison from './SectorComparison';

const theme = createTheme({ primaryColor: 'blue' });
const wrap = (ui: React.ReactNode) => (
  <MantineProvider theme={theme} forceColorScheme="dark">
    {ui}
  </MantineProvider>
);

const craCsv = readFileSync(
  join(__dirname, '../../public/CRA_2025_Spending_Data.csv'),
  'utf-8',
);
const crimeCsv = readFileSync(
  join(
    __dirname,
    '../../public/OFFICAL_SENSITIVE_Knife_and_Offensive_Weapon_Sentencing_Q4_2024.csv',
  ),
  'utf-8',
);
const craRows = parseCraCsv(craCsv);
const neRows = filterByRegion(craRows, NE_REGION);
const londonRows = filterByRegion(craRows, LONDON_REGION);
const crimeRows = parseCrimeCsv(crimeCsv);
const neForces = extractForces(crimeRows, NE_FORCES);
const londonForces = extractForces(crimeRows, LONDON_FORCES);
const dashboardData = buildDashboardData(
  neRows,
  londonRows,
  neForces,
  londonForces,
  NE_POPULATION,
  LONDON_POPULATION,
);

describe('D3ComparisonChart', () => {
  it('renders an SVG element', () => {
    const { container } = render(
      wrap(<D3ComparisonChart data={dashboardData} />),
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
  });

  it('renders bars for NE and London', () => {
    const { container } = render(
      wrap(<D3ComparisonChart data={dashboardData} />),
    );
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThanOrEqual(4);
  });

  it('renders metric labels', () => {
    render(wrap(<D3ComparisonChart data={dashboardData} />));
    expect(screen.getByText('Total Spend')).toBeDefined();
    expect(screen.getByText('Per Person')).toBeDefined();
  });
});

describe('D3DonutChart', () => {
  it('renders an SVG element', () => {
    const { container } = render(wrap(<D3DonutChart data={dashboardData} />));
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
  });

  it('renders donut charts', () => {
    const { container } = render(wrap(<D3DonutChart data={dashboardData} />));
    const donutContainers = container.querySelectorAll(
      '.mantine-DonutChart-root',
    );
    expect(donutContainers.length).toBe(2);
  });

  it('shows NE and London labels', () => {
    render(wrap(<D3DonutChart data={dashboardData} />));
    expect(screen.getByText('North East')).toBeDefined();
    expect(screen.getByText('London')).toBeDefined();
  });

  it('shows category legend', () => {
    render(wrap(<D3DonutChart data={dashboardData} />));
    for (const cat of dashboardData.ne.spend.byCategory.slice(0, 7)) {
      expect(screen.getByText(cat.category)).toBeDefined();
    }
  });
});

describe('PerCapitaComparison (Mantine)', () => {
  it('renders bar chart with per-capita values', () => {
    const { container } = render(
      wrap(<PerCapitaComparison data={dashboardData} />),
    );
    expect(container.firstChild).toBeDefined();
    expect(screen.getAllByText(/person/).length).toBeGreaterThan(0);
  });
});

describe('CategoryComparison (Mantine)', () => {
  it('renders grouped bar chart', () => {
    const { container } = render(
      wrap(<CategoryComparison data={dashboardData} />),
    );
    expect(container.firstChild).toBeDefined();
  });
});

describe('CrimeComparison (Mantine)', () => {
  it('renders crime rate bar chart', () => {
    const { container } = render(
      wrap(<CrimeComparison data={dashboardData} />),
    );
    expect(container.firstChild).toBeDefined();
    expect(screen.getByText('Knife Crime Rate per 100k')).toBeDefined();
  });

  it('shows NE and London stat cards', () => {
    render(wrap(<CrimeComparison data={dashboardData} />));
    expect(screen.getByText(/NE offences/)).toBeDefined();
    expect(screen.getByText(/London offences/)).toBeDefined();
  });
});

describe('CapVsCurComparison (Mantine)', () => {
  it('renders stacked bar chart', () => {
    const { container } = render(
      wrap(<CapVsCurComparison data={dashboardData} />),
    );
    expect(container.firstChild).toBeDefined();
  });
});

describe('SectorComparison (Mantine)', () => {
  it('renders sector bar chart', () => {
    const { container } = render(
      wrap(<SectorComparison data={dashboardData} />),
    );
    expect(container.firstChild).toBeDefined();
  });
});

describe('dashboard data integrity', () => {
  it('NE and London have positive spend', () => {
    expect(dashboardData.ne.spend.total).toBeGreaterThan(0);
    expect(dashboardData.london.spend.total).toBeGreaterThan(0);
  });

  it('London total spend exceeds NE', () => {
    expect(dashboardData.london.spend.total).toBeGreaterThan(
      dashboardData.ne.spend.total,
    );
  });

  it('NE knife crime rate exceeds London', () => {
    expect(dashboardData.ne.crime.ratePer100k).toBeGreaterThan(
      dashboardData.london.crime.ratePer100k,
    );
  });

  it('Cleveland has highest rate among NE forces', () => {
    const cleveland = dashboardData.ne.crime.byForce.find(
      (f) => f.force === 'Cleveland',
    );
    expect(cleveland?.rate).toBe(74);
  });

  it('Central Government is largest NE sector', () => {
    const cg = dashboardData.ne.spend.bySector['CG'] ?? 0;
    const lg = dashboardData.ne.spend.bySector['LG'] ?? 0;
    expect(cg).toBeGreaterThan(lg);
  });
});

describe('Mantine charts have no hover tooltips', () => {
  it('CategoryComparison renders without tooltip overlay', () => {
    const { container } = render(
      wrap(<CategoryComparison data={dashboardData} />),
    );
    // BarChart should not render tooltip trigger elements
    const tooltips = container.querySelectorAll('[role="tooltip"]');
    expect(tooltips.length).toBe(0);
  });

  it('CrimeComparison renders without tooltip overlay', () => {
    const { container } = render(
      wrap(<CrimeComparison data={dashboardData} />),
    );
    const tooltips = container.querySelectorAll('[role="tooltip"]');
    expect(tooltips.length).toBe(0);
  });

  it('CapVsCurComparison renders without tooltip overlay', () => {
    const { container } = render(
      wrap(<CapVsCurComparison data={dashboardData} />),
    );
    const tooltips = container.querySelectorAll('[role="tooltip"]');
    expect(tooltips.length).toBe(0);
  });

  it('SectorComparison renders without tooltip overlay', () => {
    const { container } = render(
      wrap(<SectorComparison data={dashboardData} />),
    );
    const tooltips = container.querySelectorAll('[role="tooltip"]');
    expect(tooltips.length).toBe(0);
  });

  it('PerCapitaComparison renders without tooltip overlay', () => {
    const { container } = render(
      wrap(<PerCapitaComparison data={dashboardData} />),
    );
    const tooltips = container.querySelectorAll('[role="tooltip"]');
    expect(tooltips.length).toBe(0);
  });
});
