import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FamilyDirectory from '../FamilyDirectory';

// Mock FamilyService if necessary, but we can use real mock data for integration
describe('FamilyDirectory', () => {
  it('renders a list of family members from the service', () => {
    render(<FamilyDirectory onNavigate={vi.fn()} />);
    
    // Check for some members from our mock data
    expect(screen.getByText('Arthur Pendragon')).toBeInTheDocument();
    expect(screen.getByText('Merlin Pendragon')).toBeInTheDocument();
  });

  it('updates the list when searching', () => {
    render(<FamilyDirectory onNavigate={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/search family members/i);
    fireEvent.change(input, { target: { value: 'Merlin' } });
    
    expect(screen.getByText('Merlin Pendragon')).toBeInTheDocument();
    expect(screen.queryByText('Arthur Pendragon')).not.toBeInTheDocument();
  });

  it('navigates back when clicking the header', () => {
    const onNavigate = vi.fn();
    render(<FamilyDirectory onNavigate={onNavigate} />);
    
    const backButton = screen.getByText('Family Directory').parentElement;
    fireEvent.click(backButton!);
    
    expect(onNavigate).toHaveBeenCalledWith('Discover');
  });
});
