import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FamilyTreeView from '../FamilyTreeView';
import { mockFamilyData } from '../../mocks/familyData';

describe('FamilyTreeView', () => {
  it('renders the focus member and their relations', () => {
    // We'll set the default focus to '7' (Merlin) in the implementation
    render(<FamilyTreeView onNavigate={vi.fn()} />);
    
    // Merlin should be the focus
    expect(screen.getByText(/Merlin Pendragon/)).toBeInTheDocument();
    
    // Merlin's parents (Mordred and Morgana) should be visible
    expect(screen.getByText(/Mordred Pendragon/)).toBeInTheDocument();
    expect(screen.getByText(/Morgana Pendragon/)).toBeInTheDocument();
    
    // Merlin's child (Lancelot) should be visible
    expect(screen.getByText(/Lancelot Pendragon/)).toBeInTheDocument();
  });

  it('changes focus when a relative is clicked', () => {
    render(<FamilyTreeView onNavigate={vi.fn()} />);
    
    // Click on Mordred Pendragon (the node container, not the name)
    // We'll find it by the text and then get the parent div that has the onClick focus handler
    const mordredName = screen.getByText(/Mordred Pendragon/);
    const mordredNode = mordredName.closest('.cursor-pointer');
    fireEvent.click(mordredNode!);
    
    // Now Mordred should be the focus
    expect(screen.getByText(/Arthur Pendragon/)).toBeInTheDocument();
    expect(screen.getByText(/Guinevere Pendragon/)).toBeInTheDocument();
  });

  it('navigates to the biography when a name is clicked', () => {
    const onNavigate = vi.fn();
    render(<FamilyTreeView onNavigate={onNavigate} />);
    
    // Click on Merlin's name
    const merlinName = screen.getByText(/Merlin Pendragon/);
    fireEvent.click(merlinName);
    
    expect(onNavigate).toHaveBeenCalledWith('Biography', '7');
  });
});
