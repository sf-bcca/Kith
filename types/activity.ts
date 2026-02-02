export type ActivityType = 'photo_added' | 'member_updated' | 'member_added' | 'milestone';

export interface ActivityComment {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  timestamp: string;
  actorId: string;
  targetId?: string;
  content: {
    photoUrls?: string[];
    oldValue?: string;
    newValue?: string;
    field?: string;
    description?: string;
    memberDetails?: {
      name: string;
      birthDate: string;
      relationship: string;
      imageUrl: string;
    };
  };
  status: 'pending' | 'approved';
  comments: ActivityComment[];
}
