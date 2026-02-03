import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationService } from './LocationService';
import { FamilyService } from './FamilyService';
import { mockFamilyData } from '../mocks/familyData';

// Mock FamilyService
vi.mock('./FamilyService', () => ({
  FamilyService: {
    getAll: vi.fn(),
    getById: vi.fn(),
  },
}));

describe('LocationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get all origin points with coordinates', async () => {
    vi.mocked(FamilyService.getAll).mockResolvedValue(mockFamilyData);
    
    const origins = await LocationService.getAllOrigins();
    
    // London, UK is in mock data and our lookup
    expect(origins.length).toBeGreaterThan(0);
    const londonPoint = origins.find(p => p.location === 'London, UK');
    expect(londonPoint).toBeDefined();
    expect(londonPoint?.coords).toEqual({ lat: 51.5074, lng: -0.1278 });
  });

  it('should get migration paths from parents to children', async () => {
    vi.mocked(FamilyService.getAll).mockResolvedValue(mockFamilyData);
    vi.mocked(FamilyService.getById).mockImplementation(id => 
      Promise.resolve(mockFamilyData.find(m => m.id === id) || null)
    );

    const paths = await LocationService.getMigrationPaths();
    
    // Arthur (London) -> Mordred (London) - same place, but still a path
    // Mordred (London) -> Merlin (San Francisco) - different place
    expect(paths.length).toBeGreaterThan(0);
    
    const migrationToSF = paths.find(p => p.to.location === 'San Francisco, CA');
    expect(migrationToSF).toBeDefined();
    expect(migrationToSF?.from.location).toBe('London, UK'); // Mordred's birthplace
  });
});
