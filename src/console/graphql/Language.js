/** @flow */

import { encodeId } from '../identifiers';

import type { LanguageEntityRow } from '../rows';

export default {
  id(languageRow: LanguageEntityRow): string {
    return encodeId('LNG', languageRow.id);
  },
  display(languageRow: LanguageEntityRow): string {
    return languageRow.name;
  },
  name(languageRow: LanguageEntityRow): ?string {
    return languageRow.name;
  }
};
