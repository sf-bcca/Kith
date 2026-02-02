import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PreferenceSettings from '../PreferenceSettings';
import { FamilyService } from '../../services/FamilyService';
import React from 'react';

vi.mock('../../services/FamilyService');

describe('PreferenceSettings', () => {
  const mockMember = {
    id: '1',
    darkMode: false,
    language: 'en',
    notificationsEmail: true,
    notificationsPush: true
  };

  it('should render preference settings', () => {
    render(<PreferenceSettings member={mockMember as any} onUpdate={vi.fn()} />);
    
    expect(screen.getByLabelText(/Language/i)).toHaveValue('en');
    expect(screen.getByLabelText(/Email Notifications/i)).toBeChecked();
  });

  it('should call onUpdate when preferences change', async () => {
    const onUpdate = vi.fn();
    (FamilyService.updateSettings as any).mockResolvedValue({ ...mockMember, darkMode: true });

    render(<PreferenceSettings member={mockMember as any} onUpdate={onUpdate} />);
    
    const darkModeToggle = screen.getByLabelText(/Dark Mode/i);
    fireEvent.click(darkModeToggle);
    
    const saveButton = screen.getByText(/Save Preferences/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(FamilyService.updateSettings).toHaveBeenCalledWith('1', expect.objectContaining({
        darkMode: true
      }));
      expect(onUpdate).toHaveBeenCalled();
    });
  });
});
