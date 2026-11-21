type ClassValue = string | false | null | undefined | 0;

/**
 * Joins truthy class names. Intentionally tiny — components avoid conflicting
 * utilities instead of relying on a merge library.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
