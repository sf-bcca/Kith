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
   * @returns The TreeData object containing the focus member and their direct relations.
   */
  static getTreeFor(focusId: string): TreeData | undefined {
    const focus = FamilyService.getById(focusId);
    if (!focus) return undefined;

    const parents = focus.parents
      .map(id => FamilyService.getById(id))
      .filter((m): m is FamilyMember => !!m);

    const spouses = focus.spouses
      .map(id => FamilyService.getById(id))
      .filter((m): m is FamilyMember => !!m);

    const children = focus.children
      .map(id => FamilyService.getById(id))
      .filter((m): m is FamilyMember => !!m);

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
  static getAncestors(focusPersonId: string): AncestryData {
    const focusPerson = FamilyService.getById(focusPersonId);

    if (!focusPerson) {
      throw new Error('Focus person not found');
    }

    const parents: FamilyMember[] = [];
    const grandparents: FamilyMember[] = [];
    const greatGrandparents: FamilyMember[] = [];

    focusPerson.parents.forEach(parentId => {
      const parent = FamilyService.getById(parentId);
      if (parent) {
        parents.push(parent);
        parent.parents.forEach(gpId => {
          const gp = FamilyService.getById(gpId);
          if (gp) {
            grandparents.push(gp);
            gp.parents.forEach(ggpId => {
              const ggp = FamilyService.getById(ggpId);
              if (ggp) {
                greatGrandparents.push(ggp);
              }
            });
          }
        });
      }
    });

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
  static getFanChartData(focusPersonId: string, generations: number = 3): { person: FamilyMember, generation: number }[] {
      const result: { person: FamilyMember, generation: number }[] = [];
      const queue: { id: string, gen: number }[] = [{ id: focusPersonId, gen: 0 }];

      while (queue.length > 0) {
          const { id, gen } = queue.shift()!;
          const person = FamilyService.getById(id);
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