import { describe, it, expect } from 'vitest';
import { TreeService } from './TreeService';
import { FamilyMember } from '../types/family';

describe('TreeService Sibling Types', () => {
  const member1: FamilyMember = {
    id: '1',
    firstName: 'One',
    lastName: 'Member',
    gender: 'male',
    parents: ['P1', 'P2'],
    siblings: [{ id: '2', type: 'Step' }],
    children: [],
    spouses: []
  };

  const member2: FamilyMember = {
    id: '2',
    firstName: 'Two',
    lastName: 'Member',
    gender: 'female',
    parents: ['P3', 'P4'],
    siblings: [],
    children: [],
    spouses: []
  };

  it('prioritizes explicit sibling type over derived type', () => {
    // member1 and member2 have different parents, but are explicitly marked as 'Step'
    const type = TreeService.getSiblingType(member1, member2);
    expect(type).toBe('step');
  });

  it('derives "full" when sharing all parents and no explicit link exists', () => {
    const member3: FamilyMember = {
      id: '3',
      firstName: 'Three',
      lastName: 'Member',
      gender: 'male',
      parents: ['P1', 'P2'],
      siblings: [],
      children: [],
      spouses: []
    };
    const type = TreeService.getSiblingType(member1, member3);
    expect(type).toBe('full');
  });

  it('derives "half" when sharing some parents', () => {
    const member4: FamilyMember = {
      id: '4',
      firstName: 'Four',
      lastName: 'Member',
      gender: 'female',
      parents: ['P1', 'P5'],
      siblings: [],
      children: [],
      spouses: []
    };
    const type = TreeService.getSiblingType(member1, member4);
    expect(type).toBe('half');
  });
});
