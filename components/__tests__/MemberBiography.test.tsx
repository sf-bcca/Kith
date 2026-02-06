import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MemberBiography from '../MemberBiography';
import { FamilyService } from '../../services/FamilyService';

vi.mock('../../services/FamilyService', () => ({
  FamilyService: {
    getById: vi.fn(),
    getByIds: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getSiblings: vi.fn(),
  },
}));

describe('MemberBiography', () => {
  const mockMember = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male' as any,
    birthDate: '1980-01-01',
    biography: 'A test bio',
    photoUrl: '',
    role: 'member' as any,
    parents: [],
    spouses: [],
    children: [],
    siblings: [],
  };

  const mockAdmin = {
    id: 'admin-id',
    firstName: 'Admin',
    lastName: 'User',
    gender: 'male' as any,
    role: 'admin' as any,
    parents: [],
    spouses: [],
    children: [],
    siblings: [],
  };

  const mockUser = {
    id: 'user-id',
    firstName: 'Regular',
    lastName: 'User',
    gender: 'male' as any,
    role: 'member' as any,
    parents: [],
    spouses: [],
    children: [],
    siblings: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(FamilyService.getSiblings).mockResolvedValue([]);
    vi.mocked(FamilyService.getByIds).mockResolvedValue([]);
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

  it('shows death fields in edit mode when "Deceased" is toggled', async () => {
    vi.mocked(FamilyService.getById)
      .mockResolvedValueOnce(mockMember)
      .mockResolvedValueOnce(mockUser);

    render(<MemberBiography onNavigate={vi.fn()} memberId="1" loggedInId="user-id" />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('edit'));
    });

    await waitFor(() => {
      const deceasedToggle = screen.getByLabelText(/Deceased/i);
      fireEvent.click(deceasedToggle);
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/Date of Death/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Place of Death/i)).toBeInTheDocument();
    });
  });

  it('shows error if death date is in the future in edit mode', async () => {
    vi.mocked(FamilyService.getById)
      .mockResolvedValueOnce(mockMember)
      .mockResolvedValueOnce(mockUser);

    render(<MemberBiography onNavigate={vi.fn()} memberId="1" loggedInId="user-id" />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('edit'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText(/Deceased/i));
    });

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/Date of Death/i), { target: { value: futureDateStr } });
    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText(/Date of Death cannot be in the future/i)).toBeInTheDocument();
    expect(FamilyService.update).not.toHaveBeenCalled();
  });

  it('shows error if death date is before birth date in edit mode', async () => {
    vi.mocked(FamilyService.getById)
      .mockResolvedValueOnce(mockMember)
      .mockResolvedValueOnce(mockUser);

    render(<MemberBiography onNavigate={vi.fn()} memberId="1" loggedInId="user-id" />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('edit'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText(/Deceased/i));
    });

    fireEvent.change(screen.getByLabelText(/Date of Death/i), { target: { value: '1970-01-01' } });
    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText(/Date of Death must be after Date of Birth/i)).toBeInTheDocument();
    expect(FamilyService.update).not.toHaveBeenCalled();
  });
});