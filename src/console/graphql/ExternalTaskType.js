/** @flow */

import type { ExternalTaskTypeRow } from '../rows';

import { encodeId } from '../identifiers';

export default {
  id(externalTaskTypeRow: ExternalTaskTypeRow) {
    return encodeId('ETT', externalTaskTypeRow.id);
  }
};
