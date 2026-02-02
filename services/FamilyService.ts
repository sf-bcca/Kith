import { Member } from '../types';
import { mockMembers } from './mockData';

export class FamilyService {
  static getMember(id: string): Member | undefined {
    return mockMembers[id];
  }

  static getCurrentUser(): Member {
    // Return hardcoded user for now, or fetch from auth context if it existed
    return mockMembers['1'];
  }

  static searchMembers(query: string): Member[] {
    const lowerQuery = query.toLowerCase();
    return Object.values(mockMembers).filter(member =>
      member.firstName.toLowerCase().includes(lowerQuery) ||
      member.lastName.toLowerCase().includes(lowerQuery)
    );
  }
}
