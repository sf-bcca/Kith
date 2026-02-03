import { describe, it, expect } from 'vitest';
import { FamilyMember } from '../../types/family';

describe('FamilyMember Siblings Data Model', () => {
  it('should support siblings array in FamilyMember type', () => {
    const memberWithSiblings: FamilyMember = {
      id: 'member-1',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      birthDate: '1990-01-01',
      parents: ['parent-1', 'parent-2'],
      spouses: [],
      children: [],
      siblings: ['sibling-1', 'sibling-2'],
    };

    expect(memberWithSiblings.siblings).toHaveLength(2);
    expect(memberWithSiblings.siblings).toContain('sibling-1');
    expect(memberWithSiblings.siblings).toContain('sibling-2');
  });

  it('should support empty siblings array', () => {
    const memberWithoutSiblings: FamilyMember = {
      id: 'member-2',
      firstName: 'Jane',
      lastName: 'Doe',
      gender: 'female',
      birthDate: '1992-05-15',
      parents: [],
      spouses: [],
      children: [],
      siblings: [],
    };

    expect(memberWithoutSiblings.siblings).toHaveLength(0);
  });

  it('should support siblings with other relationships', () => {
    const complexMember: FamilyMember = {
      id: 'member-3',
      firstName: 'Bob',
      lastName: 'Smith',
      gender: 'male',
      birthDate: '1985-03-20',
      birthPlace: 'New York',
      parents: ['father-id', 'mother-id'],
      spouses: ['spouse-id'],
      children: ['child-id-1', 'child-id-2'],
      siblings: ['sibling-a', 'sibling-b', 'sibling-c'],
    };

    expect(complexMember.parents).toHaveLength(2);
    expect(complexMember.spouses).toHaveLength(1);
    expect(complexMember.children).toHaveLength(2);
    expect(complexMember.siblings).toHaveLength(3);
  });
});
