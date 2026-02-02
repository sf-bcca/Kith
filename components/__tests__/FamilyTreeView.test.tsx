import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FamilyTreeView from '../FamilyTreeView';
import { mockFamilyData } from '../../mocks/familyData';

describe('FamilyTreeView', () => {
  it('renders the focus member and their relations', () => {
    // We'll set the default focus to '7' (Merlin) in the implementation
    render(<FamilyTreeView onNavigate={vi.fn()} />);
    
    // Merlin should be the focus
    expect(screen.getByText('Merlin Pendragon')).toBeInTheDocument();
    
    // Merlin's parents (Mordred and Morgana) should be visible
    expect(screen.getByText('Mordred Pendragon')).toBeInTheDocument();
    expect(screen.getByText('Morgana Pendragon')).toBeInTheDocument();
    
    // Merlin's child (Lancelot) should be visible
    expect(screen.getByText('Lancelot Pendragon')).toBeInTheDocument();
  });

  it('changes focus when a relative is clicked', () => {
    render(<FamilyTreeView onNavigate={vi.fn()} />);
    
    // Click on Mordred Pendragon
    const mordredNode = screen.getByText('Mordred Pendragon');
    fireEvent.click(mordredNode);
    
    // Now Mordred should be the focus (larger size, or just confirmed via presence of his relations)
    // When Mordred is focus, his parents (Arthur and Guinevere) should appear
    expect(screen.getByText('Arthur Pendragon')).toBeInTheDocument();
    expect(screen.getByText('Guinevere Pendragon')).toBeInTheDocument();
  });
});
