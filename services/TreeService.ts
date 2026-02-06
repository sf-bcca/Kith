import { FamilyMember } from '../types/family';
import { FamilyService } from './FamilyService';

export interface TreeData {
  focus: FamilyMember;
  parents: FamilyMember[];
  spouses: FamilyMember[];
  children: FamilyMember[];
  siblings: FamilyMember[];
}

export interface AncestryData {
  focusPerson: FamilyMember;
  parents: FamilyMember[];
  grandparents: FamilyMember[];
  greatGrandparents: FamilyMember[];
  siblings: FamilyMember[];
}

export interface DescendantData {
  focusPerson: FamilyMember;
  children: FamilyMember[];
  grandchildren: FamilyMember[];
  greatGrandchildren: FamilyMember[];
  siblings: FamilyMember[];
}

export class TreeService {
  /**
   * Retrieves the tree data centered around a specific focus member.
   * @param focusId The ID of the member to center the tree on.
   * @returns A promise that resolves to the TreeData object containing the focus member and their direct relations.
   */
  static async getTreeFor(focusId: string): Promise<TreeData | undefined> {
    const focus = await FamilyService.getById(focusId);
    if (!focus) return undefined;

    const [parents, spouses, children, siblings] = await Promise.all([
      FamilyService.getByIds(focus.parents),
      FamilyService.getByIds(focus.spouses),
      FamilyService.getByIds(focus.children),
      FamilyService.getSiblings(focusId)
    ]);

    return {
      focus,
      parents,
      spouses,
      children,
      siblings
    };
  }

  /**
   * Retrieves ancestors for pedigree chart (parents, grandparents, great-grandparents).
   */
  static async getAncestors(focusPersonId: string): Promise<AncestryData> {
    const focusPerson = await FamilyService.getById(focusPersonId);

    if (!focusPerson) {
      throw new Error('Focus person not found');
    }

    // Gen 1: Parents
    const [parents, siblings] = await Promise.all([
      FamilyService.getByIds(focusPerson.parents),
      FamilyService.getSiblings(focusPersonId)
    ]);
    
    // Gen 2: Grandparents
    const gpIds = parents.flatMap(p => p.parents);
    const grandparents = await FamilyService.getByIds(gpIds);

    // Gen 3: Great-Grandparents
    const ggpIds = grandparents.flatMap(gp => gp.parents);
    const greatGrandparents = await FamilyService.getByIds(ggpIds);

    return {
      focusPerson,
      parents,
      grandparents,
      greatGrandparents,
      siblings
    };
  }

  /**
   * Retrieves descendants for horizontal chart (children, grandchildren, great-grandchildren).
   */
  static async getDescendants(focusPersonId: string): Promise<DescendantData> {
    const focusPerson = await FamilyService.getById(focusPersonId);

    if (!focusPerson) {
      throw new Error('Focus person not found');
    }

    // Gen 1: Children
    const [children, siblings] = await Promise.all([
      FamilyService.getByIds(focusPerson.children),
      FamilyService.getSiblings(focusPersonId)
    ]);

    // Gen 2: Grandchildren
    const gcIds = children.flatMap(c => c.children);
    const grandchildren = await FamilyService.getByIds(gcIds);

    // Gen 3: Great-Grandchildren
    const ggcIds = grandchildren.flatMap(gc => gc.children);
    const greatGrandchildren = await FamilyService.getByIds(ggcIds);

    return {
      focusPerson,
      children,
      grandchildren,
      greatGrandchildren,
      siblings
    };
  }

  /**
   * Helper for FanChart, returning a flattened list by generation.
   */
  static async getFanChartData(focusPersonId: string, generations: number = 3): Promise<{ person: FamilyMember, generation: number }[]> {
      const result: { person: FamilyMember, generation: number }[] = [];
      const focus = await FamilyService.getById(focusPersonId);
      if (!focus) return result;

      let currentGeneration: FamilyMember[] = [focus];
      result.push({ person: focus, generation: 0 });

      for (let gen = 1; gen <= generations; gen++) {
          const parentIds = currentGeneration.flatMap(p => p.parents);
          if (parentIds.length === 0) break;

          const parents = await FamilyService.getByIds(parentIds);
          parents.forEach(p => result.push({ person: p, generation: gen }));
          currentGeneration = parents;
      }

      return result;
  }

  /**
   * Determines the sibling type between two members.
   * @param member1 First family member
   * @param member2 Second family member
   * @returns 'full' if they share both parents, 'half' if they share one parent, undefined otherwise
   */
  static getSiblingType(member1: FamilyMember, member2: FamilyMember): 'full' | 'half' | undefined {
    const parents1 = member1.parents || [];
    const parents2 = member2.parents || [];

    if (parents1.length === 0 || parents2.length === 0) {
      return undefined; // Cannot determine, parents unknown
    }

    const sharedParents = parents1.filter(pId => parents2.includes(pId));
    
    if (sharedParents.length > 0) {
      // If they share ALL their parents and have the same number of parents, they are full siblings.
      // This handles both the 1-parent and 2-parent cases correctly.
      if (sharedParents.length === parents1.length && sharedParents.length === parents2.length) {
        return 'full';
      }
      return 'half';
    }
    
    return undefined;
  }

  /**
   * Groups members by their shared parents for sibling visualization.
   * @param members Array of family members
   * @returns Array of arrays, where each inner array contains siblings that share parents
   */
  static groupSiblingsByParents(members: FamilyMember[]): FamilyMember[][] {
    const groups: FamilyMember[][] = [];
    const processed = new Set<string>();

    for (const member of members) {
      if (processed.has(member.id)) continue;

      const group: FamilyMember[] = [member];
      processed.add(member.id);

      for (const other of members) {
        if (processed.has(other.id)) continue;

        const siblingType = this.getSiblingType(member, other);
        if (siblingType === 'full' || siblingType === 'half') {
          group.push(other);
          processed.add(other.id);
        }
      }

      if (group.length > 1) {
        groups.push(group);
      }
    }

    return groups;
  }
}
