import { FamilyMember, FilterCriteria, LoginCredentials } from '../types/family';

const API_URL = import.meta.env.VITE_API_URL || '';

export class FamilyService {
  private static token: string | null = localStorage.getItem('kith_token');

  private static getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  static setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('kith_token', token);
    } else {
      localStorage.removeItem('kith_token');
    }
  }

  /**
   * Checks if the application has been initialized (i.e., has at least one member).
   */
  static async isInitialized(): Promise<boolean> {
    const response = await fetch(`${API_URL}/api/init-check`);
    if (!response.ok) {
      throw new Error('Failed to check initialization status');
    }
    const data = await response.json();
    return data.initialized;
  }

  /**
   * Logs in a family member.
   * @param credentials The login credentials.
   * @returns A promise that resolves to the logged-in FamilyMember.
   */
  static async login(credentials: LoginCredentials): Promise<FamilyMember> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: credentials.firstName,
        last_name: credentials.lastName,
        birth_date: credentials.birthDate,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    return this.mapSingleToFrontend(data.member);
  }

  /**
   * Retrieves all family members from the API.
   * @returns A promise that resolves to an array of FamilyMember objects.
   */
  static async getAll(): Promise<FamilyMember[]> {
    const response = await fetch(`${API_URL}/api/members`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch family members');
    }
    const data = await response.json();
    return this.mapBackendToFrontend(data);
  }

  /**
   * Retrieves a specific family member by their unique ID from the API.
   * @param id The unique identifier of the family member.
   * @returns A promise that resolves to the FamilyMember object if found, otherwise undefined.
   */
  static async getById(id: string): Promise<FamilyMember | undefined> {
    const response = await fetch(`${API_URL}/api/members/${id}`, {
      headers: this.getHeaders(),
    });
    if (response.status === 404) {
      return undefined;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch family member');
    }
    const data = await response.json();
    return this.mapBackendToFrontend(data);
  }

  /**
   * Retrieves multiple family members by their IDs in a single request.
   * @param ids Array of member IDs to retrieve.
   * @returns A promise that resolves to an array of FamilyMember objects.
   */
  static async getByIds(ids: string[]): Promise<FamilyMember[]> {
    if (ids.length === 0) return [];
    
    const response = await fetch(`${API_URL}/api/members?ids=${ids.join(',')}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch family members');
    }
    const data = await response.json();
    return this.mapBackendToFrontend(data);
  }

  /**
   * Searches for family members by name (first name, last name, or full name).
   * @param query The search query string.
   * @returns A promise that resolves to an array of FamilyMember objects that match the search query.
   */
  static async search(query: string): Promise<FamilyMember[]> {
    const members = await this.getAll();
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return members;
    }

    return members.filter((member) => {
      const firstName = member.firstName.toLowerCase();
      const lastName = member.lastName.toLowerCase();
      const fullName = `${firstName} ${lastName}`;

      return (
        firstName.includes(normalizedQuery) ||
        lastName.includes(normalizedQuery) ||
        fullName.includes(normalizedQuery)
      );
    });
  }

  /**
   * Filters family members based on provided criteria.
   * @param criteria The filtering criteria.
   * @returns A promise that resolves to an array of FamilyMember objects that match all criteria.
   */
  static async filter(criteria: FilterCriteria): Promise<FamilyMember[]> {
    const members = await this.getAll();
    return members.filter((member) => {
      if (criteria.gender && member.gender !== criteria.gender) {
        return false;
      }
      if (criteria.lastName && member.lastName !== criteria.lastName) {
        return false;
      }
      if (member.birthDate) {
        const birthYear = new Date(member.birthDate).getFullYear();
        if (criteria.birthYearStart && birthYear < criteria.birthYearStart) {
          return false;
        }
        if (criteria.birthYearEnd && birthYear > criteria.birthYearEnd) {
          return false;
        }
      } else if (criteria.birthYearStart || criteria.birthYearEnd) {
        return false;
      }
      return true;
    });
  }

  /**
   * Creates a new family member.
   * @param member The member data to create.
   * @returns A promise that resolves to the created FamilyMember.
   */
  static async create(member: Partial<FamilyMember> & { password?: string }): Promise<FamilyMember> {
    const backendData = this.mapFrontendToBackend(member);
    if (member.password) {
      backendData.password = member.password;
    }
    const response = await fetch(`${API_URL}/api/members`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create family member');
    }

    const data = await response.json();
    return this.mapSingleToFrontend(data);
  }

  /**
   * Links two existing family members.
   * @param memberId The ID of the member being updated.
   * @param relativeId The ID of the relative being linked.
   * @param relationshipType The type of relationship (parent, child, spouse).
   */
  static async linkMembers(memberId: string, relativeId: string, relationshipType: 'parent' | 'child' | 'spouse'): Promise<void> {
    const response = await fetch(`${API_URL}/api/members/link`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ memberId, relativeId, relationshipType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to link family members');
    }
  }

  /**
   * Updates an existing family member.
   * @param id The ID of the member to update.
   * @param member The partial member data to update.
   * @returns A promise that resolves to the updated FamilyMember.
   */
  static async update(id: string, member: Partial<FamilyMember>): Promise<FamilyMember> {
    const backendData = this.mapFrontendToBackend(member);
    const response = await fetch(`${API_URL}/api/members/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(backendData),
    });

     if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Failed to update family member (status: ${response.status})`);
    }

    const data = await response.json();
    return this.mapSingleToFrontend(data);
  }

  /**
   * Deletes a family member.
   * @param id The ID of the member to delete.
   * @returns A promise that resolves when the member is deleted.
   */
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/members/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete family member');
    }
  }

  /**
   * Updates settings for a family member.
   */
  static async updateSettings(id: string, settings: any): Promise<any> {
    const response = await fetch(`${API_URL}/api/settings/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update settings');
    }

    const data = await response.json();
    return this.mapSingleToFrontend(data);
  }

  /**
   * Retrieves administrative statistics.
   */
  static async getAdminStats(): Promise<any> {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch admin stats');
    }
    return response.json();
  }

  /**
   * Retrieves all siblings (explicit and implied) for a member.
   * @param id The member ID.
   * @returns A promise that resolves to an array of sibling FamilyMember objects.
   */
  static async getSiblings(id: string): Promise<FamilyMember[]> {
    const response = await fetch(`${API_URL}/api/members/${id}/siblings`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch siblings');
    }
    const data = await response.json();
    return this.mapBackendToFrontend(data);
  }

  /**
   * Links two existing family members as siblings.
   * @param memberId The ID of the member being updated.
   * @param siblingId The ID of the relative to add as sibling.
   */
  static async addSibling(memberId: string, siblingId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/members/link`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ memberId, relativeId: siblingId, relationshipType: 'sibling' }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to add sibling');
    }
  }

  /**
   * Removes a sibling relationship between two members.
   * @param memberId The ID of the member being updated.
   * @param siblingId The ID of the sibling to remove.
   */
  static async removeSibling(memberId: string, siblingId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/members/${memberId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        siblings: { action: 'remove', siblingId },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to remove sibling');
    }
  }

  /**
   * Maps backend data (snake_case) to frontend data (camelCase).
   */
  private static mapBackendToFrontend(data: any): any {
    if (Array.isArray(data)) {
      return data.map(this.mapSingleToFrontend);
    }
    return this.mapSingleToFrontend(data);
  }

  private static mapSingleToFrontend(item: any): FamilyMember {
    return {
      id: item.id,
      firstName: item.first_name,
      lastName: item.last_name,
      gender: item.gender,
      birthDate: item.birth_date,
      birthPlace: item.birth_place,
      deathDate: item.death_date,
      deathPlace: item.death_place,
      biography: item.bio,
      photoUrl: item.profile_image,
      email: item.email,
      username: item.username,
      darkMode: item.dark_mode,
      language: item.language,
      visibility: item.visibility,
      dataSharing: item.data_sharing,
      notificationsEmail: item.notifications_email,
      notificationsPush: item.notifications_push,
      // Relationships mapping
      parents: item.relationships?.parents || [],
      spouses: item.relationships?.spouses || [],
      children: item.relationships?.children || [],
      siblings: item.siblings || [],
    };
  }

  private static mapFrontendToBackend(member: Partial<FamilyMember>): any {
    const result: any = {
      first_name: member.firstName,
      last_name: member.lastName,
      gender: member.gender,
      birth_date: member.birthDate,
      birth_place: member.birthPlace,
      death_date: member.deathDate,
      death_place: member.deathPlace,
      bio: member.biography,
      profile_image: member.photoUrl,
      email: member.email,
      username: member.username,
      dark_mode: member.darkMode,
      language: member.language,
      visibility: member.visibility,
      data_sharing: member.dataSharing,
      notifications_email: member.notificationsEmail,
      notifications_push: member.notificationsPush,
    };

    // Only include relationships if at least one is explicitly provided
    if (member.parents !== undefined || member.spouses !== undefined || member.children !== undefined || member.siblings !== undefined) {
      result.relationships = {
        parents: member.parents,
        spouses: member.spouses,
        children: member.children,
        siblings: member.siblings,
      };
    }

    return result;
  }
}
