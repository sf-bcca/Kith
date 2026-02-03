import { FamilyMember } from '../types/family';

export const mockFamilyData: FamilyMember[] = [
  {
    id: '1',
    firstName: 'Arthur',
    lastName: 'Pendragon',
    gender: 'male',
    birthDate: '0463-05-12',
    birthPlace: 'Tintagel, Cornwall',
    deathDate: '0515-09-25',
    biography: 'King of the Britons. Wielder of Excalibur.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Howard_Pyle_-_The_Lady_of_the_Lake_sits_by_the_fountain_in_Arroy.jpg/498px-Howard_Pyle_-_The_Lady_of_the_Lake_sits_by_the_fountain_in_Arroy.jpg',
    parents: ['4', '5'],
    spouses: ['2'],
    children: [],
    email: 'arthur@camelot.com',
    username: 'king_arthur',
    darkMode: true,
    language: 'en-GB'
  },
  {
    id: '2',
    firstName: 'Guinevere',
    lastName: 'Pendragon',
    gender: 'female',
    birthDate: '0465-01-01',
    parents: [],
    spouses: ['1'],
    children: []
  },
  {
    id: '3',
    firstName: 'Nimue',
    lastName: 'Lake',
    gender: 'female',
    birthDate: '0470-01-01',
    parents: [],
    spouses: [],
    children: []
  },
  {
    id: '4',
    firstName: 'Uther',
    lastName: 'Pendragon',
    gender: 'male',
    birthDate: '0440-01-01',
    parents: [],
    spouses: ['5'],
    children: ['1']
  },
  {
    id: '5',
    firstName: 'Igraine',
    lastName: 'Pendragon',
    gender: 'female',
    birthDate: '0445-01-01',
    parents: [],
    spouses: ['4'],
    children: ['1']
  },
  {
    id: '6',
    firstName: 'Morgana',
    lastName: 'Pendragon',
    gender: 'female',
    birthDate: '0460-01-01',
    parents: ['4', '5'],
    spouses: [],
    children: []
  },
  {
    id: '7',
    firstName: 'Merlin',
    lastName: 'Ambrosius',
    gender: 'male',
    birthDate: '0450-01-01',
    birthPlace: 'Carmarthen, Wales',
    parents: [],
    spouses: [],
    children: []
  },
  {
    id: '8',
    firstName: 'Mordred',
    lastName: 'Pendragon',
    gender: 'male',
    birthDate: '0480-01-01',
    parents: ['1'],
    spouses: [],
    children: []
  },
  {
    id: '9',
    firstName: 'Gawain',
    lastName: 'Pendragon',
    gender: 'male',
    birthDate: '0475-01-01',
    parents: [],
    spouses: [],
    children: []
  },
  {
    id: '10',
    firstName: 'Gareth',
    lastName: 'Pendragon',
    gender: 'male',
    birthDate: '0476-01-01',
    parents: [],
    spouses: [],
    children: []
  }
];