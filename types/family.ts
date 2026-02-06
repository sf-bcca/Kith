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
  email?: string;
  username?: string;
  darkMode?: boolean;
  language?: string;
  visibility?: 'public' | 'family-only';
  dataSharing?: boolean;
  notificationsEmail?: boolean;
  notificationsPush?: boolean;
  role?: 'admin' | 'member';
  
  // Relations stored as IDs
  parents: string[];
  spouses: string[];
  children: string[];
  siblings: SiblingRelationship[]; // Array of explicit sibling links
}

export type SiblingType = 'Full' | 'Half' | 'Step' | 'Adopted';

export interface SiblingRelationship {
  id: string;
  type: SiblingType;
}

export interface LoginCredentials {
  firstName: string;
  lastName: string;
  birthDate: string;
  password?: string;
}

export interface FilterCriteria {
  gender?: Gender;
  lastName?: string;
  birthYearStart?: number;
  birthYearEnd?: number;
}
