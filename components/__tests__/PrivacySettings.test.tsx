import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PrivacySettings from '../PrivacySettings';
import { FamilyService } from '../../services/FamilyService';
import React from 'react';

vi.mock('../../services/FamilyService');

describe('PrivacySettings', () => {
  const mockMember = {
    id: '1',
    visibility: 'family-only',
    dataSharing: true
  };

  it('should render privacy settings', () => {
    render(<PrivacySettings member={mockMember as any} onUpdate={vi.fn()} />);
    
    expect(screen.getByLabelText(/Profile Visibility/i)).toHaveValue('family-only');
    expect(screen.getByLabelText(/Share Usage Data/i)).toBeChecked();
  });

  it('should call onUpdate when settings change', async () => {
    const onUpdate = vi.fn();
    (FamilyService.updateSettings as any).mockResolvedValue({ ...mockMember, visibility: 'public' });

    render(<PrivacySettings member={mockMember as any} onUpdate={onUpdate} />);
    
    const visibilitySelect = screen.getByLabelText(/Profile Visibility/i);
    fireEvent.change(visibilitySelect, { target: { value: 'public' } });
    
    const saveButton = screen.getByText(/Save Privacy Settings/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(FamilyService.updateSettings).toHaveBeenCalledWith('1', expect.objectContaining({
        visibility: 'public'
      }));
      expect(onUpdate).toHaveBeenCalled();
    });
  });
});
