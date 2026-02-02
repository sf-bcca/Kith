import { Member } from '../types';

export const mockMembers: Record<string, Member> = {
  '1': {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '1985',
    gender: 'male',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOpNN5yVahrXq0LD134v_xm3XCie_E86p1nR2HJtoiv0DNszDybE0gx8rcSSVPvdm7QRoaRAyHJgTwlYI8pdKYq1PZUd9XlFsIP94uNN7brqMtNz3aEDJF4Xzhk16gJ-25a29crKnThHXILdiM5yA4koZ9FJClmA57VgMGwpb2NarAvI-Y8qCHXW_sEKmYzymOuzESIteI5utDMG_LRvymLrkgMHZ50Al-WAnspgLx81ENETfklFISKc4kGNoWDM4Ezcwv62o86mk',
    parents: ['2', '3'],
    spouses: [],
    children: []
  },
  '2': {
    id: '2',
    firstName: 'Robert',
    lastName: 'Doe',
    birthDate: '1958',
    deathDate: '2020',
    gender: 'male',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW8iy-7ZzCAbUllVtbNktqUCo_fAJSwA2BjZDRdzp__hPFHc8FgdTmj0ES6Q0tRnJLRd7gejvWn3dzAgzKdbKOjkDsMJjE-MYGe2dJi5SVZt_U_T2olcF7a12iINsIND2WXvLJQH_9qSJZb_MYL1q3JpK4umavvVp9JYsLCLIVaYMIgsgqRfCxoVmrL2IjGtQS9hlt8qTpE5Tn2mwz_EGdR8m0VWHGsHTTeGzIpHSY2n5pWX4Rqyg4axdYUobgcqCmdFPw6EzWeJI',
    parents: ['4', '5'],
    spouses: ['3'],
    children: ['1']
  },
  '3': {
    id: '3',
    firstName: 'Jane',
    lastName: 'Smith',
    birthDate: '1960',
    gender: 'female',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzjoM42cOUKC4AdtPe1NTvvwNS0FCOrpvAR71EmOiRYfqY74dtzS0lJ4kXZg7OZ7iYDYsZLPxnXNOj5Y4RfFOreCSInTlHcALIstrDY29Fp9j7-39y_KIqiB5ifLrMUWuIFMTTd_mlll-Sgp3ilRfOhTMVQ7GWyA-yAd2MhXL0JSW1W4SPYtuBwYvds7vArmZskwhh2DmYXGbEhPvjkknV-sCvj444K8O3Z7BSepK5HR5YmjBUxHzEAA2CmoEe5oeZ35pOxgr9wqw',
    parents: ['6', '7'],
    spouses: ['2'],
    children: ['1']
  },
  '4': {
    id: '4',
    firstName: 'Arthur',
    lastName: 'Doe',
    birthDate: '1925',
    deathDate: '1998',
    gender: 'male',
    parents: ['8', '9'], // Great grandparents
    spouses: ['5'],
    children: ['2']
  },
  '5': {
    id: '5',
    firstName: 'Martha',
    lastName: 'Hall',
    birthDate: '1930',
    deathDate: '2005',
    gender: 'female',
    parents: ['10', '11'],
    spouses: ['4'],
    children: ['2']
  },
  '6': {
    id: '6',
    firstName: 'George',
    lastName: 'Smith',
    birthDate: '1932',
    deathDate: '2012',
    gender: 'male',
    parents: ['12', '13'],
    spouses: ['7'],
    children: ['3']
  },
  '7': {
    id: '7',
    firstName: 'Alice',
    lastName: 'Brown',
    birthDate: '1935',
    deathDate: '2018',
    gender: 'female',
    parents: ['14', '15'],
    spouses: ['6'],
    children: ['3']
  },
  // Great Grandparents (Placeholders)
  '8': { id: '8', firstName: 'GP', lastName: 'Father 1', gender: 'male', parents: [], spouses: [], children: ['4'] },
  '9': { id: '9', firstName: 'GP', lastName: 'Mother 1', gender: 'female', parents: [], spouses: [], children: ['4'] },
  '10': { id: '10', firstName: 'GP', lastName: 'Father 2', gender: 'male', parents: [], spouses: [], children: ['5'] },
  '11': { id: '11', firstName: 'GP', lastName: 'Mother 2', gender: 'female', parents: [], spouses: [], children: ['5'] },
  '12': { id: '12', firstName: 'GP', lastName: 'Father 3', gender: 'male', parents: [], spouses: [], children: ['6'] },
  '13': { id: '13', firstName: 'GP', lastName: 'Mother 3', gender: 'female', parents: [], spouses: [], children: ['6'] },
  '14': { id: '14', firstName: 'GP', lastName: 'Father 4', gender: 'male', parents: [], spouses: [], children: ['7'] },
  '15': { id: '15', firstName: 'GP', lastName: 'Mother 4', gender: 'female', parents: [], spouses: [], children: ['7'] },
};
