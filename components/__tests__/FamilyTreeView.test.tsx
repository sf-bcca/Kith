import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FamilyTreeView from '../FamilyTreeView';
import { mockFamilyData } from '../../mocks/familyData';

describe('FamilyTreeView', () => {
  it('renders the focus member and their relations', () => {
    // We'll set the default focus to '7' (Merlin) in the implementation
    render(<FamilyTreeView onNavigate={vi.fn()} selectedId="7" onSelect={vi.fn()} />);
    
    // Merlin should be the focus
    expect(screen.getByText(/Merlin Pendragon/)).toBeInTheDocument();
    
    // Merlin's parents (Mordred and Morgana) should be visible
    expect(screen.getByText(/Mordred Pendragon/)).toBeInTheDocument();
    expect(screen.getByText(/Morgana Pendragon/)).toBeInTheDocument();
    
    // Merlin's child (Lancelot) should be visible
    expect(screen.getByText(/Lancelot Pendragon/)).toBeInTheDocument();
  });

  it('changes focus when a relative is clicked', () => {
    const onSelect = vi.fn();
    render(<FamilyTreeView onNavigate={vi.fn()} selectedId="7" onSelect={onSelect} />);
    
    // Click on Mordred Pendragon (the node container, not the name button)
    // We need to click the container div, because the name button has stopPropagation
    const mordredName = screen.getByText(/Mordred Pendragon/);
    const mordredNode = mordredName.closest('.group');
    fireEvent.click(mordredNode!);
    
    // Check if onSelect was called with Mordred's ID
    expect(onSelect).toHaveBeenCalledWith('5');
  });

  it('navigates to the biography when a name is clicked', () => {
    const onNavigate = vi.fn();
    render(<FamilyTreeView onNavigate={onNavigate} selectedId="7" onSelect={vi.fn()} />);
    
    // Click on Merlin's name
    const merlinName = screen.getByText(/Merlin Pendragon/);
    fireEvent.click(merlinName);
    
    expect(onNavigate).toHaveBeenCalledWith('Biography', '7');
  });
});
