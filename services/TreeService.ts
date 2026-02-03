import { FamilyMember } from '../types/family';
import { FamilyService } from './FamilyService';

export interface TreeData {
  focus: FamilyMember;
  parents: FamilyMember[];
  spouses: FamilyMember[];
  children: FamilyMember[];
}

export interface AncestryData {
  focusPerson: FamilyMember;
  parents: FamilyMember[];
  grandparents: FamilyMember[];
  greatGrandparents: FamilyMember[];
}

export interface DescendantData {
  focusPerson: FamilyMember;
  children: FamilyMember[];
  grandchildren: FamilyMember[];
  greatGrandchildren: FamilyMember[];
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

    const [parents, spouses, children] = await Promise.all([
      FamilyService.getByIds(focus.parents),
      FamilyService.getByIds(focus.spouses),
      FamilyService.getByIds(focus.children)
    ]);

    return {
      focus,
      parents,
      spouses,
      children
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
    const parents = await FamilyService.getByIds(focusPerson.parents);
    
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
      greatGrandparents
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
    const children = await FamilyService.getByIds(focusPerson.children);

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
      greatGrandchildren
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
}
