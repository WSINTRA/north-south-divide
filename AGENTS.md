# AGENTS.md — UK Stats Dashboard

## Project Overview
Single-page React dashboard visualizing North East England public spending (CRA 2025) vs knife crime statistics (2014-2024).

## Tech Stack
- **Vite + React + TypeScript**
- **@mantine/core** + **@mantine/charts** (built on Recharts)
- **d3** — bespoke SVG map of North East counties
- **papaparse** — CSV parsing
- **vitest** — testing
- **biome** — linting and formatting

## Code Conventions

### General
- **Arrow functions** preferred over function declarations
- **Modular functional code** — small, single-responsibility functions
- **Separation of concerns** — data parsing, aggregation, and rendering are separate layers
- **TypeScript** — strict mode, no `any`, explicit return types on exported functions

### Naming
- Components: PascalCase (`CrimeTrendChart.tsx`)
- Functions: camelCase (`aggregateByCofog`, `parseCraCsv`)
- Types/Interfaces: PascalCase (`CraRow`, `AggregatedSpend`)
- Constants: UPPER_SNAKE_CASE (`NE_REGION`, `NE_POPULATION`)

### File Structure
```
src/
├── main.tsx              # Entry: MantineProvider + dark theme
├── App.tsx               # Single-page dashboard layout
├── types.ts              # Shared TypeScript interfaces
├── lib/
│   ├── parseCra.ts       # CSV parsing for CRA data
│   ├── parseCrime.ts     # CSV parsing for knife crime data
│   ├── aggregate.ts      # Aggregation functions
│   └── constants.ts      # Hardcoded values (population, region names)
├── components/
│   ├── Header.tsx
│   ├── MapChart.tsx
│   ├── CrimeTrendChart.tsx
│   ├── SpendCategoryChart.tsx
│   ├── JusticeVsCrimeChart.tsx
│   ├── CapVsCurChart.tsx
│   ├── IdVsNonIdChart.tsx
│   └── SectorChart.tsx
└── data/
    └── counties.json     # GeoJSON for Cleveland, Durham, North Yorkshire
```

### Testing (R/G/TDD)
1. **Red**: Write a failing test first
2. **Green**: Write minimal code to pass
3. **Refactor**: Clean up, extract functions, improve types
- Test data parsing, aggregation logic, and utility functions
- Use `vitest` with `@testing-library/react` for component tests
- Tests co-located: `lib/parseCra.test.ts` alongside `lib/parseCra.ts`

### Linting & Formatting
- **biome** for both linting and formatting
- Run `biome check --write src/` before committing
- Config in `biome.json`

### Git
- Commit as stages complete
- Conventional commit messages: `feat:`, `test:`, `refactor:`, `chore:`
- Stage and commit after each logical unit is complete

## Data Sources
- `public/CRA_2025_Spending_Data.csv` — 20,450 rows, filter `ITL Region === "ENGLAND_North East"`
- `public/OFFICAL_SENSITIVE_Knife_and_Offensive_Weapon_Sentencing_Q4_2024.csv` — Table 4, police force areas
- Expenditure values in £'000s with commas — strip commas, parse as numbers, multiply by 1000

## Key Constants
- NE population: ~2.7M (ONS mid-year estimate)
- NE police forces: Northumbria, Cleveland, Durham
- Cleveland abolished April 2024 → merged into Northumbria (Hartlepool, Middlesbrough, Redcar & Cleveland, Stockton-on-Tees)
