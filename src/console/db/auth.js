import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import q from './queries';
import { adminPG } from './postgres';
import { encodeId, decodeIdOfType } from '../identifiers';
import {
  checkInviteCode,
  checkUsername,
  checkPassword,
  checkEmail
} from '../utils/checkCredentials';
import {
  AuthToken,
  rowToUser,
  rowToAuthToken,
  rowToDatabase,
  rowToDatabaseGrant
} from './structs';
import {
  JWT_ALGORITHM,
  JWT_ISSUER,
  JWT_PUBLIC_KEY,
  JWT_PRIVATE_KEY,
  JWT_EXPIRATION,
  PBKDF2_DIGEST,
  PBKDF2_ITERATIONS,
  PBKDF2_KEY_LENGTH,
  PBKDF2_SALT_LENGTH
} from '../config';

export async function generateSalt() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(PBKDF2_SALT_LENGTH, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString('base64'));
      }
    });
  });
}

export async function hashPassword(password, salt) {
  if (!salt) {
    salt = await generateSalt();
  }

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      PBKDF2_ITERATIONS,
      PBKDF2_KEY_LENGTH,
      PBKDF2_DIGEST,
      (err, key) => {
        if (err) {
          reject(err);
        } else {
          const hash = key.toString('base64');
          resolve({ hash, salt });
        }
      }
    );
  });
}

export function signAuthToken(authToken) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        jti: encodeId('ATH', authToken.id),
        sec: encodeId('SEC', authToken.secret),
        sub: encodeId('USR', authToken.userId),
        aud: authToken.audience,
        iss: JWT_ISSUER,
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

/**
 * Validates an signed AuthToken by decrypting it.
 *
 * This method does not look up the token in PostgreSQL to check for whether or
 * not it has been invalidated. This allows us to avoid an extra query per
 * request, and rely on PostgreSQL's row-level security feature.
 *
 * @param {string} signedAuthToken the signed AuthToken, encoded as a JWT
 * @returns {Promise<?AuthToken>} the decrypted AuthToken, or null if invalid
 */
export function useSignedAuthToken(signedAuthToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      signedAuthToken,
      JWT_PUBLIC_KEY,
      { algorithms: [JWT_ALGORITHM], issuer: JWT_ISSUER },
      (err, decoded) => {
        if (err || !decoded) {
          resolve(null);
        } else {
          try {
            const authToken = AuthToken({
              id: decodeIdOfType('ATH', decoded.jti),
              userId: decodeIdOfType('USR', decoded.sub),
              secret: decodeIdOfType('SEC', decoded.sec),
              issuer: decoded.iss,
              audience: decoded.aud,
              createdAt: new Date(decoded.iat * 1000),
              expiresAt: new Date(decoded.exp * 1000)
            });

            resolve(authToken);
          } catch (err) {
            try {
              const authToken = {
                id: decodeIdOfType('ETA', decoded.jti),
                externalTaskId: decodeIdOfType('EXT', decoded.sub),
                secret: decoded.sec,
                issuer: decoded.iss,
                audience: decoded.aud,
                createdAt: new Date(decoded.iat * 1000),
                expiresAt: new Date(decoded.exp * 1000)
              };

              resolve(authToken);
            } catch (err) {
              reject(null);
            }
          }
        }
      }
    );
  });
}

export async function findUser(userId) {
  const row = await adminPG.oneOrNone(q.findUser, { userId });
  return row ? rowToUser(row) : null;
}

export async function findUserByUsername(username) {
  const row = await adminPG.oneOrNone(q.findUserByUsername, { username });
  return row ? rowToUser(row) : null;
}

export async function createUser({
  username,
  password,
  email,
  preferredName,
  inviteCode,
  audience
}) {
  const icCheck = await checkInviteCode(inviteCode);
  if (!icCheck.ok) {
    return { ok: false, warning: icCheck.warning };
  }

  const pwCheck = checkPassword(password);
  if (!pwCheck.ok) {
    return { ok: false, warning: pwCheck.warning };
  }

  const unCheck = await checkUsername(username);
  if (!unCheck.ok) {
    return { ok: false, warning: unCheck.warning };
  }

  const emCheck = await checkEmail(icCheck.database, email);
  if (!emCheck.ok) {
    return { ok: false, warning: emCheck.warning };
  }

  const { hash, salt } = await hashPassword(password);

  return adminPG.tx(async t => {
    const userRow1 = await t.oneOrNone(q.createUser, {
      username,
      passwordHash: hash,
      passwordSalt: salt,
      primaryEmail: emCheck.normalized,
      preferredName: preferredName.trim()
    });

    // const databaseRow = await t.one(q.createDatabase, { name: databaseName });
    const databaseRow = icCheck.database;

    const dbGrantRow = await t.one(q.createDatabaseGrant, {
      userId: userRow1.id,
      databaseId: databaseRow.id
    });

    const userRow2 = await t.one(q.updateUserDefaultDatabase, {
      id: userRow1.id,
      defaultDatabaseId: databaseRow.id
    });

    const authTokenRow = await t.one(q.createAuthToken, {
      userId: userRow1.id,
      audience,
      issuer: JWT_ISSUER,
      expiresIn: JWT_EXPIRATION
    });

    const authToken = rowToAuthToken(authTokenRow);
    const signedAuthToken = await signAuthToken(authToken);

    return {
      ok: true,
      warning: '',
      user: rowToUser(userRow2),
      database: rowToDatabase(databaseRow),
      databaseGrant: rowToDatabaseGrant(dbGrantRow),
      authToken,
      signedAuthToken
    };
  });
}

export async function createAuthToken({
  userId,
  username,
  password,
  audience
}) {
  const user = userId
    ? await findUser(userId)
    : await findUserByUsername(username);

  if (!user) {
    return {
      ok: false,
      warning: 'wrong username/password',
      authToken: null,
      signedAuthToken: null
    };
  }

  const { hash } = await hashPassword(password, user.passwordSalt);
  if (hash !== user.passwordHash) {
    return {
      ok: false,
      warning: 'wrong username/password',
      authToken: null,
      signedAuthToken: null
    };
  }

  const row = await adminPG.one(q.createAuthToken, {
    userId: user.id,
    audience,
    issuer: JWT_ISSUER,
    expiresIn: JWT_EXPIRATION
  });

  const authToken = rowToAuthToken(row);
  const signedAuthToken = await signAuthToken(authToken);

  return { ok: true, warning: '', authToken, signedAuthToken };
}

export async function verifyEmail(verificationCode) {
  const row = await adminPG.oneOrNone(
    q.users.updateEmailVerified,
    verificationCode
  );

  if (row) {
    return { ok: true, warning: '' };
  } else {
    return { ok: false, warning: 'Invalid or expired verification code.' };
  }
}

export async function regenerateEmailVerificationCode(user) {
  const row = await adminPG.oneOrNone(
    q.users.updateEmailVerificationCode,
    user.id
  );
  return rowToUser(row);
}
