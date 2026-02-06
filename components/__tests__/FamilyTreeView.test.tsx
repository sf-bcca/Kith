import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FamilyTreeView from '../FamilyTreeView';
import { TreeService } from '../../services/TreeService';

vi.mock('../../services/TreeService', () => ({
  TreeService: {
    getTreeFor: vi.fn(),
    getSiblingType: vi.fn().mockReturnValue('full'),
  },
}));

describe('FamilyTreeView', () => {
  const mockTree = {
    focus: { id: '7', firstName: 'Merlin', lastName: 'Pendragon', birthDate: '463-01-01' },
    parents: [
      { id: '5', firstName: 'Mordred', lastName: 'Pendragon', birthDate: '440-01-01' },
      { id: '6', firstName: 'Morgana', lastName: 'Pendragon', birthDate: '442-01-01' },
    ],
    spouses: [],
    children: [
      { id: '8', firstName: 'Lancelot', lastName: 'Pendragon', birthDate: '485-01-01' },
    ],
    siblings: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(TreeService.getTreeFor).mockResolvedValue(mockTree as any);
  });

  it('renders the focus member and their relations', async () => {
    render(<FamilyTreeView onNavigate={vi.fn()} selectedId="7" onSelect={vi.fn()} />);
    
    await waitFor(() => {
      // Merlin should be the focus
      expect(screen.getByText(/Merlin Pendragon/)).toBeInTheDocument();
      
      // Merlin's parents (Mordred and Morgana) should be visible
      expect(screen.getByText(/Mordred Pendragon/)).toBeInTheDocument();
      expect(screen.getByText(/Morgana Pendragon/)).toBeInTheDocument();
      
      // Merlin's child (Lancelot) should be visible
      expect(screen.getByText(/Lancelot Pendragon/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('changes focus when a relative is clicked', async () => {
    const onSelect = vi.fn();
    render(<FamilyTreeView onNavigate={vi.fn()} selectedId="7" onSelect={onSelect} />);
    
    await waitFor(() => {
      const mordredName = screen.getByText(/Mordred Pendragon/);
      // The clickable area is the avatar div which has 'cursor-pointer'
      const mordredNode = mordredName.closest('.group')?.querySelector('.cursor-pointer');
      fireEvent.click(mordredNode!);
      expect(onSelect).toHaveBeenCalledWith('5');
    }, { timeout: 2000 });
  });

  it('navigates to the biography when a name is clicked', async () => {
    const onNavigate = vi.fn();
    render(<FamilyTreeView onNavigate={onNavigate} selectedId="7" onSelect={vi.fn()} />);
    
    await waitFor(() => {
      const merlinName = screen.getByText(/Merlin Pendragon/);
      fireEvent.click(merlinName);
      expect(onNavigate).toHaveBeenCalledWith('Biography', '7', expect.any(Object));
    }, { timeout: 2000 });
  });

  it('renders siblings when present in tree data', async () => {
    const treeWithSiblings = {
      ...mockTree,
      siblings: [
        { id: '10', firstName: 'Arthur', lastName: 'Pendragon', birthDate: '465-01-01', parents: ['5', '6'] },
      ],
    };
    vi.mocked(TreeService.getTreeFor).mockResolvedValue(treeWithSiblings as any);
    
    render(<FamilyTreeView onNavigate={vi.fn()} selectedId="7" onSelect={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Arthur Pendragon/)).toBeInTheDocument();
      // Check for sibling visual indicator (badge)
      const siblingBadge = screen.getByText('family_restroom');
      expect(siblingBadge).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});