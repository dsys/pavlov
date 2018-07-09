/** @flow */

import pgp from 'pg-promise';

/**
 * Formats a SQL query using a tagged literal.
 */
export default function sql(
  parts: Array<string>,
  ...values: Array<mixed>
): string {
  const query = parts.reduce((result, part, i) => `${result}$${i}${part}`);
  return pgp.as.format(query, values);
}

sql.as = pgp.as;
