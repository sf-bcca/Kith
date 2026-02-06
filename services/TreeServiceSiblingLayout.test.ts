import { describe, it, expect } from 'vitest';
import { TreeService } from './TreeService';
import { FamilyMember } from '../../types/family';

describe('TreeService Sibling Layout', () => {
  const createMember = (id: string, parentIds: string[]): FamilyMember => ({
    id,
    firstName: `Member${id}`,
    lastName: 'Test',
    gender: id.includes('f') ? 'female' : 'male',
    parents: parentIds,
    spouses: [],
    children: [],
    siblings: [],
  });

  it('should identify full siblings (share both parents)', () => {
    const member1 = createMember('1', ['parentA', 'parentB']);
    const member2 = createMember('2', ['parentA', 'parentB']);

    expect(TreeService.getSiblingType(member1, member2)).toBe('full');
  });

  it('should identify half siblings (share one parent)', () => {
    const member1 = createMember('1', ['parentA', 'parentB']);
    const member2 = createMember('2', ['parentA', 'parentC']);

    expect(TreeService.getSiblingType(member1, member2)).toBe('half');
  });

  it('should return undefined for non-siblings', () => {
    const member1 = createMember('1', ['parentA', 'parentB']);
    const member2 = createMember('2', ['parentC', 'parentD']);

    expect(TreeService.getSiblingType(member1, member2)).toBeUndefined();
  });

  it('should return undefined when parents unknown', () => {
    const member1 = createMember('1', []);
    const member2 = createMember('2', ['parentA']);

    expect(TreeService.getSiblingType(member1, member2)).toBeUndefined();
  });

  it('should group siblings by shared parents', () => {
    const members = [
      createMember('1', ['p1', 'p2']),
      createMember('2', ['p1', 'p2']),
      createMember('3', ['p1', 'p3']),
      createMember('4', ['p5', 'p6']),
    ];

    const groups = TreeService.groupSiblingsByParents(members);

    // Members 1, 2, and 3 are all siblings (full or half)
    expect(groups.length).toBe(1);
    expect(groups[0]).toHaveLength(3);
    expect(groups[0].map(m => m.id)).toContain('1');
    expect(groups[0].map(m => m.id)).toContain('2');
    expect(groups[0].map(m => m.id)).toContain('3');
  });

  it('should handle empty member list', () => {
    const groups = TreeService.groupSiblingsByParents([]);
    expect(groups).toEqual([]);
  });

  it('should handle single member', () => {
    const members = [createMember('1', ['p1', 'p2'])];
    const groups = TreeService.groupSiblingsByParents(members);
    expect(groups).toEqual([]);
  });
});
