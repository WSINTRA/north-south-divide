import { test, expect } from '@playwright/test';

test.describe('Dashboard smoke tests', () => {
  test('loads the dashboard and shows all chart panels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'North East vs London', exact: true })).toBeVisible();
    await expect(page.getByText('Public Spending & Knife Crime Comparison')).toBeVisible();

    await expect(page.getByText('How To Read This Dashboard')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'How Spending Compares' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Spending Per Person' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Spending Categories — North East vs London' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Spending by Category (Top 6)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Knife Crime Rate Comparison' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Capital vs Current Spending' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Spending by Sector' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Key Findings' })).toBeVisible();

    await expect(page.getByText(/CRA 2025/).first()).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/full-dashboard.png',
      fullPage: true,
    });
  });

  test('D3ComparisonChart renders animated bars with metrics', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const panel = page.getByRole('heading', { name: 'How Spending Compares' }).locator('..');
    const svg = panel.locator('svg');
    await expect(svg).toBeVisible();
    const rects = svg.locator('rect');
    expect(await rects.count()).toBeGreaterThanOrEqual(4);

    await expect(page.getByText('Total Spend', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Per Person', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Justice / Person', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Crime Rate', { exact: true }).first()).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/d3-comparison.png',
    });
  });

  test('D3DonutChart shows spending category breakdown', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const panel = page.getByRole('heading', { name: 'Spending Categories' }).locator('..');
    const svg = panel.locator('svg');
    await expect(svg).toBeVisible();
    const paths = svg.locator('path');
    expect(await paths.count()).toBeGreaterThanOrEqual(4);

    await page.screenshot({
      path: 'e2e/screenshots/d3-donut.png',
    });
  });

  test('PerCapitaComparison shows per-person values and chart', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.getByRole('heading', { name: 'Spending Per Person' })).toBeVisible();
    await expect(page.getByText(/person/).first()).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/per-capita.png',
    });
  });

  test('CategoryComparison renders grouped bar chart', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.getByRole('heading', { name: 'Spending by Category' })).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/category-comparison.png',
    });
  });

  test('CrimeComparison shows crime rate chart and stat cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.getByRole('heading', { name: 'Knife Crime Rate Comparison' })).toBeVisible();
    await expect(page.getByText(/NE offences/)).toBeVisible();
    await expect(page.getByText(/London offences/)).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/crime-comparison.png',
    });
  });

  test('CapVsCurComparison renders stacked bar chart', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.getByRole('heading', { name: 'Capital vs Current Spending' })).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/cap-vs-cur.png',
    });
  });

  test('SectorComparison renders grouped bar chart', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.getByRole('heading', { name: 'Spending by Sector' })).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/sector-comparison.png',
    });
  });

  test('Conclusion section shows key findings', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await expect(page.getByRole('heading', { name: 'Key Findings' })).toBeVisible();
    await expect(page.getByText('Total Spending Gap')).toBeVisible();
    await expect(page.getByText('Knife Crime Disparity')).toBeVisible();
    await expect(page.getByText('What This May Mean')).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/conclusion.png',
    });
  });

  test('all stat cards and chart labels are visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    await expect(page.getByText(/£\d+\.\dB/).first()).toBeVisible();
    await expect(page.getByText(/person/).first()).toBeVisible();
    await expect(page.getByText(/\d+\/100k/).first()).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/stat-cards.png',
    });
  });

  test('MapChart renders SVG with county paths and labels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mapPanel = page.getByText('2024 Knife Crime Rate').locator('..');
    const mapSvg = mapPanel.locator('svg');
    await expect(mapSvg).toBeVisible();

    const paths = mapSvg.locator('path');
    expect(await paths.count()).toBeGreaterThanOrEqual(3);

    await expect(page.getByText('High (74)')).toBeVisible();
    await expect(page.getByText('Medium (38)')).toBeVisible();
    await expect(page.getByText('Low (25)')).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/map-chart.png',
    });
  });

  test('map hover shows tooltip with crime data', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const mapPanel = page.getByText('2024 Knife Crime Rate').locator('..');
    const mapSvg = mapPanel.locator('svg');
    const clevelandPath = mapSvg.locator('path').first();
    await clevelandPath.hover({ force: true });
    await page.waitForTimeout(800);

    const tooltip = page.locator('text').filter({ hasText: 'Cleveland' }).last();
    await expect(tooltip).toBeVisible();

    await page.screenshot({
      path: 'e2e/screenshots/map-hover.png',
    });
  });
});
