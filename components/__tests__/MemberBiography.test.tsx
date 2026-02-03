import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MemberBiography from '../MemberBiography';
import { FamilyService } from '../../services/FamilyService';

vi.mock('../../services/FamilyService', () => ({
  FamilyService: {
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('MemberBiography', () => {
  const mockMember = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '1980-01-01',
    biography: 'A test bio',
    photoUrl: '',
    role: 'member',
  };

  const mockAdmin = {
    id: 'admin-id',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  };

  const mockUser = {
    id: 'user-id',
    firstName: 'Regular',
    lastName: 'User',
    role: 'member',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders member biography', async () => {
    vi.mocked(FamilyService.getById).mockResolvedValue(mockMember);
    
    render(<MemberBiography onNavigate={vi.fn()} memberId="1" loggedInId="user-id" />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/John Doe/)[0]).toBeInTheDocument();
      expect(screen.getByText(/A test bio/)).toBeInTheDocument();
    });
  });

  it('allows any logged-in user to see the edit button (collaborative)', async () => {
    vi.mocked(FamilyService.getById)
      .mockResolvedValueOnce(mockMember) // target
      .mockResolvedValueOnce(mockUser);   // logged in user details

    render(<MemberBiography onNavigate={vi.fn()} memberId="1" loggedInId="user-id" />);
    
    await waitFor(() => {
      expect(screen.getByText('edit')).toBeInTheDocument();
    });
  });

  it('shows delete button for admins in edit mode', async () => {
    vi.mocked(FamilyService.getById)
      .mockResolvedValueOnce(mockMember)
      .mockResolvedValueOnce(mockAdmin);

    render(<MemberBiography onNavigate={vi.fn()} memberId="1" loggedInId="admin-id" />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('edit'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Delete Member/i)).toBeInTheDocument();
    });
  });

  it('shows delete button for owners in edit mode', async () => {
    vi.mocked(FamilyService.getById)
      .mockResolvedValueOnce(mockMember)
      .mockResolvedValueOnce(mockMember);

    render(<MemberBiography onNavigate={vi.fn()} memberId="1" loggedInId="1" />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('edit'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Delete Member/i)).toBeInTheDocument();
    });
  });

  it('does NOT show delete button for regular members in edit mode', async () => {
    vi.mocked(FamilyService.getById)
      .mockResolvedValueOnce(mockMember)
      .mockResolvedValueOnce(mockUser);

    render(<MemberBiography onNavigate={vi.fn()} memberId="1" loggedInId="user-id" />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('edit'));
    });

    await waitFor(() => {
      expect(screen.queryByText(/Delete Member/i)).not.toBeInTheDocument();
    });
  });

  it('calls delete service when confirmed', async () => {
    vi.mocked(FamilyService.getById)
      .mockResolvedValueOnce(mockMember)
      .mockResolvedValueOnce(mockAdmin);
    
    vi.mocked(FamilyService.delete).mockResolvedValue(undefined);
    
    const confirmSpy = vi.fn(() => true);
    vi.stubGlobal('confirm', confirmSpy);

    const onNavigate = vi.fn();
    render(<MemberBiography onNavigate={onNavigate} memberId="1" loggedInId="admin-id" />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('edit'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Delete Member/i));
    });
    
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(FamilyService.delete).toHaveBeenCalledWith('1');
      expect(onNavigate).toHaveBeenCalledWith('Tree');
    });
    
    vi.unstubAllGlobals();
  });
});