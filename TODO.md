# TODO.md — UK Stats Dashboard

## Phase 1: Project Setup
- [x] git init
- [x] Create AGENTS.md
- [x] Create TODO.md
- [x] Scaffold Vite + React + TypeScript project
- [x] Install dependencies: @mantine/core, @mantine/hooks, @mantine/charts, d3, papaparse
- [x] Install dev dependencies: vitest, @testing-library/react, @biomejs/biome
- [x] Configure biome.json
- [x] Configure vitest
- [x] Configure Mantine dark theme in main.tsx
- [x] Commit: `chore: scaffold project with vite, mantine, biome, vitest`

## Phase 2: Data Layer (R/G/TDD)
- [x] Write types.ts — CraRow, CrimeRow, AggregatedSpend, CrimeByYear, etc.
- [x] Write lib/constants.ts — NE_REGION, NE_POPULATION, force names
- [x] Test: lib/parseCra.test.ts — CSV parsing, comma stripping, filtering (4 tests)
- [x] Implement: lib/parseCra.ts
- [x] Test: lib/parseCrime.test.ts — CSV parsing, force extraction, aggregation (4 tests)
- [x] Implement: lib/parseCrime.ts
- [x] Test: lib/aggregate.test.ts — COFOG aggregation, CAP/CUR split, ID/Non-ID split (5 tests)
- [x] Implement: lib/aggregate.ts
- [x] Commit: `feat: data parsing and aggregation layer`

## Phase 3: D3 Map
- [x] Source GeoJSON for Cleveland (combined), Durham, North Yorkshire
- [x] Embed as src/data/counties.json
- [ ] Test: MapChart.test.tsx — renders 3 counties, tooltips show correct data
- [x] Implement: MapChart.tsx with d3 geo projection, color scale, tooltips
- [x] Commit: `feat: d3 map of North East counties`

## Phase 4: Chart Components
- [x] CrimeTrendChart — AreaChart, NE aggregate vs E&W avg, 2014-24
- [x] SpendCategoryChart — BarChart (stacked), COFOG Level 0, 2020-25
- [x] JusticeVsCrimeChart — LineChart (dual-axis), COFOG 3 spend vs crime rate
- [x] CapVsCurChart — BarChart (stacked), Capital vs Current by year
- [x] IdVsNonIdChart — DonutChart, identifiable vs non-identifiable spend
- [x] SectorChart — BarChart, CG vs LG vs PC breakdown
- [x] Commit: `feat: all chart components`

## Phase 5: Dashboard Assembly
- [x] Header.tsx — title, subtitle, data source attribution
- [x] App.tsx — SimpleGrid layout, all 7 panels
- [ ] Polish: responsive layout, loading states, error boundaries
- [ ] Commit: `feat: dashboard assembly and polish`

## Phase 6: Final
- [ ] Run full test suite, fix any failures
- [ ] Run biome check --write
- [ ] Final commit: `chore: final lint and test pass`
