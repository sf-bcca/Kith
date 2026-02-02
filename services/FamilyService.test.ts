import { describe, it, expect } from 'vitest';
import { FamilyService } from './FamilyService';
import { mockFamilyData } from '../mocks/familyData';

describe('FamilyService', () => {
  it('should return all family members', () => {
    const members = FamilyService.getAll();
    expect(members).toHaveLength(mockFamilyData.length);
    expect(members).toEqual(mockFamilyData);
  });

  it('should return a specific family member by ID', () => {
    const targetId = '7';
    const member = FamilyService.getById(targetId);
    expect(member).toBeDefined();
    expect(member?.id).toBe(targetId);
    expect(member?.firstName).toBe('Merlin');
  });

  it('should return undefined for a non-existent ID', () => {
    const member = FamilyService.getById('999');
    expect(member).toBeUndefined();
  });
});
