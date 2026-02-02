import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TreeService } from './TreeService';
import { FamilyService } from './FamilyService';
import { mockFamilyData } from '../mocks/familyData';

// Mock FamilyService
vi.mock('./FamilyService', () => ({
  FamilyService: {
    getById: vi.fn()
  }
}));

describe('TreeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get focus member, parents, and children for Merlin (ID: 7)', async () => {
    // Mock Merlin
    const merlin = mockFamilyData.find(m => m.id === '7');
    (FamilyService.getById as any).mockImplementation((id: string) => {
      return Promise.resolve(mockFamilyData.find(m => m.id === id));
    });

    const treeData = await TreeService.getTreeFor('7');
    
    expect(treeData?.focus.firstName).toBe('Merlin');
    
    // Parents of Merlin (7) are Mordred (5) and Morgana (6)
    expect(treeData?.parents).toHaveLength(2);
    expect(treeData?.parents.map(p => p.id)).toContain('5');
    expect(treeData?.parents.map(p => p.id)).toContain('6');
  });

  it('should return undefined focus if ID is not found', async () => {
    (FamilyService.getById as any).mockResolvedValue(undefined);
    const treeData = await TreeService.getTreeFor('999');
    expect(treeData).toBeUndefined();
  });
});