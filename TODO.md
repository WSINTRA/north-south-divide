# TODO.md — UK Stats Dashboard

## Phase 1: Project Setup
- [x] git init
- [x] Create AGENTS.md
- [ ] Create TODO.md
- [ ] Scaffold Vite + React + TypeScript project
- [ ] Install dependencies: @mantine/core, @mantine/hooks, @mantine/charts, d3, papaparse
- [ ] Install dev dependencies: vitest, @testing-library/react, @biomejs/biome
- [ ] Configure biome.json
- [ ] Configure vitest
- [ ] Configure Mantine dark theme in main.tsx
- [ ] Commit: `chore: scaffold project with vite, mantine, biome, vitest`

## Phase 2: Data Layer (R/G/TDD)
- [ ] Write types.ts — CraRow, CrimeRow, AggregatedSpend, CrimeByYear, etc.
- [ ] Write lib/constants.ts — NE_REGION, NE_POPULATION, force names
- [ ] Test: lib/parseCra.test.ts — CSV parsing, comma stripping, filtering
- [ ] Implement: lib/parseCra.ts
- [ ] Test: lib/parseCrime.test.ts — CSV parsing, force extraction, aggregation
- [ ] Implement: lib/parseCrime.ts
- [ ] Test: lib/aggregate.test.ts — COFOG aggregation, CAP/CUR split, ID/Non-ID split
- [ ] Implement: lib/aggregate.ts
- [ ] Commit: `feat: data parsing and aggregation layer`

## Phase 3: D3 Map
- [ ] Source GeoJSON for Cleveland (combined), Durham, North Yorkshire
- [ ] Embed as src/data/counties.json
- [ ] Test: MapChart.test.tsx — renders 3 counties, tooltips show correct data
- [ ] Implement: MapChart.tsx with d3 geo projection, color scale, tooltips
- [ ] Commit: `feat: d3 map of North East counties`

## Phase 4: Chart Components (R/G/TDD each)
- [ ] CrimeTrendChart — AreaChart, NE aggregate vs E&W avg, 2014-24
- [ ] SpendCategoryChart — BarChart (stacked), COFOG Level 0, 2020-25
- [ ] JusticeVsCrimeChart — LineChart (dual-axis), COFOG 3 spend vs crime rate
- [ ] CapVsCurChart — BarChart (stacked), Capital vs Current by year
- [ ] IdVsNonIdChart — DonutChart, identifiable vs non-identifiable spend
- [ ] SectorChart — BarChart, CG vs LG vs PC breakdown
- [ ] Commit: `feat: all chart components`

## Phase 5: Dashboard Assembly
- [ ] Header.tsx — title, subtitle, data source attribution
- [ ] App.tsx — SimpleGrid layout, all 7 panels
- [ ] Polish: responsive layout, loading states, error boundaries
- [ ] Commit: `feat: dashboard assembly and polish`

## Phase 6: Final
- [ ] Run full test suite, fix any failures
- [ ] Run biome check --write
- [ ] Final commit: `chore: final lint and test pass`
