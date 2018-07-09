/** @flow */

import { encodeId } from '../identifiers';

import type { GraphQLContext } from './context';
import type { ProductEntityRow, SocialProfileEntityRow } from '../rows';

function getPrimaryAlias(socialProfileRow: SocialProfileEntityRow): ?string {
  return socialProfileRow.aliases.length > 0
    ? socialProfileRow.aliases[0]
    : null;
}

export default {
  id(socialProfileRow: SocialProfileEntityRow): string {
    return encodeId('SOC', socialProfileRow.id);
  },
  async display(
    socialProfileRow: SocialProfileEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<string> {
    const primaryAlias =
      getPrimaryAlias(socialProfileRow) || 'A social profile';
    let socialNetworkName = 'a social network';
    if (socialProfileRow.network_id) {
      const socialNetwork = await loaders.product.load(
        socialProfileRow.network_id
      );
      socialNetworkName = socialNetwork.name;
    }
    return `${primaryAlias} on ${socialNetworkName}`;
  },
  primaryAlias(socialProfileRow: SocialProfileEntityRow): ?string {
    return getPrimaryAlias(socialProfileRow);
  },
  aliases(socialProfileRow: SocialProfileEntityRow): Array<string> {
    return socialProfileRow.aliases;
  },
  bio(socialProfileRow: SocialProfileEntityRow): ?string {
    return socialProfileRow.bio;
  },
  followers(socialProfileRow: SocialProfileEntityRow): ?number {
    return socialProfileRow.followers;
  },
  isActive(socialProfileRow: SocialProfileEntityRow): ?boolean {
    return socialProfileRow.is_active;
  },
  network(
    socialProfileRow: SocialProfileEntityRow,
    args: {},
    { loaders }: GraphQLContext
  ): Promise<?ProductEntityRow> {
    return socialProfileRow.network_id
      ? loaders.product.load(socialProfileRow.network_id)
      : Promise.resolve(null);
  },
  url(socialProfileRow: SocialProfileEntityRow): ?string {
    return socialProfileRow.url;
  }
};
