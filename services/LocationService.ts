import { FamilyMember } from '../types/family';
import { FamilyService } from './FamilyService';
import { fetchCoordinates, Coordinates } from '../src/utils/location';

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

const CACHE_KEY = 'kith_geo_cache';
const DELAY_MS = 1200; // > 1 second for Nominatim

export class LocationService {
  private static getCache(): Record<string, Coordinates> {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private static setCache(cache: Record<string, Coordinates>) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }

  private static async getCoordsWithCache(location: string, cache: Record<string, Coordinates>): Promise<Coordinates | null> {
    if (cache[location]) return cache[location];
    
    // Rate limit delay before fetch
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    
    const coords = await fetchCoordinates(location);
    if (coords) {
      cache[location] = coords;
      this.setCache(cache);
    }
    return coords;
  }

  /**
   * Gets all origin points (birthplaces) for all members.
   */
  static async getAllOrigins(): Promise<LocationPoint[]> {
    const members = await FamilyService.getAll();
    const points: LocationPoint[] = [];
    const cache = this.getCache();

    for (const member of members) {
      if (member.birthPlace) {
        const coords = await this.getCoordsWithCache(member.birthPlace, cache);
        if (coords) {
          points.push({
            memberId: member.id,
            name: `${member.firstName} ${member.lastName}`,
            location: member.birthPlace,
            coords,
            type: 'birth'
          });
        }
      }
    }

    return points;
  }

  /**
   * Gets migration paths (parent birthplace to child birthplace).
   */
  static async getMigrationPaths(): Promise<MigrationPath[]> {
    const members = await FamilyService.getAll();
    const paths: MigrationPath[] = [];
    const cache = this.getCache();

    for (const member of members) {
      if (!member.birthPlace) continue;
      
      const childCoords = await this.getCoordsWithCache(member.birthPlace, cache);
      if (!childCoords) continue;

      const childPoint: LocationPoint = {
        memberId: member.id,
        name: `${member.firstName} ${member.lastName}`,
        location: member.birthPlace,
        coords: childCoords,
        type: 'birth'
      };

      for (const parentId of member.parents) {
        const parent = await FamilyService.getById(parentId);
        if (parent && parent.birthPlace) {
          const parentCoords = await this.getCoordsWithCache(parent.birthPlace, cache);
          if (parentCoords) {
            const parentPoint: LocationPoint = {
              memberId: parent.id,
              name: `${parent.firstName} ${parent.lastName}`,
              location: parent.birthPlace,
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
