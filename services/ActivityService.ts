import { Activity, ActivityType } from '../types/activity';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface ActivityFilter {
  type?: ActivityType;
  actorId?: string;
}

export const ActivityService = {
  /**
   * Returns activities sorted by timestamp (newest first) from the API.
   */
  async getFeed(filter?: ActivityFilter): Promise<Activity[]> {
    const response = await fetch(`${API_URL}/api/activities`);
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    let activities: Activity[] = await response.json();
    activities = this.mapBackendToFrontend(activities);

    if (filter?.type) {
      activities = activities.filter(a => a.type === filter.type);
    }

    if (filter?.actorId) {
      activities = activities.filter(a => a.actorId === filter.actorId);
    }

    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  /**
   * Approves an activity (Still local for now as backend doesn't support it yet, 
   * but could be implemented as a PATCH /api/activities/:id)
   */
  async approveActivity(id: string): Promise<boolean> {
    // This is a placeholder as backend migration for status isn't fully spec'd
    console.warn('Approve activity is not yet implemented in backend');
    return true;
  },

  /**
   * Adds a comment to an activity via the API.
   */
  async addComment(activityId: string, comment: { authorId: string, text: string }): Promise<boolean> {
    const response = await fetch(`${API_URL}/api/activities/${activityId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });

    return response.ok;
  },

  /**
   * Resets the service (no-op for now)
   */
  reset() {
    // No-op for API-driven service
  },

  mapBackendToFrontend(data: any[]): Activity[] {
    return data.map(item => ({
      id: item.id,
      type: item.type,
      timestamp: item.timestamp,
      actorId: item.member_id, // Map member_id to actorId
      targetId: item.target_id, // This might need backend schema update if we want targetId
      content: typeof item.content === 'string' ? { description: item.content, photoUrls: item.image_url ? [item.image_url] : [] } : item.content,
      status: item.status || 'pending',
      comments: item.comments || []
    }));
  }
};