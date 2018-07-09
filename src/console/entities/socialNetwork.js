/** @flow */

import _ from 'lodash';
import canonicalDomain from '../utils/canonicalDomain';

export const SOCIAL_NETWORKS = {
  LinkedIn: 'LinkedIn',
  Twitter: 'Twitter',
  GitHub: 'GitHub',
  Google: 'Google',
  Facebook: 'Facebook',
  Instagram: 'Instagram'
};

export type SocialNetwork = $Keys<typeof SOCIAL_NETWORKS>;

export const SOCIAL_NETWORK_ALIASES: { [string]: SocialNetwork } = {
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  github: 'GitHub',
  facebook: 'Facebook',
  instagram: 'Instagram',
  google: 'Google',
  fb: 'Facebook'
};

export const SOCIAL_NETWORK_DOMAINS: { [string]: SocialNetwork } = {
  'twitter.com': 'Twitter',
  'linkedin.com': 'LinkedIn',
  'facebook.com': 'Facebook',
  'instagram.com': 'Instagram',
  'google.com': 'Google',
  'github.com': 'GitHub'
};

export function urlToSocialNetwork(url: string): ?SocialNetwork {
  const domain = canonicalDomain(url);
  if (domain) {
    return domainToSocialNetwork(domain);
  } else {
    return null;
  }
}

export function domainToSocialNetwork(domain: string): ?SocialNetwork {
  if (domain in SOCIAL_NETWORK_DOMAINS) {
    return SOCIAL_NETWORK_DOMAINS[domain];
  } else {
    const parts = domain.split('.');
    if (parts.length > 2) {
      return domainToSocialNetwork(_.tail(parts).join('.'));
    } else {
      return null;
    }
  }
}

export function aliasToSocialNetwork(alias: string): ?SocialNetwork {
  const lcAlias = alias.toLowerCase();
  return lcAlias in SOCIAL_NETWORK_ALIASES
    ? SOCIAL_NETWORK_ALIASES[lcAlias]
    : null;
}
