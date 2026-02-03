import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import HorizontalTree from '../HorizontalTree';
import { TreeService } from '../../services/TreeService';
import React from 'react';

vi.mock('../../services/TreeService');

const mockMember = (id: string, firstName: string, parents: string[] = [], children: string[] = []) => ({
  id,
  firstName,
  lastName: 'Doe',
  gender: 'male' as const,
  birthDate: '1980-01-01',
  parents,
  children,
  spouses: [],
  biography: '',
  photoUrl: ''
});

describe('HorizontalTree Layout', () => {
  it('renders ancestor view correctly', async () => {
    const focus = mockMember('1', 'Focus', ['2', '3']);
    const father = { ...mockMember('2', 'Father', ['4', '5']), gender: 'male' as const };
    const mother = { ...mockMember('3', 'Mother'), gender: 'female' as const };
    
    vi.mocked(TreeService.getAncestors).mockResolvedValue({
      focusPerson: focus,
      parents: [father, mother],
      grandparents: [mockMember('4', 'GF'), mockMember('5', 'GM')],
      greatGrandparents: []
    } as any);

    render(<HorizontalTree selectedId="1" onSelect={() => {}} onNavigate={() => {}} />);
    
    expect(await screen.findByText('Focus Doe')).toBeInTheDocument();
    expect(await screen.findByText('Father Doe')).toBeInTheDocument();
    expect(await screen.findByText('Mother Doe')).toBeInTheDocument();
  });

  it('renders descendant view correctly', async () => {
    const focus = mockMember('1', 'Focus', [], ['2']);
    const child = mockMember('2', 'Child');

    vi.mocked(TreeService.getAncestors).mockResolvedValue({
        focusPerson: focus,
        parents: [],
        grandparents: [],
        greatGrandparents: []
      } as any);

    vi.mocked(TreeService.getDescendants).mockResolvedValue({
      focusPerson: focus,
      children: [child],
      grandchildren: [],
      greatGrandchildren: []
    } as any);

    render(<HorizontalTree selectedId="1" onSelect={() => {}} onNavigate={() => {}} />);
    
    // Wait for initial load
    await screen.findByText('Focus Doe');

    // Switch to descendants
    const descButton = screen.getByText('Descendants');
    await act(async () => {
        fireEvent.click(descButton);
    });

    expect(await screen.findByText('Child Doe')).toBeInTheDocument();
  });
});
