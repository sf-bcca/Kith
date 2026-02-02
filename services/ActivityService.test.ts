import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ActivityService } from './ActivityService';
import { mockActivities } from '../mocks/activityData';

// Mock fetch
global.fetch = vi.fn();

describe('ActivityService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ActivityService.reset();
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockActivities.map(a => ({
        id: a.id,
        type: a.type,
        timestamp: a.timestamp,
        member_id: a.actorId,
        content: a.content.description,
        image_url: a.content.photoUrls?.[0] || '',
        status: a.status,
        comments: a.comments
      })))
    });
  });

  it('should return all activities', async () => {
    const feed = await ActivityService.getFeed();
    expect(feed).toHaveLength(mockActivities.length);
  });

  it('should return activities sorted by timestamp (newest first)', async () => {
    const feed = await ActivityService.getFeed();
    for (let i = 0; i < feed.length - 1; i++) {
      const current = new Date(feed[i].timestamp).getTime();
      const next = new Date(feed[i+1].timestamp).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });

  it('should filter activities by type', async () => {
    const results = await ActivityService.getFeed({ type: 'photo_added' });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(a => expect(a.type).toBe('photo_added'));
  });

  it('should filter activities by actor', async () => {
    const actorId = '2';
    const results = await ActivityService.getFeed({ actorId });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(a => expect(a.actorId).toBe(actorId));
  });

  it('should approve an activity', async () => {
    const activityId = 'a1';
    const success = await ActivityService.approveActivity(activityId);
    expect(success).toBe(true);
  });

  it('should add a comment to an activity', async () => {
    const activityId = 'a1';
    const comment = {
      authorId: '1',
      text: 'Great photo!'
    };
    (fetch as any).mockResolvedValueOnce({ ok: true });
    const success = await ActivityService.addComment(activityId, comment);
    expect(success).toBe(true);
  });
});
