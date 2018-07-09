/** @flow */

import type { Loaders } from '../loaders';

export type GraphQLContext = {|
  loaders: Loaders,
  adminLoaders: Loaders
|};
