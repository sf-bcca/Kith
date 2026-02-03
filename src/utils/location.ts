export interface Coordinates {
  lat: number;
  lng: number;
}

export const locationLookup: Record<string, Coordinates> = {
  'London, UK': { lat: 51.5074, lng: -0.1278 },
  'Cornwall, UK': { lat: 50.2660, lng: -5.0527 },
  'Seattle, WA': { lat: 47.6062, lng: -122.3321 },
  'Portland, OR': { lat: 45.5152, lng: -122.6784 },
  'San Francisco, CA': { lat: 37.7749, lng: -122.4194 },
  'Austin, TX': { lat: 30.2672, lng: -97.7431 },
  'New York, NY': { lat: 40.7128, lng: -74.0060 },
  'Brooklyn, NY': { lat: 40.6782, lng: -73.9442 },
};

/**
 * Normalizes a location string to try and find coordinates.
 */
export const getCoordinates = (location?: string): Coordinates | null => {
  if (!location) return null;
  
  // Direct match
  if (locationLookup[location]) return locationLookup[location];
  
  // Try case-insensitive and partial match
  const search = location.toLowerCase();
  for (const [key, coords] of Object.entries(locationLookup)) {
    if (key.toLowerCase() === search || search.includes(key.toLowerCase()) || key.toLowerCase().includes(search)) {
      return coords;
    }
  }
  
  return null;
};

/**
 * Asynchronously fetches coordinates from Nominatim (OpenStreetMap).
 */
export const fetchCoordinates = async (location: string): Promise<Coordinates | null> => {
  if (!location) return null;

  // Check hardcoded lookup first
  const staticCoords = getCoordinates(location);
  if (staticCoords) return staticCoords;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
      {
        headers: {
          'User-Agent': 'Kith-Genealogy-App'
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
  } catch (error) {
    console.warn('Geocoding warning:', error);
  }

  return null;
};
