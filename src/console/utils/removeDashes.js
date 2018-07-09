/** @flow */

/**
 * Removes dashes from a string.
 *
 * Often used for converting PostgreSQL UUIDs into our canonical representation
 * of UUIDs.
 *
 * @param str the string
 * @returns the string without dashes
 */
export default function removeDashes(str: string): string {
  return str.replace(/-/g, '');
}
