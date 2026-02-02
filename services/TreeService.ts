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

export class TreeService {
  /**
   * Retrieves the tree data centered around a specific focus member.
   * @param focusId The ID of the member to center the tree on.
   * @returns A promise that resolves to the TreeData object containing the focus member and their direct relations.
   */
  static async getTreeFor(focusId: string): Promise<TreeData | undefined> {
    const focus = await FamilyService.getById(focusId);
    if (!focus) return undefined;

    const parents = await Promise.all(
      focus.parents.map(id => FamilyService.getById(id))
    );
    const spouses = await Promise.all(
      focus.spouses.map(id => FamilyService.getById(id))
    );
    const children = await Promise.all(
      focus.children.map(id => FamilyService.getById(id))
    );

    return {
      focus,
      parents: parents.filter((m): m is FamilyMember => !!m),
      spouses: spouses.filter((m): m is FamilyMember => !!m),
      children: children.filter((m): m is FamilyMember => !!m)
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

    const parents: FamilyMember[] = [];
    const grandparents: FamilyMember[] = [];
    const greatGrandparents: FamilyMember[] = [];

    for (const parentId of focusPerson.parents) {
      const parent = await FamilyService.getById(parentId);
      if (parent) {
        parents.push(parent);
        for (const gpId of parent.parents) {
          const gp = await FamilyService.getById(gpId);
          if (gp) {
            grandparents.push(gp);
            for (const ggpId of gp.parents) {
              const ggp = await FamilyService.getById(ggpId);
              if (ggp) {
                greatGrandparents.push(ggp);
              }
            }
          }
        }
      }
    }

    return {
      focusPerson,
      parents,
      grandparents,
      greatGrandparents
    };
  }

  /**
   * Helper for FanChart, returning a flattened list by generation.
   */
  static async getFanChartData(focusPersonId: string, generations: number = 3): Promise<{ person: FamilyMember, generation: number }[]> {
      const result: { person: FamilyMember, generation: number }[] = [];
      const queue: { id: string, gen: number }[] = [{ id: focusPersonId, gen: 0 }];

      while (queue.length > 0) {
          const { id, gen } = queue.shift()!;
          const person = await FamilyService.getById(id);
          if (person) {
              result.push({ person, generation: gen });
              if (gen < generations) {
                  person.parents.forEach(pid => queue.push({ id: pid, gen: gen + 1 }));
              }
          }
      }
      return result;
  }
}
