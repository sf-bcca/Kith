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

  describe('search', () => {
    it('should find members by first name (case-insensitive)', () => {
      const results = FamilyService.search('merlin');
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Merlin');
    });

    it('should find members by last name (case-insensitive)', () => {
      const results = FamilyService.search('lake');
      expect(results).toHaveLength(1);
      expect(results[0].lastName).toBe('Lake');
    });

    it('should find members by partial name', () => {
      const results = FamilyService.search('Pen');
      // Pendragon family has Arthur, Guinevere, Mordred, Morgana, Merlin, Nimue, Lancelot
      // 7 members have lastName 'Pendragon'
      expect(results.length).toBeGreaterThanOrEqual(7);
      results.forEach(m => {
        expect(m.lastName.toLowerCase()).toContain('pen');
      });
    });

    it('should find members by full name', () => {
      const results = FamilyService.search('Arthur Pendragon');
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Arthur');
    });

    it('should return empty array when no matches found', () => {
      const results = FamilyService.search('NonExistentName');
      expect(results).toHaveLength(0);
    });

    it('should return all members for an empty query', () => {
      const results = FamilyService.search('');
      expect(results).toHaveLength(mockFamilyData.length);
    });
  });
});
