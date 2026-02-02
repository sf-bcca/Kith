import { describe, it, expect, beforeEach } from 'vitest';
import { ActivityService } from './ActivityService';
import { mockActivities } from '../mocks/activityData';

describe('ActivityService', () => {
  beforeEach(() => {
    ActivityService.reset();
  });

  it('should return all activities', () => {
    const feed = ActivityService.getFeed();
    expect(feed).toHaveLength(mockActivities.length);
    expect(feed).toEqual(mockActivities);
  });

  it('should return activities sorted by timestamp (newest first)', () => {
    const feed = ActivityService.getFeed();
    for (let i = 0; i < feed.length - 1; i++) {
      const current = new Date(feed[i].timestamp).getTime();
      const next = new Date(feed[i+1].timestamp).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });

  it('should filter activities by type', () => {
    const results = ActivityService.getFeed({ type: 'photo_added' });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(a => expect(a.type).toBe('photo_added'));
  });

  it('should filter activities by actor', () => {
    const actorId = '2'; // Uncle John
    const results = ActivityService.getFeed({ actorId });
    expect(results.length).toBeGreaterThan(0);
    results.forEach(a => expect(a.actorId).toBe(actorId));
  });

  it('should approve an activity', () => {
    const activityId = 'a1';
    const success = ActivityService.approveActivity(activityId);
    expect(success).toBe(true);
    
    const activity = ActivityService.getFeed().find(a => a.id === activityId);
    expect(activity?.status).toBe('approved');
  });

  it('should return false when approving a non-existent activity', () => {
    const success = ActivityService.approveActivity('non-existent');
    expect(success).toBe(false);
  });

  it('should add a comment to an activity', () => {
    const activityId = 'a1';
    const comment = {
      authorId: '1',
      text: 'Great photo!'
    };
    const success = ActivityService.addComment(activityId, comment);
    expect(success).toBe(true);
    
    const activity = ActivityService.getFeed().find(a => a.id === activityId);
    expect(activity?.comments).toHaveLength(1);
    expect(activity?.comments[0].text).toBe('Great photo!');
  });
});
