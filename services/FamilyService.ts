import { FamilyMember, FilterCriteria } from '../types/family';
import { mockFamilyData } from '../mocks/familyData';

export class FamilyService {
  /**
   * Retrieves all family members from the data source.
   * @returns An array of FamilyMember objects.
   */
  static getAll(): FamilyMember[] {
    return mockFamilyData;
  }

  /**
   * Retrieves a specific family member by their unique ID.
   * @param id The unique identifier of the family member.
   * @returns The FamilyMember object if found, otherwise undefined.
   */
  static getById(id: string): FamilyMember | undefined {
    return mockFamilyData.find((member) => member.id === id);
  }

  /**
   * Searches for family members by name (first name, last name, or full name).
   * @param query The search query string.
   * @returns An array of FamilyMember objects that match the search query.
   */
  static search(query: string): FamilyMember[] {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return mockFamilyData;
    }

    return mockFamilyData.filter((member) => {
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
   * @returns An array of FamilyMember objects that match all criteria.
   */
  static filter(criteria: FilterCriteria): FamilyMember[] {
    return mockFamilyData.filter((member) => {
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
        // If searching by year but member has no birthDate, exclude them
        return false;
      }
      return true;
    });
  }
}