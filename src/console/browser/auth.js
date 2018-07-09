import cookie from 'cookie-cutter';
import queryString from 'query-string';

const LOCALSTORAGE_KEY = 'pavlov.authToken';
const COOKIE_KEY = 'pavlov.signedAuthToken';
const AUTH_LISTENERS = [];

let CURRENT_AUTH = (() => {
  const qsParams = queryString.parse(window.location.search);
  const qsAuthToken = qsParams['authToken'];
  if (qsAuthToken) {
    return { signedAuthToken: qsAuthToken };
  }

  try {
    const val = window.localStorage.getItem('pavlov.authToken') || 'null';
    return JSON.parse(val) || null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    window.localStorage.setItem(LOCALSTORAGE_KEY, 'null');

    return null;
  }
})();

export function isAuthenticated() {
  return !!CURRENT_AUTH;
}

export function useAuth(auth) {
  CURRENT_AUTH = auth;

  const val = JSON.stringify(auth);
  window.localStorage.setItem(LOCALSTORAGE_KEY, val);

  for (const listener of AUTH_LISTENERS) {
    listener(auth);
  }
}

export function getAuthHeader() {
  return CURRENT_AUTH && CURRENT_AUTH.signedAuthToken
    ? `Bearer ${CURRENT_AUTH.signedAuthToken}`
    : null;
}

export function getCurrentAuthTokenId() {
  return CURRENT_AUTH ? CURRENT_AUTH.authTokenId : null;
}

export function setAuthSessionCookie() {
  cookie.set(COOKIE_KEY, CURRENT_AUTH ? CURRENT_AUTH.signedAuthToken : '', {
    path: '/'
  });
}

export function addAuthListener(listener) {
  AUTH_LISTENERS.push(listener);
}

export function removeAuthListener(listener) {
  const i = AUTH_LISTENERS.indexOf(listener);
  AUTH_LISTENERS.splice(i, 1);
}
