import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FamilyDirectory from '../FamilyDirectory';

describe('FamilyDirectory', () => {
  it('renders a list of family members from the service', async () => {
    render(<FamilyDirectory onNavigate={vi.fn()} />);
    
    // Check for some members from our mock data
    await waitFor(() => {
      expect(screen.getByText('Arthur Pendragon')).toBeInTheDocument();
      expect(screen.getByText('Merlin Pendragon')).toBeInTheDocument();
    });
  });

  it('updates the list when searching', async () => {
    render(<FamilyDirectory onNavigate={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/search family members/i);
    fireEvent.change(input, { target: { value: 'Merlin' } });
    
    await waitFor(() => {
      expect(screen.getByText('Merlin Pendragon')).toBeInTheDocument();
      expect(screen.queryByText('Arthur Pendragon')).not.toBeInTheDocument();
    });
  });

  it('navigates back when clicking the header', () => {
    const onNavigate = vi.fn();
    render(<FamilyDirectory onNavigate={onNavigate} />);
    
    const backButton = screen.getByText('Family Directory');
    fireEvent.click(backButton.parentElement!);
    
    expect(onNavigate).toHaveBeenCalledWith('Discover');
  });
});