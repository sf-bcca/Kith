import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsView from '../SettingsView';
import { FamilyService } from '../../services/FamilyService';

// Mock FamilyService
vi.mock('../../services/FamilyService', () => ({
  FamilyService: {
    getById: vi.fn(),
    delete: vi.fn()
  }
}));

describe('SettingsView', () => {
  const mockMember = {
    id: 'user-123',
    firstName: 'Test',
    lastName: 'User',
    biography: 'This is a test bio',
    photoUrl: 'http://example.com/photo.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (FamilyService.getById as any).mockResolvedValue(mockMember);
  });

  it('renders correctly with user data', async () => {
    render(<SettingsView onNavigate={vi.fn()} onLogout={vi.fn()} loggedInId="user-123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('This is a test bio...')).toBeInTheDocument();
    });
    
    const img = screen.getByAltText('Profile');
    expect(img).toHaveAttribute('src', mockMember.photoUrl);
  });

  it('shows guest state when no member is found', async () => {
    (FamilyService.getById as any).mockResolvedValue(null);
    render(<SettingsView onNavigate={vi.fn()} onLogout={vi.fn()} loggedInId="unknown" />);
    
    await waitFor(() => {
      expect(screen.getByText('Guest User')).toBeInTheDocument();
    });
  });
});
