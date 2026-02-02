import { FamilyMember } from '../types/family';
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
}
