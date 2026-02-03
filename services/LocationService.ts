import { FamilyMember } from '../types/family';
import { FamilyService } from './FamilyService';
import { getCoordinates, Coordinates } from '../src/utils/location';

export interface LocationPoint {
  memberId: string;
  name: string;
  location: string;
  coords: Coordinates;
  type: 'birth' | 'death';
}

export interface MigrationPath {
  from: LocationPoint;
  to: LocationPoint;
  memberId: string;
}

export class LocationService {
  /**
   * Gets all origin points (birthplaces) for all members.
   */
  static async getAllOrigins(): Promise<LocationPoint[]> {
    const members = await FamilyService.getAll();
    const points: LocationPoint[] = [];

    members.forEach(member => {
      const coords = getCoordinates(member.birthPlace);
      if (coords) {
        points.push({
          memberId: member.id,
          name: `${member.firstName} ${member.lastName}`,
          location: member.birthPlace!,
          coords,
          type: 'birth'
        });
      }
    });

    return points;
  }

  /**
   * Gets migration paths (parent birthplace to child birthplace).
   */
  static async getMigrationPaths(): Promise<MigrationPath[]> {
    const members = await FamilyService.getAll();
    const paths: MigrationPath[] = [];

    for (const member of members) {
      const childCoords = getCoordinates(member.birthPlace);
      if (!childCoords) continue;

      const childPoint: LocationPoint = {
        memberId: member.id,
        name: `${member.firstName} ${member.lastName}`,
        location: member.birthPlace!,
        coords: childCoords,
        type: 'birth'
      };

      for (const parentId of member.parents) {
        const parent = await FamilyService.getById(parentId);
        if (parent) {
          const parentCoords = getCoordinates(parent.birthPlace);
          if (parentCoords) {
            const parentPoint: LocationPoint = {
              memberId: parent.id,
              name: `${parent.firstName} ${parent.lastName}`,
              location: parent.birthPlace!,
              coords: parentCoords,
              type: 'birth'
            };

            paths.push({
              from: parentPoint,
              to: childPoint,
              memberId: member.id
            });
          }
        }
      }
    }

    return paths;
  }
}
