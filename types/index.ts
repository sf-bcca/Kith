export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  deathDate?: string; // If undefined/null, assume living
  gender: 'male' | 'female' | 'other';
  photoUrl?: string;
  parents: string[]; // IDs of parents
  spouses: string[]; // IDs of spouses
  children: string[]; // IDs of children
}

export interface TreeData {
  focusPerson: Member;
  parents: Member[];
  grandparents: Member[];
  greatGrandparents: Member[];
}
