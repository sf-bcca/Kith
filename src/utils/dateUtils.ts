
/**
 * Formats an ISO date string into a human-readable format.
 * Example: "1977-05-24T00:00:00.000Z" -> "May 24, 1977"
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString || dateString === 'Unknown Date') return 'Unknown Date';
  
  try {
    // For genealogy, we often have simple YYYY-MM-DD strings.
    // new Date("YYYY-MM-DD") is treated as UTC, which can cause shifts in local display.
    // If it's just a date, we parse it as local.
    let date: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Formats an ISO date string to just the year.
 */
export const formatYear = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.getFullYear().toString();
  } catch (error) {
    return '';
  }
};

/**
 * Validates a person's lifespan.
 */
export const validateLifespan = (
  birthDate: string | undefined | null,
  deathDate: string | undefined | null
): { isValid: boolean; error?: string } => {
  if (!birthDate && !deathDate) return { isValid: true };

  const now = new Date();
  
  if (birthDate) {
    const bDate = new Date(birthDate);
    if (!isNaN(bDate.getTime()) && bDate > now) {
      return { isValid: false, error: 'Birth date cannot be in the future' };
    }
  }

  if (deathDate) {
    const dDate = new Date(deathDate);
    if (!isNaN(dDate.getTime()) && dDate > now) {
      return { isValid: false, error: 'Death date cannot be in the future' };
    }
  }

  if (birthDate && deathDate) {
    const bDate = new Date(birthDate);
    const dDate = new Date(deathDate);
    
    if (!isNaN(bDate.getTime()) && !isNaN(dDate.getTime()) && dDate < bDate) {
      return { isValid: false, error: 'Death date cannot be before birth date' };
    }
  }

  return { isValid: true };
};
