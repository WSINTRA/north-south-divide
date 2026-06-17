import { Badge, Group, Text, Tooltip } from '@mantine/core';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import countiesData from '../data/counties.json';

const crimeRates: Record<string, number> = {
  Cleveland: 74,
  Durham: 38,
  'North Yorkshire': 25,
};

const crimeOffences: Record<string, number> = {
  Cleveland: 386,
  Durham: 220,
  'North Yorkshire': 186,
};

function MapChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: map only renders once on mount
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;

    svg.attr('width', width).attr('height', height);

    const projection = d3
      .geoMercator()
      .fitSize(
        [width - 40, height - 40],
        countiesData as GeoJSON.FeatureCollection,
      )
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlBu)
      .domain([75, 20]);

    const features = (countiesData as GeoJSON.FeatureCollection).features;

    svg
      .selectAll('path')
      .data(features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', (d) => {
        const name = (d.properties as { name: string }).name;
        const rate = crimeRates[name] ?? 0;
        return colorScale(rate);
      })
      .attr('stroke', 'var(--mantine-color-dark-3)')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        const name = (d.properties as { name: string }).name;
        setHovered(name);
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('stroke', 'var(--mantine-color-white)')
          .attr('stroke-width', 3);
      })
      .on('mouseleave', (event, d) => {
        const name = (d.properties as { name: string }).name;
        if (hovered === name) setHovered(null);
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('stroke', 'var(--mantine-color-dark-3)')
          .attr('stroke-width', 2);
      });

    features.forEach((feature) => {
      const name = (feature.properties as { name: string }).name;
      const centroid = path.centroid(feature);

      if (centroid[0] && centroid[1]) {
        svg
          .append('text')
          .attr('x', centroid[0])
          .attr('y', centroid[1])
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', 'var(--mantine-color-white)')
          .attr('font-size', '12px')
          .attr('font-weight', '600')
          .attr('pointer-events', 'none')
          .text(name);
      }
    });
  }, []);

  const hoveredData = hovered
    ? {
        name: hovered,
        rate: crimeRates[hovered],
        offences: crimeOffences[hovered],
      }
    : null;

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} />
      {hoveredData && (
        <Tooltip
          label={
            <Group gap="sm">
              <Text fw={600}>{hoveredData.name}</Text>
              <Badge color="red">Rate: {hoveredData.rate}/100k</Badge>
              <Badge>Offences: {hoveredData.offences}</Badge>
            </Group>
          }
          withArrow
          position="top"
        >
          <div style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} />
        </Tooltip>
      )}
      <Group mt="sm" gap="md">
        <Group gap="xs">
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: d3.interpolateRdYlBu(0),
              borderRadius: 2,
            }}
          />
          <Text size="xs" c="dimmed">
            High (74)
          </Text>
        </Group>
        <Group gap="xs">
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: d3.interpolateRdYlBu(0.5),
              borderRadius: 2,
            }}
          />
          <Text size="xs" c="dimmed">
            Medium (38)
          </Text>
        </Group>
        <Group gap="xs">
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: d3.interpolateRdYlBu(1),
              borderRadius: 2,
            }}
          />
          <Text size="xs" c="dimmed">
            Low (25)
          </Text>
        </Group>
      </Group>
    </div>
  );
}

export default MapChart;
