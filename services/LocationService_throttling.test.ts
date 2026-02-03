import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationService } from './LocationService';
import { FamilyService } from './FamilyService';
import * as locationUtils from '../src/utils/location';

vi.mock('./FamilyService');
vi.mock('../src/utils/location');

describe('LocationService Caching & Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Fast-forward timers for the rate limit delay
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should cache geocoding results in localStorage', async () => {
    const mockMembers = [
      { id: '1', firstName: 'John', lastName: 'Doe', birthPlace: 'London', parents: [] },
      { id: '2', firstName: 'Jane', lastName: 'Doe', birthPlace: 'London', parents: [] }
    ];
    vi.mocked(FamilyService.getAll).mockResolvedValue(mockMembers as any);
    
    vi.mocked(locationUtils.fetchCoordinates).mockResolvedValueOnce({ lat: 51.5, lng: -0.1 });

    const promise = LocationService.getAllOrigins();
    
    // Resolve the first delay
    await vi.runAllTimersAsync();
    
    const result = await promise;
    
    expect(result).toHaveLength(2);
    expect(locationUtils.fetchCoordinates).toHaveBeenCalledTimes(1); // Second one should be cached
    expect(localStorage.getItem('kith_geo_cache')).toContain('London');
  });
});
