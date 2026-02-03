import { describe, it, expect } from 'vitest';
import { getCoordinates } from './location';

describe('location utility', () => {
  it('should return coordinates for exact matches', () => {
    const coords = getCoordinates('London, UK');
    expect(coords).toEqual({ lat: 51.5074, lng: -0.1278 });
  });

  it('should return coordinates for case-insensitive matches', () => {
    const coords = getCoordinates('london, uk');
    expect(coords).toEqual({ lat: 51.5074, lng: -0.1278 });
  });

  it('should return coordinates for partial matches', () => {
    const coords = getCoordinates('San Francisco');
    expect(coords).toEqual({ lat: 37.7749, lng: -122.4194 });
  });

  it('should return null for unknown locations', () => {
    const coords = getCoordinates('Mars');
    expect(coords).toBeNull();
  });

  it('should return null for empty/undefined locations', () => {
    expect(getCoordinates('')).toBeNull();
    expect(getCoordinates(undefined)).toBeNull();
  });
});
