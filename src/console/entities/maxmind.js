/** @flow */

import fetch from 'node-fetch';
import log from '../log';
import { MAXMIND_API_KEY, MAXMIND_USER_ID } from '../config';

import type {
  IPAddressEntitySpec,
  OrganizationEntitySpec,
  WebsiteEntitySpec
} from './specs';

/** Base URL for the MaxMind GeoIP2 API. */
const BASE_URL = 'https://geoip.maxmind.com/geoip/v2.1/city/';

/** Timeout for requests to the MaxMind GeoIP2 API. */
const REQUEST_TIMEOUT = 5 * 1000;

/** Credentials for the MaxMind GeoIP2 API. */
const MAXMIND_CREDS = Buffer.from(
  `${MAXMIND_USER_ID}:${MAXMIND_API_KEY}`
).toString('base64');

export type MaxmindResponse = {
  '@id': string,
  city?: MaxmindCity,
  continent?: MaxmindContinent,
  country?: MaxmindCountry,
  location?: MaxmindLocation,
  postal?: MaxmindPostal,
  subdivisions?: Array<MaxmindSubdivision>,
  traits: MaxmindTraits
};

export type MaxmindGeoNames = {
  en: string
};

export type MaxmindCity = {
  geoname_id?: number,
  names: MaxmindGeoNames
};

export type MaxmindContinent = {
  code?: string,
  geoname_id?: number,
  names: MaxmindGeoNames
};

export type MaxmindCountry = {
  iso_code?: string,
  geoname_id?: number,
  names: MaxmindGeoNames
};

export type MaxmindSubdivision = {
  iso_code?: string,
  geoname_id?: number,
  names: MaxmindGeoNames
};

export type MaxmindLocation = {
  accuracy_radius?: number,
  latitude?: number,
  longitude?: number,
  metro_code?: number,
  time_zone?: string
};

export type MaxmindPostal = {
  code?: string
};

export type MaxmindTraits = {
  autonomous_system_number?: number,
  autonomous_system_organization?: string,
  domain?: string,
  isp?: string,
  organization?: string,
  ip_address?: string
};

/** Normalizes a MaxMind response body into an IP address spec. */
export function normalizeMaxmindResponse(
  t: MaxmindResponse
): IPAddressEntitySpec {
  return {
    name: t.traits.ip_address,
    ipAddress: t.traits.ip_address,
    website: t.traits.domain ? normalizeMaxmindWebsite(t.traits.domain) : null,
    location: {
      continent: t.continent && t.continent.names ? t.continent.names.en : null,
      country: t.country && t.country.names ? t.country.names.en : null,
      locality: t.city && t.city.names ? t.city.names.en : null,
      latitude:
        t.location && t.location.latitude
          ? t.location.latitude.toString()
          : null,
      longitude:
        t.location && t.location.longitude
          ? t.location.longitude.toString()
          : null,
      postalCode: t.postal ? t.postal.code : null,
      state:
        t.subdivisions && t.subdivisions.length > 0
          ? t.subdivisions[0].names.en
          : null,
      name: null,
      timezone: null,
      isPrimary: null,
      poBox: null,
      region: null,
      streetAddress: null,
      type: null
    },
    organization: t.traits.organization
      ? normalizeMaxmindOrganization(t.traits.organization)
      : null,
    asNumber: null,
    asOrg: null,
    isp: t.traits.isp ? normalizeMaxmindOrganization(t.traits.isp) : null
  };
}

/** Normalizes an organization's name from the MaxMind GeoIP2 API into a spec. */
export function normalizeMaxmindOrganization(
  org: string
): OrganizationEntitySpec {
  return {
    name: org,
    alexaGlobalRank: null,
    alexaUSRank: null,
    dbas: [],
    description: null,
    emails: [],
    employeeCount: null,
    foundingDate: null,
    images: [],
    industries: [],
    legalName: null,
    locations: [],
    marketCap: null,
    phoneNumbers: [],
    products: [],
    raised: null,
    socialProfiles: [],
    websites: []
  };
}

/** Normalizes a website reference from the MaxMind GeoIP2 API into a spec. */
export function normalizeMaxmindWebsite(domain: string): WebsiteEntitySpec {
  return {
    name: null,
    domain,
    type: null,
    url: domain
  };
}

/** Enrich the IP address using the MaxMind GeoIP2 API. */
export async function enrichIP(address: string): Promise<?IPAddressEntitySpec> {
  const res = await fetch(BASE_URL + address, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${MAXMIND_CREDS}`
    },
    timeout: REQUEST_TIMEOUT
  });

  if (!res.ok) {
    log.warn(
      { status: res.status, address },
      `error using MaxMind GeoIP2 for IP address enrichment: ${res.status}`
    );

    return null;
  }

  const maxmindRes: MaxmindResponse = await res.json();
  if (maxmindRes) {
    return normalizeMaxmindResponse(maxmindRes);
  } else {
    return null;
  }
}
