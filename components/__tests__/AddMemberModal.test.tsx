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
});
