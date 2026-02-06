import { describe, it, expect } from 'vitest';
import { validateLifespan } from './dateUtils';

describe('validateLifespan', () => {
  it('returns valid for a person with only a birth date', () => {
    const result = validateLifespan('1980-01-01', null);
    expect(result.isValid).toBe(true);
  });

  it('returns valid for a birth date before a death date', () => {
    const result = validateLifespan('1900-01-01', '1980-12-31');
    expect(result.isValid).toBe(true);
  });

  it('returns invalid if death date is before birth date', () => {
    const result = validateLifespan('1980-01-01', '1900-01-01');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Death date cannot be before birth date');
  });

  it('returns invalid if birth date is in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const dateString = futureDate.toISOString().split('T')[0];
    
    const result = validateLifespan(dateString, null);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Birth date cannot be in the future');
  });

  it('returns invalid if death date is in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const dateString = futureDate.toISOString().split('T')[0];

    const result = validateLifespan('1980-01-01', dateString);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Death date cannot be in the future');
  });

  it('returns valid for same day birth and death', () => {
    const result = validateLifespan('1980-01-01', '1980-01-01');
    expect(result.isValid).toBe(true);
  });

  it('returns valid when dates are undefined or empty', () => {
    expect(validateLifespan(undefined, undefined).isValid).toBe(true);
    expect(validateLifespan('', '').isValid).toBe(true);
  });
});
