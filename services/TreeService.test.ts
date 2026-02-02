import { describe, it, expect } from 'vitest';
import { TreeService } from './TreeService';
import { mockFamilyData } from '../mocks/familyData';

describe('TreeService', () => {
  it('should get focus member, parents, and children for Merlin (ID: 7)', () => {
    const treeData = TreeService.getTreeFor('7');
    
    expect(treeData.focus.firstName).toBe('Merlin');
    
    // Parents of Merlin (7) are Mordred (5) and Morgana (6)
    expect(treeData.parents).toHaveLength(2);
    expect(treeData.parents.map(p => p.id)).toContain('5');
    expect(treeData.parents.map(p => p.id)).toContain('6');
    
    // Spouses of Merlin (7) is Vivian (9)
    expect(treeData.spouses).toHaveLength(1);
    expect(treeData.spouses[0].id).toBe('9');
    
    // Children of Merlin (7) is Lancelot (10)
    expect(treeData.children).toHaveLength(1);
    expect(treeData.children[0].id).toBe('10');
  });

  it('should return undefined focus if ID is not found', () => {
    // @ts-ignore
    const treeData = TreeService.getTreeFor('999');
    expect(treeData).toBeUndefined();
  });
});
