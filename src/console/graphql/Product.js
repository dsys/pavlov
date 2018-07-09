/** @flow */

import { encodeId } from '../identifiers';

import type { ProductEntityRow, WebsiteEntityRow } from '../rows';

export default {
  id(productRow: ProductEntityRow): string {
    return encodeId('PRD', productRow.id);
  },
  display(productRow: ProductEntityRow): string {
    return productRow.name;
  },
  name(productRow: ProductEntityRow): string {
    return productRow.name;
  },
  website(productRow: ProductEntityRow): ?WebsiteEntityRow {
    // TODO: Implement me!
    return null;
  }
};
