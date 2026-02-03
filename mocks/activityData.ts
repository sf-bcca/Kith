export const mockActivities = [
  {
    id: '1',
    type: 'photo_added',
    timestamp: new Date().toISOString(),
    actorId: '1',
    targetId: '1',
    content: { text: 'Uploaded a photo' },
    status: 'approved',
    comments: []
  },
  {
    id: '2',
    type: 'member_updated',
    timestamp: new Date(Date.now() - 10000).toISOString(),
    actorId: '2',
    targetId: '2',
    content: { text: 'Updated bio' },
    status: 'approved',
    comments: []
  }
];
