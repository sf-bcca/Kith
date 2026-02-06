import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FamilyTreeView from '../FamilyTreeView';
import { TreeService } from '../../services/TreeService';

vi.mock('../../services/TreeService', () => ({
  TreeService: {
    getTreeFor: vi.fn(),
    getSiblingType: vi.fn().mockReturnValue('full'),
  },
}));

describe('FamilyTreeView Visualization', () => {
  const mockTreeBase = {
    focus: { id: '1', firstName: 'Focus', lastName: 'Member' },
    parents: [{ id: '2', firstName: 'Parent', lastName: 'One' }],
    spouses: [],
    children: [],
    siblings: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a horizontal bracket when multiple siblings are present', async () => {
    const treeWithManySiblings = {
      ...mockTreeBase,
      siblings: [
        { id: '3', firstName: 'Sibling', lastName: 'One' },
        { id: '4', firstName: 'Sibling', lastName: 'Two' },
        { id: '5', firstName: 'Sibling', lastName: 'Three' },
      ],
    };
    vi.mocked(TreeService.getTreeFor).mockResolvedValue(treeWithManySiblings as any);

    const { container } = render(<FamilyTreeView onNavigate={vi.fn()} selectedId="1" onSelect={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Sibling One/)).toBeInTheDocument();
    });

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // The test should fail because currently it only renders a vertical line
    // We expect a horizontal line spanning multiple siblings (e.g., M 20% ... L 80%)
    const paths = Array.from(svg!.querySelectorAll('path'));
    const horizontalSiblingPath = paths.find(p => {
      const d = p.getAttribute('d') || '';
      // Look for a horizontal line pattern in the middle generation area
      // For now, we'll just check if there's any horizontal path other than the children one
      return d.includes('L') && !d.includes('M 50%') && !d.includes('460'); 
    });

    expect(horizontalSiblingPath).toBeDefined();
  });
});
