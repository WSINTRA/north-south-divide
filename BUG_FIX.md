# BUG_FIX.md — UK Stats Dashboard

## Bug Tracking

### MapChart — Nothing visible except title
- **Symptom**: The "North East Counties — 2024 Knife Crime Rate" panel shows only the title; no map is rendered
- **Root cause**: GeoJSON coordinates are approximate outlines that don't render properly with d3.geoMercator projection; SVG paths may be outside viewBox or too small
- **Fix**: [ ]

### Chart hover label rendering issues
- **Symptom**: Labels on hover are not rendering correctly across multiple charts
- **Root cause**: [ ]
- **Fix**: [ ]

### Unhelpful data in charts
- **Symptom**: Some charts display data that isn't useful or misleading
- **Root cause**: [ ]
- **Fix**: [ ]

## Fixes Applied

### 1. MapChart — GeoJSON rendering fix
- **Date**: 2025-06-17
- **Issue**: Map not visible
- **Fix**: [ ]
- **Commit**: [ ]

### 2. Chart hover labels
- **Date**: 2025-06-17
- **Issue**: Hover labels not rendering
- **Fix**: [ ]
- **Commit**: [ ]

### 3. Data quality improvements
- **Date**: 2025-06-17
- **Issue**: Unhelpful data
- **Fix**: [ ]
- **Commit**: [ ]
