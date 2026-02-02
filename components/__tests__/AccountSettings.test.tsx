import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountSettings from '../AccountSettings';
import { FamilyService } from '../../services/FamilyService';
import React from 'react';

// Mock the FamilyService
vi.mock('../../services/FamilyService');

describe('AccountSettings', () => {
  const mockMember = {
    id: '1',
    firstName: 'Arthur',
    lastName: 'Pendragon',
    email: 'arthur@camelot.com',
    username: 'king_arthur'
  };

  it('should render the account settings form', () => {
    render(<AccountSettings member={mockMember as any} onUpdate={vi.fn()} />);
    
    expect(screen.getByLabelText(/Email/i)).toHaveValue('arthur@camelot.com');
    expect(screen.getByLabelText(/Username/i)).toHaveValue('king_arthur');
  });

  it('should call onUpdate when the form is submitted', async () => {
    const onUpdate = vi.fn();
    (FamilyService.updateSettings as any).mockResolvedValue({ ...mockMember, email: 'new@camelot.com' });

    render(<AccountSettings member={mockMember as any} onUpdate={onUpdate} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'new@camelot.com' } });
    
    const saveButton = screen.getByText(/Save Changes/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(FamilyService.updateSettings).toHaveBeenCalledWith('1', expect.objectContaining({
        email: 'new@camelot.com'
      }));
      expect(onUpdate).toHaveBeenCalled();
    });
  });

  it('should show error when password update fails', async () => {
    (FamilyService.updateSettings as any).mockRejectedValue(new Error('Invalid current password'));

    render(<AccountSettings member={mockMember as any} onUpdate={vi.fn()} />);
    
    // Toggle password change section
    const changePasswordBtn = screen.getByText(/Change Password/i);
    fireEvent.click(changePasswordBtn);

    const currentPasswordInput = screen.getByLabelText(/^Current Password/i);
    fireEvent.change(currentPasswordInput, { target: { value: 'wrong' } });
    
    const newPasswordInput = screen.getByLabelText(/^New Password/i);
    fireEvent.change(newPasswordInput, { target: { value: 'new' } });

    const confirmPasswordInput = screen.getByLabelText(/Confirm New Password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'new' } });

    const saveButton = screen.getByText(/Save Changes/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid current password/i)).toBeDefined();
    });
  });
});
