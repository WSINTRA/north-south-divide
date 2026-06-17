# UK Stats Dashboard

Single-page React dashboard comparing public spending in North East England with knife crime statistics.

## Overview

The dashboard visualizes:

- **Central government spending** (CRA 2025, ONS) — filtered to the North East region
- **Knife & offensive weapon sentencing** (Ministry of Justice, Q4 2024)
- Regional comparisons against London and England & Wales averages

Panels include spending breakdowns by category, sector, capital vs current, per capita analysis, and crime rate trends.

## Tech Stack

- Vite + React + TypeScript
- @mantine/core + @mantine/charts (Recharts)
- d3 — bespoke SVG visualizations
- papaparse — CSV parsing
- vitest — unit tests
- @playwright/test — end-to-end tests
- biome — linting and formatting

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Script         | Description                       |
| -------------- | --------------------------------- |
| `npm run dev`  | Start development server          |
| `npm run build`| Type-check and build for production |
| `npm run preview`| Preview production build        |
| `npm test`     | Run vitest in watch mode          |
| `npm run test:run`| Run vitest once               |
| `npm run lint` | Lint with biome                   |
| `npm run lint:fix`| Auto-fix lint issues          |

## Data Sources

- `CRA_2025_Spending_Data.csv` — Central Government Spending Database, ~20,450 rows
- `OFFICAL_SENSITIVE_Knife_and_Offensive_Weapon_Sentencing_Q4_2024.csv` — MoJ sentencing data

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Dashboard layout
├── types.ts              # Shared TypeScript interfaces
├── lib/
│   ├── parseCra.ts       # CRA CSV parsing
│   ├── parseCrime.ts     # Crime CSV parsing
│   ├── aggregate.ts      # Aggregation functions
│   └── constants.ts      # Hardcoded values
├── components/           # Dashboard chart panels
└── data/                 # GeoJSON data
```
