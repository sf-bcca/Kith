import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TreeService } from './TreeService';
import { FamilyService } from './FamilyService';
import { mockFamilyData } from '../mocks/familyData';

// Mock FamilyService
vi.mock('./FamilyService', () => ({
  FamilyService: {
    getById: vi.fn(),
    getByIds: vi.fn(),
    getSiblings: vi.fn()
  }
}));

describe('TreeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get focus member, parents, and children for Arthur (ID: 1)', async () => {
    // Mock Arthur
    const arthur = mockFamilyData.find(m => m.id === '1');
    (FamilyService.getById as any).mockImplementation((id: string) => {
      return Promise.resolve(mockFamilyData.find(m => m.id === id));
    });
    (FamilyService.getByIds as any).mockImplementation((ids: string[]) => {
      return Promise.resolve(mockFamilyData.filter(m => ids.includes(m.id)));
    });
    (FamilyService.getSiblings as any).mockResolvedValue([]);

    const treeData = await TreeService.getTreeFor('1');
    
    expect(treeData?.focus.firstName).toBe('Arthur');
    
    // Parents of Arthur (1) are Uther (4) and Igraine (5)
    expect(treeData?.parents).toHaveLength(2);
    expect(treeData?.parents.map(p => p.id)).toContain('4');
    expect(treeData?.parents.map(p => p.id)).toContain('5');
  });

  it('should return undefined focus if ID is not found', async () => {
    (FamilyService.getById as any).mockResolvedValue(undefined);
    const treeData = await TreeService.getTreeFor('999');
    expect(treeData).toBeUndefined();
  });
});