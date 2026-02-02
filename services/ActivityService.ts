import { Activity, ActivityType } from '../types/activity';
import { mockActivities } from '../mocks/activityData';

export interface ActivityFilter {
  type?: ActivityType;
  actorId?: string;
}

// Internal state to simulate persistence for demo/tests
let activities = [...mockActivities];

export const ActivityService = {
  /**
   * Returns activities sorted by timestamp (newest first)
   */
  getFeed(filter?: ActivityFilter): Activity[] {
    let results = [...activities];

    if (filter?.type) {
      results = results.filter(a => a.type === filter.type);
    }

    if (filter?.actorId) {
      results = results.filter(a => a.actorId === filter.actorId);
    }

    return results.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  /**
   * Approves an activity
   */
  approveActivity(id: string): boolean {
    const index = activities.findIndex(a => a.id === id);
    if (index !== -1) {
      activities[index] = { ...activities[index], status: 'approved' };
      return true;
    }
    return false;
  },

  /**
   * Resets the mock data (useful for tests)
   */
  reset(): void {
    activities = [...mockActivities];
  }
};
