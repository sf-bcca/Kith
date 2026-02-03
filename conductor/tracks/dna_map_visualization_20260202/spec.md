# Track: DNA Map Visualization

## Overview
Implement the "DNA Map" feature, which visualizes the geographic origins and migrations of family members across generations.

## Objectives
- Provide a geographic view of the family history.
- Visualize "Origins" (birthplaces) as points on a map.
- Visualize "Migrations" as connections between generations (parents to children).
- Enable interactive exploration of family geography.

## Requirements
- **Map View:** A stylized world map (SVG-based for the prototype).
- **Data Integration:** Pull data from `FamilyService` and `mockFamilyData`.
- **Geocoding:** Use a pre-defined lookup for common locations in the mock data.
- **Interactivity:**
    - Zoom/Pan (basic).
    - Tap on a location to see members born there.
    - Filter by generation or time period (optional enhancement).

## Visual Aesthetic
- Maintain the "Vibrant & Social" and "Modern & Minimalist" style.
- Use pink/purple tones for DNA-related elements as established in `DiscoverView`.
