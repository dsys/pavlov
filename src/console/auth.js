import jwt from 'jsonwebtoken';
import { JWT_ISSUER, JWT_PRIVATE_KEY, JWT_ALGORITHM } from './config';
import { encodeId } from './identifiers';

export function signAuthToken(authToken) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        jti: authToken.id,
        aud: authToken.audience,
        iss: JWT_ISSUER,
        sec: authToken.secret,
        sub: authToken.userId,
        iat: Math.floor(authToken.createdAt.getTime() / 1000),
        exp: Math.floor(authToken.expiresAt.getTime() / 1000)
      },
      JWT_PRIVATE_KEY,
      { algorithm: JWT_ALGORITHM },
      (err, signedAuthToken) => {
        if (err) {
          reject(err);
        } else {
          resolve(signedAuthToken);
        }
      }
    );
  });
}

export function signExternalTaskAuthToken(externalTaskAuthToken) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        jti: encodeId('ETA', externalTaskAuthToken.id),
        aud: externalTaskAuthToken.audience,
        iss: JWT_ISSUER,
        sec: externalTaskAuthToken.secret,
        sub: encodeId('EXT', externalTaskAuthToken.external_task_id),
        iat: Math.floor(externalTaskAuthToken.created_at.getTime() / 1000),
        exp: Math.floor(externalTaskAuthToken.expires_at.getTime() / 1000)
      },
      JWT_PRIVATE_KEY,
      { algorithm: JWT_ALGORITHM },
      (err, signedAuthToken) => {
        if (err) {
          reject(err);
        } else {
          resolve(signedAuthToken);
        }
      }
    );
  });
}
