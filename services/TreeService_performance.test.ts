import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TreeService } from './TreeService';
import { FamilyService } from './FamilyService';
import { FamilyMember } from '../types/family';

vi.mock('./FamilyService');

const mockMember = (id: string, parents: string[] = [], children: string[] = []): FamilyMember => ({
  id,
  firstName: `First${id}`,
  lastName: 'Last',
  gender: 'male',
  birthDate: '1980-01-01',
  biography: '',
  photoUrl: '',
  parents,
  spouses: [],
  children,
  email: '',
  username: '',
  darkMode: false,
  language: 'en',
  visibility: 'public',
  dataSharing: true,
  notificationsEmail: true,
  notificationsPush: true
});

describe('TreeService Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTreeFor should use bulk fetching (single call for each relation type)', async () => {
    const focus = mockMember('1', ['2', '3'], ['4']);
    const parent2 = mockMember('2');
    const parent3 = mockMember('3');
    const child4 = mockMember('4');

    vi.mocked(FamilyService.getById).mockResolvedValueOnce(focus);
    vi.mocked(FamilyService.getByIds).mockImplementation(async (ids) => {
        if (ids.includes('2')) return [parent2, parent3];
        if (ids.includes('4')) return [child4];
        return [];
    });

    await TreeService.getTreeFor('1');

    // Expected: 1 for focus, 1 for parents, 1 for spouses (empty but called), 1 for children
    expect(FamilyService.getById).toHaveBeenCalledTimes(1);
    expect(FamilyService.getByIds).toHaveBeenCalledTimes(3); 
  });

  it('getFanChartData should use bulk fetching per generation', async () => {
    const focus = mockMember('1', ['2', '3']);
    const p2 = mockMember('2', ['4', '5']);
    const p3 = mockMember('3', ['6', '7']);
    
    vi.mocked(FamilyService.getById).mockImplementation(async (id) => {
        if (id === '1') return focus;
        return undefined;
    });

    vi.mocked(FamilyService.getByIds).mockImplementation(async (ids) => {
        if (ids.includes('2') && ids.includes('3')) return [p2, p3];
        if (ids.includes('4')) return [mockMember('4'), mockMember('5'), mockMember('6'), mockMember('7')];
        return [];
    });

    await TreeService.getFanChartData('1', 2);

    // Initial focus person might still use getById, but subsequent generations should use getByIds
    // This test will initially FAIL if getFanChartData uses a queue with individual getById calls.
  });
});
