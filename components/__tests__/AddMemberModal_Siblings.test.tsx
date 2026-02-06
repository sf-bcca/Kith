import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddMemberModal from '../AddMemberModal';
import { FamilyService } from '../../services/FamilyService';

// Mock FamilyService
vi.mock('../../services/FamilyService', () => ({
  FamilyService: {
    create: vi.fn(),
    search: vi.fn(),
    getById: vi.fn(),
  },
}));

describe('AddMemberModal Sibling Persistence', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (FamilyService.create as any).mockResolvedValue({ id: 'new-id', firstName: 'John', lastName: 'Doe' });
  });

  it('should persist new sibling placeholders and relationship types', async () => {
    render(
      <AddMemberModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Fill in basic details
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: '1980-01-01' } });

    // Open sibling wizard
    fireEvent.click(screen.getByRole('button', { name: /Add Siblings/i }));

    // Add a placeholder sibling
    fireEvent.change(screen.getByPlaceholderText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText(/Last name/i), { target: { value: 'Doe' } });
    
    // Select "Half Sibling"
    fireEvent.click(screen.getByText(/Half Sibling/i));
    
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));

    // Save siblings
    fireEvent.click(screen.getByRole('button', { name: /Save Siblings/i }));

    // Submit the modal
    fireEvent.click(screen.getByRole('button', { name: /Add Member/i }));

    await waitFor(() => {
      expect(FamilyService.create).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'John',
        siblings: expect.arrayContaining([
          expect.objectContaining({
            firstName: 'Jane',
            lastName: 'Doe',
            siblingType: 'half',
            isNew: true
          })
        ])
      }));
    });
  });

  it('should persist existing siblings with their relationship types', async () => {
    (FamilyService.search as any).mockResolvedValue([
      { id: '2', firstName: 'Bob', lastName: 'Doe', birthDate: '1982-05-10' }
    ]);

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

    fireEvent.click(screen.getByRole('button', { name: /Add Siblings/i }));

    // Search and add existing
    fireEvent.change(screen.getByPlaceholderText(/Search by name/i), { target: { value: 'Bob' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Bob Doe/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Full Sibling/i)); // Ensure type is selected
    fireEvent.click(screen.getByText(/Bob Doe/i));

    fireEvent.click(screen.getByRole('button', { name: /Save Siblings/i }));
    fireEvent.click(screen.getByRole('button', { name: /Add Member/i }));

    await waitFor(() => {
      expect(FamilyService.create).toHaveBeenCalledWith(expect.objectContaining({
        siblings: expect.arrayContaining([
          expect.objectContaining({
            id: '2',
            siblingType: 'full',
            isNew: false
          })
        ])
      }));
    });
  });
});
