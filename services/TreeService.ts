import { FamilyMember } from '../types/family';
import { FamilyService } from './FamilyService';

export interface TreeData {
  focus: FamilyMember;
  parents: FamilyMember[];
  spouses: FamilyMember[];
  children: FamilyMember[];
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
}
