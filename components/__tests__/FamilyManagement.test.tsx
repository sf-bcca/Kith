import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import FamilyManagement from '../FamilyManagement';
import { FamilyService } from '../../services/FamilyService';
import React from 'react';

vi.mock('../../services/FamilyService');

describe('FamilyManagement', () => {
  const mockMember = {
    id: '1',
    parents: ['2', '3'],
    spouses: ['4'],
    children: ['5']
  };

  const mockFamilyDetails = [
    { id: '2', firstName: 'Father', lastName: 'Pendragon' },
    { id: '3', firstName: 'Mother', lastName: 'Pendragon' },
    { id: '4', firstName: 'Spouse', lastName: 'Pendragon' },
    { id: '5', firstName: 'Child', lastName: 'Pendragon' }
  ];

  it('should render family memberships', async () => {
    (FamilyService.getById as any).mockImplementation((id: string) => {
      const detail = mockFamilyDetails.find(d => d.id === id);
      return Promise.resolve(detail);
    });

    render(<FamilyManagement member={mockMember as any} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Father Pendragon/i)).toBeDefined();
      expect(screen.getByText(/Mother Pendragon/i)).toBeDefined();
      expect(screen.getByText(/Spouse Pendragon/i)).toBeDefined();
      expect(screen.getByText(/Child Pendragon/i)).toBeDefined();
    });
  });

  it('should show message when no family is found', async () => {
    const aloneMember = { id: '6', parents: [], spouses: [], children: [] };
    render(<FamilyManagement member={aloneMember as any} />);
    
    expect(screen.getByText(/No family associations found/i)).toBeDefined();
  });
});
