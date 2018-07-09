/** @flow */

import { encodeId } from '../identifiers';

import type { IndustryEntityRow } from '../rows';

export default {
  id(industryRow: IndustryEntityRow): string {
    return encodeId('IND', industryRow.id);
  },
  display(industryRow: IndustryEntityRow): string {
    return industryRow.name;
  },
  name(industryRow: IndustryEntityRow): ?string {
    return industryRow.name;
  }
};
