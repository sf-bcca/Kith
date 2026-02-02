import { Member, TreeData } from '../types';
import { FamilyService } from './FamilyService';

export class TreeService {
  static getAncestors(focusPersonId: string): TreeData {
    const focusPerson = FamilyService.getMember(focusPersonId);

    if (!focusPerson) {
      throw new Error('Focus person not found');
    }

    const parents: Member[] = [];
    const grandparents: Member[] = [];
    const greatGrandparents: Member[] = [];

    focusPerson.parents.forEach(parentId => {
      const parent = FamilyService.getMember(parentId);
      if (parent) {
        parents.push(parent);
        parent.parents.forEach(gpId => {
          const gp = FamilyService.getMember(gpId);
          if (gp) {
            grandparents.push(gp);
            gp.parents.forEach(ggpId => {
              const ggp = FamilyService.getMember(ggpId);
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

  // Helper for FanChart, which might need a recursive structure or flattened list by generation
  static getFanChartData(focusPersonId: string, generations: number = 3): { person: Member, generation: number }[] {
      const result: { person: Member, generation: number }[] = [];
      const queue: { id: string, gen: number }[] = [{ id: focusPersonId, gen: 0 }];

      while (queue.length > 0) {
          const { id, gen } = queue.shift()!;
          const person = FamilyService.getMember(id);
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
