import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActivityFeed from '../ActivityFeed';
import { ActivityService } from '../../services/ActivityService';
import { mockActivities } from '../../mocks/activityData';

// Mock ActivityService
vi.mock('../../services/ActivityService', () => ({
  ActivityService: {
    getFeed: vi.fn(),
    approveActivity: vi.fn(),
    addComment: vi.fn()
  }
}));

describe('ActivityFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (ActivityService.getFeed as any).mockResolvedValue([...mockActivities]);
    (ActivityService.approveActivity as any).mockResolvedValue(true);
    (ActivityService.addComment as any).mockResolvedValue(true);
  });

  it('renders activities from the service', async () => {
    render(<ActivityFeed onNavigate={vi.fn()} currentUserId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Guinevere Pendragon/)).toBeInTheDocument();
    });
  });

  it('updates the status when clicking Approve', async () => {
    render(<ActivityFeed onNavigate={vi.fn()} currentUserId="user-1" />);
    
    // Wait for the feed to load
    await screen.findByText(/Guinevere Pendragon/);

    const approveButtons = screen.getAllByRole('button', { name: /Approve/i });
    fireEvent.click(approveButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Approved/i)).toBeInTheDocument();
    });
  });

  it('allows adding a comment', async () => {
    render(<ActivityFeed onNavigate={vi.fn()} currentUserId="user-1" />);
    
    // Wait for the feed to load
    await screen.findByText(/Guinevere Pendragon/);

    const commentButtons = screen.getAllByRole('button', { name: /Comment/i });
    fireEvent.click(commentButtons[0]);

    const input = await screen.findByPlaceholderText(/Write a comment.../i);
    fireEvent.change(input, { target: { value: 'This is a test comment' } });
    
    const postButton = screen.getByRole('button', { name: /Post/i });
    fireEvent.click(postButton);
    
    await waitFor(() => {
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });
  });

  it('renders the empty state if no activities are present', async () => {
    (ActivityService.getFeed as any).mockResolvedValue([]);
    render(<ActivityFeed onNavigate={vi.fn()} currentUserId="user-1" />);
    await waitFor(() => {
      expect(screen.getByText(/No activities yet/i)).toBeInTheDocument();
    });
  });
});
