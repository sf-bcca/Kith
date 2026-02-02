import { FamilyMember, FilterCriteria, LoginCredentials } from '../types/family';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class FamilyService {
  /**
   * Logs in a family member.
   * @param credentials The login credentials.
   * @returns A promise that resolves to the logged-in FamilyMember.
   */
  static async login(credentials: LoginCredentials): Promise<FamilyMember> {
    const response = await fetch(`${API_URL}/api/login`, {
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
    return this.mapSingleToFrontend(data);
  }

  /**
   * Retrieves all family members from the API.
   * @returns A promise that resolves to an array of FamilyMember objects.
   */
  static async getAll(): Promise<FamilyMember[]> {
    const response = await fetch(`${API_URL}/api/members`);
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
    const response = await fetch(`${API_URL}/api/members/${id}`);
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
  static async create(member: Partial<FamilyMember>): Promise<FamilyMember> {
    const backendData = this.mapFrontendToBackend(member);
    const response = await fetch(`${API_URL}/api/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      throw new Error('Failed to create family member');
    }

    const data = await response.json();
    return this.mapSingleToFrontend(data);
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      throw new Error('Failed to update family member');
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
    });

    if (!response.ok) {
      throw new Error('Failed to delete family member');
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
      deathDate: item.death_date,
      biography: item.bio,
      photoUrl: item.profile_image,
      password: item.password,
      // Relationships mapping
      parents: item.relationships?.parents || [],
      spouses: item.relationships?.spouses || [],
      children: item.relationships?.children || [],
    };
  }

  private static mapFrontendToBackend(member: Partial<FamilyMember>): any {
    return {
      first_name: member.firstName,
      last_name: member.lastName,
      gender: member.gender,
      birth_date: member.birthDate,
      death_date: member.deathDate,
      bio: member.biography,
      profile_image: member.photoUrl,
      password: member.password,
      relationships: {
        parents: member.parents,
        spouses: member.spouses,
        children: member.children,
      }
    };
  }
}
