import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FamilyTreeView from '../FamilyTreeView';
import FamilyDirectory from '../FamilyDirectory';
import HorizontalTree from '../HorizontalTree';
import MemberBiography from '../MemberBiography';
import { FamilyService } from '../../services/FamilyService';
import { TreeService } from '../../services/TreeService';
import { formatDate } from '../../src/utils/dateUtils';

// Mock Services
vi.mock('../../services/FamilyService', () => ({
  FamilyService: {
    getById: vi.fn(),
    search: vi.fn(),
    getSiblings: vi.fn(),
  },
}));

vi.mock('../../services/TreeService', () => ({
  TreeService: {
    getTreeFor: vi.fn(),
    getAncestors: vi.fn(),
    getDescendants: vi.fn(),
    getSiblingType: vi.fn(),
  },
}));

describe('Death Date Display Verification', () => {
  const deceasedMember = {
    id: 'deceased-1',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    birthDate: '1920-06-15',
    birthPlace: 'London',
    deathDate: '2005-06-15',
    deathPlace: 'Paris',
    photoUrl: '',
    parents: [],
    spouses: [],
    children: [],
    siblings: [],
  };

  const livingMember = {
    id: 'living-1',
    firstName: 'Jane',
    lastName: 'Doe',
    gender: 'female',
    birthDate: '1980-06-15',
    birthPlace: 'New York',
    photoUrl: '',
    parents: [],
    spouses: [],
    children: [],
    siblings: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(FamilyService.getSiblings).mockResolvedValue([]);
    vi.mocked(TreeService.getSiblingType).mockReturnValue('full');
  });

  describe('FamilyTreeView', () => {
    it('displays birth and death years for deceased members', async () => {
      vi.mocked(TreeService.getTreeFor).mockResolvedValue({
        focus: deceasedMember,
        parents: [],
        spouses: [],
        children: [],
        siblings: [],
      });

      render(<FamilyTreeView onNavigate={vi.fn()} selectedId="deceased-1" onSelect={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/1920\s*-\s*2005/)).toBeInTheDocument();
      });
    });

    it('displays birth year and "Present" for living members', async () => {
      vi.mocked(TreeService.getTreeFor).mockResolvedValue({
        focus: livingMember,
        parents: [],
        spouses: [],
        children: [],
        siblings: [],
      });

      render(<FamilyTreeView onNavigate={vi.fn()} selectedId="living-1" onSelect={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/1980\s*-\s*Present/)).toBeInTheDocument();
      });
    });
  });

  describe('FamilyDirectory', () => {
    it('displays birth and death years correctly', async () => {
      vi.mocked(FamilyService.search).mockResolvedValue([deceasedMember, livingMember]);

      render(<FamilyDirectory onNavigate={vi.fn()} />);

      await waitFor(() => {
        // Directory uses an en-dash or similar separator
        expect(screen.getByText(/1920\s*–\s*2005/)).toBeInTheDocument();
        expect(screen.getByText(/1980\s*–\s*Present/)).toBeInTheDocument();
      });
    });
  });

  describe('HorizontalTree', () => {
    it('displays birth and death years correctly in ancestor view', async () => {
      vi.mocked(TreeService.getAncestors).mockResolvedValue({
        focusPerson: deceasedMember,
        parents: [],
        grandparents: [],
        greatGrandparents: [],
      });

      render(<HorizontalTree onNavigate={vi.fn()} selectedId="deceased-1" onSelect={vi.fn()} />);

      await waitFor(() => {
        // Horizontal Tree uses em-dash or similar
        expect(screen.getByText(/1920\s*—\s*2005/)).toBeInTheDocument();
      });
    });
  });

  describe('MemberBiography', () => {
    it('displays the Deceased event in the timeline', async () => {
      vi.mocked(FamilyService.getById).mockResolvedValue(deceasedMember);

      render(<MemberBiography onNavigate={vi.fn()} memberId="deceased-1" loggedInId={null} />);

      await waitFor(() => {
        expect(screen.getByText('Deceased in Paris')).toBeInTheDocument();
        expect(screen.getByText(formatDate(deceasedMember.deathDate))).toBeInTheDocument();
      });
    });

    it('does NOT display Deceased event for living members', async () => {
      vi.mocked(FamilyService.getById).mockResolvedValue(livingMember);

      render(<MemberBiography onNavigate={vi.fn()} memberId="living-1" loggedInId={null} />);

      await waitFor(() => {
        expect(screen.queryByText(/Deceased in/)).not.toBeInTheDocument();
      });
    });
    
    it('displays life span in header', async () => {
       vi.mocked(FamilyService.getById).mockResolvedValue(deceasedMember);
       render(<MemberBiography onNavigate={vi.fn()} memberId="deceased-1" loggedInId={null} />);
       await waitFor(() => {
         const elements = screen.getAllByText(/1920\s*–\s*2005/);
         expect(elements.length).toBeGreaterThan(0);
       });
    });
  });
});
