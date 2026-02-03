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
  const testMembers = [
    { id: '1', firstName: 'Arthur', lastName: 'Pendragon', birthPlace: 'London, UK', parents: [] },
    { id: '2', firstName: 'Mordred', lastName: 'Pendragon', birthPlace: 'San Francisco, CA', parents: ['1'] },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should get all origin points with coordinates', async () => {
    vi.mocked(FamilyService.getAll).mockResolvedValue(testMembers as any);
    
    const origins = await LocationService.getAllOrigins();
    
    expect(origins.length).toBe(2);
    const londonPoint = origins.find(p => p.location === 'London, UK');
    expect(londonPoint).toBeDefined();
    expect(londonPoint?.coords).toEqual({ lat: 51.5074, lng: -0.1278 });
  });

  it('should get migration paths from parents to children', async () => {
    vi.mocked(FamilyService.getAll).mockResolvedValue(testMembers as any);
    vi.mocked(FamilyService.getById).mockImplementation(id => 
      Promise.resolve(testMembers.find(m => m.id === id) || null) as any
    );

    const paths = await LocationService.getMigrationPaths();
    
    expect(paths.length).toBe(1);
    
    const migration = paths[0];
    expect(migration.from.location).toBe('London, UK');
    expect(migration.to.location).toBe('San Francisco, CA');
    expect(migration.memberId).toBe('2');
  });
});
