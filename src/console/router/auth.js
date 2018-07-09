import { useSignedAuthToken } from '../db/auth';

const AUTHORIZATION_REGEX = /^(Bearer|Basic) (.+)$/;
const BASIC_REGEX = /^([^:]*):(.*)$/;

function parseAuthHeader(header) {
  const match = AUTHORIZATION_REGEX.exec(header);
  if (!match) {
    return null;
  }

  let token;
  if (match[1] === 'Bearer') {
    token = match[2];
  } else {
    const basicDecoded = Buffer.from(match[2], 'base64').toString();
    const basic = BASIC_REGEX.exec(basicDecoded);
    if (!basic) {
      return null;
    }

    token = basic[1] || basic[2];
  }

  return token;
}

export default function authMiddleware(req, res, next) {
  const authHeader = req.header('authorization') || '';
  const signedAuthToken = parseAuthHeader(authHeader);

  if (!signedAuthToken) {
    req.authToken = null;
    return next();
  }

  useSignedAuthToken(signedAuthToken)
    .then(authToken => {
      if (authToken) {
        req.authToken = authToken;
        next();
      } else {
        res.status(401);
        res.set('WWW-Authenticate', 'Basic realm=Pavlov');
        res.send('unauthorized');
      }
    })
    .catch(next);
}
