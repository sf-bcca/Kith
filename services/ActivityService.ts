/// <reference types="vite/client" />
import { Activity, ActivityType } from '../types/activity';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface ActivityFilter {
  type?: ActivityType;
  actorId?: string;
  status?: string;
}

export const ActivityService = {
  getToken(): string | null {
    return localStorage.getItem('kith_token');
  },

  getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  /**
   * Returns activities sorted by timestamp (newest first) from the API.
   */
  async getFeed(filter?: ActivityFilter): Promise<Activity[]> {
    const query = filter?.status ? `?status=${filter.status}` : '';
    const response = await fetch(`${API_URL}/api/activities${query}`, {
      headers: this.getHeaders()
    });
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
   * Approves an activity.
   */
  async approveActivity(id: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/api/activities/${id}/approve`, {
      method: 'PATCH',
      headers: this.getHeaders()
    });
    return response.ok;
  },

  async createActivity(activity: { 
    type: ActivityType, 
    content?: any, 
    image_url?: string, 
    target_id?: string 
  }): Promise<Activity | null> {
    const response = await fetch(`${API_URL}/api/activities`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return this.mapBackendToFrontend([data])[0];
  },

  /**
   * Adds a comment to an activity via the API.
   */
  async addComment(activityId: string, comment: { authorId: string, text: string }): Promise<boolean> {
    const response = await fetch(`${API_URL}/api/activities/${activityId}/comments`, {
      method: 'POST',
      headers: this.getHeaders(),
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