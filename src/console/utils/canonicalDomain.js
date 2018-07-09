/** @flow */

import { URL } from 'url';

export default function canonicalDomain(url: string): ?string {
  const u = new URL(url);
  return u.hostname;
}
