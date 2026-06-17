import { Text } from '@mantine/core';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import useDashboardData from '../lib/useDashboardData';
import type { DashboardData } from '../types';

interface Props {
  data?: DashboardData;
}

const METRICS: Array<{
  key: string;
  label: string;
  format: (v: number) => string;
}> = [
  {
    key: 'totalSpend',
    label: 'Total Spend',
    format: (v) => `£${(v / 1_000_000_000).toFixed(1)}B`,
  },
  {
    key: 'perPerson',
    label: 'Per Person',
    format: (v) => `£${v.toLocaleString()}`,
  },
  {
    key: 'justicePerPerson',
    label: 'Justice / Person',
    format: (v) => `£${v.toLocaleString()}`,
  },
  { key: 'crimeRate', label: 'Crime Rate', format: (v) => `${v}/100k` },
];

function D3ComparisonChart({ data: propData }: Props) {
  const hookData = useDashboardData();
  const { data, loading, error } = propData
    ? { data: propData, loading: false, error: null }
    : hookData;
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 140, bottom: 20, left: 120 };
    const width = 600;
    const height = METRICS.length * 70 + margin.top + margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    svg.attr('width', width).attr('height', height);

    const nePerCapita = data.ne.spend.perCapita;
    const londonPerCapita = data.london.spend.perCapita;
    const neJusticePerCap = Math.round(data.ne.spend.justiceSpend / 2_700_000);
    const londonJusticePerCap = Math.round(
      data.london.spend.justiceSpend / 8_800_000,
    );

    const values: Array<{ ne: number; london: number }> = [
      { ne: data.ne.spend.total, london: data.london.spend.total },
      { ne: nePerCapita, london: londonPerCapita },
      { ne: neJusticePerCap, london: londonJusticePerCap },
      { ne: data.ne.crime.ratePer100k, london: data.london.crime.ratePer100k },
    ];

    const maxVal = d3.max(values.flatMap((v) => [v.ne, v.london])) ?? 1;

    const xScale = d3
      .scaleLinear()
      .domain([0, maxVal * 1.15])
      .range([0, innerWidth]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const barHeight = 22;
    const groupHeight = 60;

    METRICS.forEach((metric, i) => {
      const yPos = i * groupHeight + 10;
      const v = values[i] as { ne: number; london: number };
      const neW = xScale(v.ne);
      const londonW = xScale(v.london);

      g.append('text')
        .attr('x', -8)
        .attr('y', yPos + barHeight / 2 + 4)
        .attr('text-anchor', 'end')
        .attr('fill', 'var(--mantine-color-dimmed)')
        .attr('font-size', '12px')
        .text(metric.label);

      g.append('rect')
        .attr('x', 0)
        .attr('y', yPos)
        .attr('width', 0)
        .attr('height', barHeight)
        .attr('fill', 'var(--mantine-color-red-6)')
        .attr('rx', 3)
        .attr('ry', 3)
        .transition()
        .duration(600)
        .delay(i * 120)
        .attr('width', neW);

      g.append('text')
        .attr('x', neW + 6)
        .attr('y', yPos + barHeight / 2 + 4)
        .attr('fill', 'var(--mantine-color-red-6)')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .text(`NE: ${metric.format(v.ne)}`);

      g.append('rect')
        .attr('x', 0)
        .attr('y', yPos + barHeight + 4)
        .attr('width', 0)
        .attr('height', barHeight)
        .attr('fill', 'var(--mantine-color-blue-6)')
        .attr('rx', 3)
        .attr('ry', 3)
        .transition()
        .duration(600)
        .delay(i * 120 + 200)
        .attr('width', londonW);

      g.append('text')
        .attr('x', londonW + 6)
        .attr('y', yPos + barHeight + 4 + barHeight / 2 + 4)
        .attr('fill', 'var(--mantine-color-blue-6)')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .text(`London: ${metric.format(v.london)}`);
    });
  }, [data]);

  if (loading) return <Text c="dimmed">Loading...</Text>;
  if (error) return <Text c="red">{error}</Text>;
  if (!data) return <Text c="dimmed">No data available</Text>;

  return (
    <div>
      <svg ref={svgRef} />
    </div>
  );
}

export default D3ComparisonChart;
