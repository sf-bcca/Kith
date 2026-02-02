import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FamilyTreeView from '../FamilyTreeView';

describe('FamilyTreeView', () => {
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
      const mordredNode = mordredName.closest('.group');
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
      expect(onNavigate).toHaveBeenCalledWith('Biography', '7');
    }, { timeout: 2000 });
  });
});