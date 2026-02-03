import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActivityFeed from '../ActivityFeed';
import { ActivityService } from '../../services/ActivityService';
import { FamilyService } from '../../services/FamilyService';

vi.mock('../../services/ActivityService', () => ({
  ActivityService: {
    getFeed: vi.fn(),
    approveActivity: vi.fn(),
    addComment: vi.fn(),
  },
}));

vi.mock('../../services/FamilyService', () => ({
  FamilyService: {
    getById: vi.fn(),
    getAll: vi.fn(),
  },
}));

describe('ActivityFeed', () => {
  const mockActivities = [
    {
      id: '1',
      type: 'photo_added',
      timestamp: new Date().toISOString(),
      actorId: '1',
      targetId: '1',
      content: { text: 'Uploaded a photo' },
      status: 'pending',
      comments: [],
    },
  ];

  const mockActor = { id: '1', firstName: 'Arthur', lastName: 'Pendragon' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ActivityService.getFeed).mockResolvedValue(mockActivities as any);
    vi.mocked(FamilyService.getById).mockResolvedValue(mockActor as any);
    vi.mocked(FamilyService.getAll).mockResolvedValue([mockActor] as any);
  });

  it('renders activities from the service', async () => {
    render(<ActivityFeed onNavigate={vi.fn()} currentUserId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Arthur Pendragon/)[0]).toBeInTheDocument();
      expect(screen.getByText(/added/i)).toBeInTheDocument();
      expect(screen.getAllByText(/photos/i).length).toBeGreaterThan(0);
    });
  });

  it('updates the status when clicking Approve', async () => {
    render(<ActivityFeed onNavigate={vi.fn()} currentUserId="user-1" />);
    
    // Wait for the feed to load
    await waitFor(() => expect(screen.getAllByText(/Arthur Pendragon/).length).toBeGreaterThan(0));

    const approveButtons = screen.getAllByRole('button', { name: /Approve/i });
    fireEvent.click(approveButtons[0]);

    await waitFor(() => {
      expect(ActivityService.approveActivity).toHaveBeenCalledWith('1');
    });
  });

  it('allows adding a comment', async () => {
    render(<ActivityFeed onNavigate={vi.fn()} currentUserId="user-1" />);
    
    // Wait for the feed to load
    await waitFor(() => expect(screen.getAllByText(/Arthur Pendragon/).length).toBeGreaterThan(0));

    const commentButtons = screen.getAllByRole('button', { name: /Comment/i });
    fireEvent.click(commentButtons[0]);

    const input = screen.getByPlaceholderText(/Write a comment/i);
    fireEvent.change(input, { target: { value: 'Nice photo!' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(ActivityService.addComment).toHaveBeenCalledWith('1', {
        authorId: 'user-1',
        text: 'Nice photo!',
      });
    });
  });
});
