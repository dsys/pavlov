/** @flow */

import queryString from 'query-string';
import fetch from 'node-fetch';
import log from '../../log';

const GOOGLE_SEARCH_KEY =
  process.env.GOOGLE_SEARCH_KEY || '';

const GOOGLE_SEARCH_ENGINE_ID =
  process.env.GOOGLE_SEARCH_ENGINE_ID || '';

const GOOGLE_SEARCH_API_ENDPOINT = `https://www.googleapis.com/customsearch/v1`;

const GOOGLE_SEARCH_QUERY_PARAMS = {
  key: GOOGLE_SEARCH_KEY,
  cx: GOOGLE_SEARCH_ENGINE_ID,
  searchType: 'image'
};

const GOOGLE_SEARCH_TIMEOUT = 10 * 1000; // 10 seconds

export async function imageSearch(searchTerm: string): Promise<Array<string>> {
  const qString = queryString.stringify({
    ...GOOGLE_SEARCH_QUERY_PARAMS,
    q: searchTerm
  });

  const searchURL = `${GOOGLE_SEARCH_API_ENDPOINT}?${qString}`;
  const response = await fetch(searchURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: GOOGLE_SEARCH_TIMEOUT
  });

  const jsonRes = await response.json();
  if (jsonRes.items) return jsonRes.items;

  log.warn(
    `received unexpected response from Google Image search: ${JSON.stringify(
      jsonRes
    )}`
  );
  return [];
}
