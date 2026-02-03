/// <reference types="vite/client" />

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface DiscoverySummary {
  onThisDay: any[];
  hints: any[];
}

export const DiscoverService = {
  getToken(): string | null {
    return localStorage.getItem('kith_token');
  },

  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async getSummary(): Promise<DiscoverySummary> {
    const response = await fetch(`${API_URL}/api/discover/summary`, {
      headers: this.getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch discovery summary');
    }
    return response.json();
  }
};
