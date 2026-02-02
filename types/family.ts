export type Gender = 'male' | 'female' | 'other';

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate?: string; // ISO 8601 YYYY-MM-DD
  birthPlace?: string;
  deathDate?: string; // ISO 8601 YYYY-MM-DD
  deathPlace?: string;
  photoUrl?: string;
  biography?: string;
  
  // Relations stored as IDs
  parents: string[];
  spouses: string[];
  children: string[];
}

export interface FilterCriteria {
  gender?: Gender;
  lastName?: string;
  birthYearStart?: number;
  birthYearEnd?: number;
}
