import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInYears } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates age based on a date string (e.g., ISO string).
 * @param dateString - The date of birth string.
 * @returns The calculated age as a number, or null if the date is invalid.
 */
export function calculateAge(dateString: string | undefined | null): number | null {
  if (!dateString) return null;
  try {
    const birthDate = new Date(dateString);
    const age = differenceInYears(new Date(), birthDate);
    // Basic validation: ensure the date parsed correctly and age is reasonable
    if (isNaN(age) || age < 0 || age > 150) {
        return null;
    }
    return age;
  } catch (error) {
    console.error("Error calculating age:", error);
    return null;
  }
}
