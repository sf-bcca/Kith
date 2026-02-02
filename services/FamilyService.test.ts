import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FamilyService } from './FamilyService';
import { mockFamilyData } from '../mocks/familyData';

// Mock fetch
global.fetch = vi.fn();

describe('FamilyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockFamilyData.map(m => ({
        id: m.id,
        first_name: m.firstName,
        last_name: m.lastName,
        gender: m.gender,
        birth_date: m.birthDate,
        death_date: m.deathDate,
        bio: m.biography,
        profile_image: m.photoUrl,
        relationships: {
          parents: m.parents,
          spouses: m.spouses,
          children: m.children
        }
      })))
    });
  });

  it('should return all family members', async () => {
    const members = await FamilyService.getAll();
    expect(members).toHaveLength(mockFamilyData.length);
    expect(members[0].firstName).toBe(mockFamilyData[0].firstName);
  });

  it('should return a specific family member by ID', async () => {
    const targetId = '7';
    const targetMember = mockFamilyData.find(m => m.id === targetId);
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: targetMember?.id,
        first_name: targetMember?.firstName,
        last_name: targetMember?.lastName,
        gender: targetMember?.gender,
        birth_date: targetMember?.birthDate
      })
    });

    const member = await FamilyService.getById(targetId);
    expect(member).toBeDefined();
    expect(member?.id).toBe(targetId);
    expect(member?.firstName).toBe('Merlin');
  });

  it('should return undefined for a non-existent ID', async () => {
    (fetch as any).mockResolvedValueOnce({
      status: 404,
      ok: false
    });
    const member = await FamilyService.getById('999');
    expect(member).toBeUndefined();
  });

  describe('search', () => {
    it('should find members by first name (case-insensitive)', async () => {
      const results = await FamilyService.search('merlin');
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Merlin');
    });

    it('should find members by last name (case-insensitive)', async () => {
      const results = await FamilyService.search('lake');
      expect(results).toHaveLength(1);
      expect(results[0].lastName).toBe('Lake');
    });

    it('should find members by partial name', async () => {
      const results = await FamilyService.search('Pen');
      expect(results.length).toBeGreaterThanOrEqual(7);
    });
  });

  describe('filter', () => {
    it('should filter by gender', async () => {
      const results = await FamilyService.filter({ gender: 'male' });
      expect(results.length).toBeGreaterThan(0);
      results.forEach(m => expect(m.gender).toBe('male'));
    });

    it('should filter by last name', async () => {
      const results = await FamilyService.filter({ lastName: 'Lake' });
      expect(results).toHaveLength(1);
      expect(results[0].lastName).toBe('Lake');
    });
  });
});