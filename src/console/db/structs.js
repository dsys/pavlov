import removeDashes from '../utils/removeDashes';
import t from 'tcomb';

/**
 * User represents a user of the Pavlov product.
 */
export const User = t.struct(
  {
    id: t.String,
    username: t.String,
    passwordHash: t.String,
    passwordSalt: t.String,
    primaryEmail: t.String,
    primaryEmailVerified: t.Boolean,
    preferredName: t.String,
    emailVerificationCode: t.String,
    icon: t.String,
    iconImageId: t.maybe(t.String),
    createdAt: t.Date,
    updatedAt: t.Date
  },
  'User'
);

/**
 * AuthToken represents an authorization given by a User used to make requests
 * on behalf of them.
 */
export const AuthToken = t.struct(
  {
    id: t.String,
    userId: t.String,
    secret: t.maybe(t.String),
    issuer: t.String,
    audience: t.String,
    createdAt: t.Date,
    expiresAt: t.Date
  },
  'AuthToken'
);

/**
 * Database represents the highest level of organization for managing data with
 * Pavlov.
 */
export const Database = t.struct(
  {
    id: t.String,
    name: t.String,
    icon: t.String,
    iconImageId: t.maybe(t.String),
    inviteCode: t.String,
    createdAt: t.Date,
    updatedAt: t.Date
  },
  'Database'
);

/**
 * DatabaseGrant represents an authorization to access a Database.
 */
export const DatabaseGrant = t.struct(
  {
    id: t.String,
    permissions: t.String,
    userId: t.String,
    databaseId: t.String,
    createdAt: t.Date,
    updatedAt: t.Date
  },
  'DatabaseGrant'
);

/**
 * Converts a PostgreSQL row to a User.
 * @param {Object} row the row to convert
 * @returns {User} the new User
 */
export function rowToUser(row) {
  return User({
    id: removeDashes(row.id),
    username: row.username,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    primaryEmail: row.primary_email,
    primaryEmailVerified: row.email_verified,
    preferredName: row.preferred_name,
    emailVerificationCode: row.email_verification_code,
    icon: row.icon,
    iconImageId: row.icon_image_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}

/**
 * Converts a PostgreSQL row to an AuthToken.
 * @param {Object} row the row to convert
 * @returns {AuthToken} the new AuthToken
 */
export function rowToAuthToken(row) {
  return AuthToken({
    id: removeDashes(row.id),
    userId: removeDashes(row.user_id),
    secret: removeDashes(row.secret),
    issuer: row.issuer,
    audience: row.audience,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  });
}

/**
 * Converts a PostgreSQL row to a Database.
 * @param {Object} row the row to convert
 * @returns {Database} the new Database
 */
export function rowToDatabase(row) {
  return Database({
    id: removeDashes(row.id),
    name: row.name,
    icon: row.icon,
    iconImageId: row.icon_image_id,
    inviteCode: row.invite_code,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}

/**
 * Converts a PostgreSQL row to a DatabaseGrant.
 * @param {Object} row the row to convert
 * @returns {DatabaseGrant} the new DatabaseGrant
 */
export function rowToDatabaseGrant(row) {
  return DatabaseGrant({
    id: removeDashes(row.id),
    permissions: row.permissions,
    userId: removeDashes(row.user_id),
    databaseId: removeDashes(row.database_id),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}
