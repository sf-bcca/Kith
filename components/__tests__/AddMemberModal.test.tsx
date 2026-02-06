import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddMemberModal from '../AddMemberModal';
import { FamilyService } from '../../services/FamilyService';

// Mock FamilyService
vi.mock('../../services/FamilyService', () => ({
  FamilyService: {
    create: vi.fn(),
    search: vi.fn(),
    linkMembers: vi.fn(),
  },
}));

describe('AddMemberModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not show death fields by default', () => {
    render(
      <AddMemberModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByLabelText(/Date of Death/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Place of Death/i)).not.toBeInTheDocument();
  });

  it('should show death fields when "Deceased" is checked', () => {
    render(
      <AddMemberModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const deceasedCheckbox = screen.getByLabelText(/Deceased/i);
    fireEvent.click(deceasedCheckbox);

    expect(screen.getByLabelText(/Date of Death/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Place of Death/i)).toBeInTheDocument();
  });

  it('should hide death fields when "Deceased" is unchecked', () => {
    render(
      <AddMemberModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const deceasedCheckbox = screen.getByLabelText(/Deceased/i);
    
    // Check it
    fireEvent.click(deceasedCheckbox);
    expect(screen.getByLabelText(/Date of Death/i)).toBeInTheDocument();

    // Uncheck it
    fireEvent.click(deceasedCheckbox);
    expect(screen.queryByLabelText(/Date of Death/i)).not.toBeInTheDocument();
  });

  it('shows error if death date is in the future', async () => {
    render(
      <AddMemberModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: '1980-01-01' } });
    
    fireEvent.click(screen.getByLabelText(/Deceased/i));
    
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText(/Date of Death/i), { target: { value: futureDateStr } });
    
    fireEvent.click(screen.getByRole('button', { name: /Add Member/i }));

    expect(await screen.findByText(/Death date cannot be in the future/i)).toBeInTheDocument();
    expect(FamilyService.create).not.toHaveBeenCalled();
  });

  it('shows error if death date is before birth date', async () => {
    render(
      <AddMemberModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: '1980-01-01' } });
    
    fireEvent.click(screen.getByLabelText(/Deceased/i));
    fireEvent.change(screen.getByLabelText(/Date of Death/i), { target: { value: '1970-01-01' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Add Member/i }));

    expect(await screen.findByText(/Death date cannot be before birth date/i)).toBeInTheDocument();
    expect(FamilyService.create).not.toHaveBeenCalled();
  });
});
