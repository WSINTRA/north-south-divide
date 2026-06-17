import { MantineProvider, createTheme } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

const theme = createTheme({
  primaryColor: 'blue',
});

const wrapWithProvider = (ui: React.ReactNode) => (
  <MantineProvider theme={theme} forceColorScheme="dark">
    {ui}
  </MantineProvider>
);

describe('App integration', () => {
  it('renders the dashboard header', () => {
    render(wrapWithProvider(<App />));
    expect(screen.getByText('North East vs London')).toBeDefined();
    expect(
      screen.getByText('Public Spending & Knife Crime Comparison'),
    ).toBeDefined();
  });

  it('renders all chart panel titles', () => {
    render(wrapWithProvider(<App />));
    expect(screen.getByText('How Spending Compares')).toBeDefined();
    expect(screen.getByText('Spending Per Person')).toBeDefined();
    expect(
      screen.getByText('Spending Categories — North East vs London'),
    ).toBeDefined();
    expect(screen.getByText('Spending by Category (Top 6)')).toBeDefined();
    expect(screen.getByText('Knife Crime Rate Comparison')).toBeDefined();
    expect(screen.getByText('Capital vs Current Spending')).toBeDefined();
    expect(screen.getByText('Spending by Sector')).toBeDefined();
  });

  it('renders summary section', () => {
    render(wrapWithProvider(<App />));
    expect(screen.getByText('How To Read This Dashboard')).toBeDefined();
  });

  it('renders data source attribution', () => {
    render(wrapWithProvider(<App />));
    const matches = screen.getAllByText(/CRA 2025/);
    expect(matches.length).toBeGreaterThan(0);
  });
});
