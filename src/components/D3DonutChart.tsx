import { Text } from '@mantine/core';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import useDashboardData from '../lib/useDashboardData';
import type { DashboardData } from '../types';

interface Props {
  data?: DashboardData;
}

const DONUT_COLORS = [
  '#fa5252',
  '#be4bdb',
  '#4c6ef5',
  '#15aabf',
  '#82c91e',
  '#fab005',
  '#fd7e14',
];

function D3DonutChart({ data: propData }: Props) {
  const hookData = useDashboardData();
  const { data, loading, error } = propData
    ? { data: propData, loading: false, error: null }
    : hookData;
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 700;
    const height = 340;
    const radius = 70;
    const donutWidth = 24;

    svg.attr('width', width).attr('height', height);

    const neCategories = data.ne.spend.byCategory.slice(0, 7);
    const londonCategories = data.london.spend.byCategory.slice(0, 7);

    const allLabels = new Set<string>();
    neCategories.forEach((c) => allLabels.add(c.category));
    londonCategories.forEach((c) => allLabels.add(c.category));

    const neData = neCategories.map((c) => ({
      label: c.category,
      value: c.spend / data.ne.spend.total,
    }));

    const londonData = londonCategories.map((c) => ({
      label: c.category,
      value: c.spend / data.london.spend.total,
    }));

    const pie = d3
      .pie<{ label: string; value: number }>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

    const arcOver = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(radius - donutWidth + 4)
      .outerRadius(radius + 4);

    const centers: Array<{ x: number; y: number; label: string }> = [
      { x: 160, y: 160, label: 'North East' },
      { x: 400, y: 160, label: 'London' },
    ];

    const allData = [neData, londonData];

    allData.forEach((dataset, idx) => {
      const center = centers[idx] as { x: number; y: number; label: string };
      const g = svg
        .append('g')
        .attr('transform', `translate(${center.x},${center.y})`);

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -radius - 10)
        .attr('fill', 'var(--mantine-color-dimmed)')
        .attr('font-size', '11px')
        .text(idx === 0 ? 'North East' : 'London');

      const arcs = pie(dataset);

      arcs.forEach((d, i) => {
        const color = DONUT_COLORS[i % DONUT_COLORS.length] ?? '#888';

        g.append('path')
          .attr('d', arc(d))
          .attr('fill', color)
          .attr('stroke', 'var(--mantine-color-dark-7)')
          .attr('stroke-width', 2)
          .attr('cursor', 'pointer')
          .on('mouseenter', function () {
            d3.select(this).transition().duration(200).attr('d', arcOver(d));
          })
          .on('mouseleave', function () {
            d3.select(this).transition().duration(200).attr('d', arc(d));
          });

        const pct = (d.data.value * 100).toFixed(1);
        const centroid = arc.centroid(d);
        if (d.endAngle - d.startAngle > 0.3) {
          g.append('text')
            .attr('x', centroid[0])
            .attr('y', centroid[1])
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .attr('font-weight', '600')
            .text(`${pct}%`);
        }
      });
    });

    const legendG = svg.append('g').attr('transform', 'translate(580, 20)');

    const uniqueLabels = Array.from(allLabels).slice(0, 7);

    uniqueLabels.forEach((label, i) => {
      const ly = i * 22;
      const color = DONUT_COLORS[i % DONUT_COLORS.length] ?? '#888';

      legendG
        .append('rect')
        .attr('x', 0)
        .attr('y', ly)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', color)
        .attr('rx', 2);

      legendG
        .append('text')
        .attr('x', 18)
        .attr('y', ly + 10)
        .attr('fill', 'var(--mantine-color-dimmed)')
        .attr('font-size', '10px')
        .text(label.length > 18 ? `${label.slice(0, 18)}...` : label);
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

export default D3DonutChart;
