import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FamilyDirectory from '../FamilyDirectory';
import { FamilyService } from '../../services/FamilyService';

vi.mock('../../services/FamilyService', () => ({
  FamilyService: {
    search: vi.fn(),
  },
}));

describe('FamilyDirectory', () => {
  const mockMembers = [
    { id: '1', firstName: 'Arthur', lastName: 'Pendragon', birthDate: '1900-01-01' },
    { id: '2', firstName: 'Merlin', lastName: 'Pendragon', birthDate: '1950-01-01' },
  ];

  it('renders a list of family members from the service', async () => {
    vi.mocked(FamilyService.search).mockResolvedValue(mockMembers as any);
    render(<FamilyDirectory onNavigate={vi.fn()} />);
    
    // Check for some members from our mock data
    await waitFor(() => {
      expect(screen.getByText('Arthur Pendragon')).toBeInTheDocument();
      expect(screen.getByText('Merlin Pendragon')).toBeInTheDocument();
    });
  });

  it('updates the list when searching', async () => {
    vi.mocked(FamilyService.search).mockResolvedValueOnce(mockMembers as any); // initial
    vi.mocked(FamilyService.search).mockResolvedValueOnce([mockMembers[1]] as any); // search result

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