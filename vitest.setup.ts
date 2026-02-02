import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { mockFamilyData } from './mocks/familyData';
import { mockActivities } from './mocks/activityData';

// Mock fetch globally
global.fetch = vi.fn((url: string) => {
  if (url.includes('/api/members')) {
    const idMatch = url.match(/\/api\/members\/([^/]+)$/);
    if (idMatch) {
      const id = idMatch[1];
      const member = mockFamilyData.find(m => m.id === id);
      if (member) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: member.id,
            first_name: member.firstName,
            last_name: member.lastName,
            gender: member.gender,
            birth_date: member.birthDate,
            bio: member.biography,
            profile_image: member.photoUrl,
            relationships: {
              parents: member.parents,
              spouses: member.spouses,
              children: member.children
            }
          })
        });
      } else {
        return Promise.resolve({ ok: false, status: 404 });
      }
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockFamilyData.map(m => ({
        id: m.id,
        first_name: m.firstName,
        last_name: m.lastName,
        gender: m.gender,
        birth_date: m.birthDate,
        relationships: {
          parents: m.parents,
          spouses: m.spouses,
          children: m.children
        }
      })))
    });
  }

  if (url.includes('/api/activities')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockActivities.map(a => ({
        id: a.id,
        type: a.type,
        timestamp: a.timestamp,
        member_id: a.actorId,
        target_id: a.targetId,
        content: a.content, // Pass the original content object/string
        image_url: (a.content as any).photoUrls?.[0] || '',
        status: a.status,
        comments: a.comments
      })))
    });
  }

  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
}) as any;
