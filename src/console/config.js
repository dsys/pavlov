export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_PORT = process.env.POSTGRES_PORT;
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;
export const POSTGRES_USERNAME_ADMIN = process.env.POSTGRES_USERNAME_ADMIN;
export const POSTGRES_PASSWORD_ADMIN = process.env.POSTGRES_PASSWORD_ADMIN;
export const POSTGRES_USERNAME_SANDBOX_R =
  process.env.POSTGRES_USERNAME_SANDBOX_R;
export const POSTGRES_PASSWORD_SANDBOX_R =
  process.env.POSTGRES_PASSWORD_SANDBOX_R;
export const POSTGRES_USERNAME_SANDBOX_RW =
  process.env.POSTGRES_USERNAME_SANDBOX_RW;
export const POSTGRES_PASSWORD_SANDBOX_RW =
  process.env.POSTGRES_PASSWORD_SANDBOX_RW;
export const POSTGRES_USERNAME_EXTERNAL_TASK_SANDBOX =
  process.env.POSTGRES_USERNAME_EXTERNAL_TASK_SANDBOX;
export const POSTGRES_PASSWORD_EXTERNAL_TASK_SANDBOX =
  process.env.POSTGRES_PASSWORD_EXTERNAL_TASK_SANDBOX;
export const POSTGRES_ENCRYPTION_PASSWORD =
  process.env.POSTGRES_ENCRYPTION_PASSWORD;

export const CSRF_ENCRYPTION_PASSWORD =
  process.env.CSRF_ENCRYPTION_PASSWORD;

export const JWT_PUBLIC_KEY = process.env.AUTH_JWT_PUBLIC_KEY;
export const JWT_PRIVATE_KEY = process.env.AUTH_JWT_PRIVATE_KEY;
export const JWT_EXPIRATION = process.env.AUTH_JWT_EXPIRATION || '2 years';
export const JWT_ALGORITHM = process.env.AUTH_JWT_ALGORITHM;
export const JWT_ISSUER = process.env.AUTH_JWT_ISSUER;

export const PBKDF2_ITERATIONS = process.env.AUTH_PBKDF2_ITERATIONS
  ? parseInt(process.env.AUTH_PBKDF2_ITERATIONS, 10)
  : 10000;

export const PBKDF2_KEY_LENGTH = process.env.AUTH_PBKDF2_KEY_LENGTH
  ? parseInt(process.env.AUTH_PBKDF2_KEY_LENGTH, 10)
  : 64;

export const PBKDF2_SALT_LENGTH = process.env.AUTH_PBKDF2_SALT_LENGTH
  ? parseInt(process.env.AUTH_PBKDF2_SALT_LENGTH, 10)
  : 16;

export const PBKDF2_DIGEST = process.env.AUTH_PBKDF2_DIGEST || 'sha512';

export const SALESFORCE_CLIENT_ID =
  process.env.SALESFORCE_CLIENT_ID;

export const SALESFORCE_CLIENT_SECRET =
  process.env.SALESFORCE_CLIENT_SECRET;

export const ZENDESK_CLIENT_ID =
  process.env.ZENDESK_CLIENT_ID;

export const ZENDESK_CLIENT_SECRET =
  process.env.ZENDESK_CLIENT_SECRET;

export const TALENTIQ_API_KEY =
  process.env.TALENTIQ_API_KEY;

export const PIPL_BUSINESS_API_KEY =
  process.env.PIPL_BUSINESS_API_KEY;

export const MAXMIND_API_KEY = process.env.MAXMIND_API_KEY;

export const MAXMIND_USER_ID = process.env.MAXMIND_USER_ID;

export const MAILGUN_DEFAULT_FROM =
  process.env.MAILGUN_DEFAULT_FROM;

export const MAILGUN_API_KEY =
  process.env.MAILGUN_API_KEY;

export const MAILGUN_DOMAIN =
  process.env.MAILGUN_DOMAIN;

export const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
export const GCP_IMAGES_BUCKET =
  process.env.GCP_IMAGES_BUCKET;
export const GCP_IMAGE_ARTIFACTS_BUCKET =
  process.env.GCP_IMAGES_BUCKET;
export const GCP_SIGNED_URL_EXPIRES =
  process.env.GCP_SIGNED_URL_EXPIRES || '2 days';

export const MAX_UPLOAD_SIZE = process.env.MAX_UPLOAD_SIZE
  ? parseInt(process.env.MAX_UPLOAD_SIZE, 10)
  : 8 * 1024 * 1024; // 8 MiB

export const MAX_UPLOAD_COUNT = process.env.MAX_UPLOAD_COUNT
  ? parseInt(process.env.MAX_UPLOAD_COUNT, 10)
  : 4;

export const BASE_URL = process.env.BASE_URL || 'http://localhost:9002';
export const API_BASE_URL =
  process.env.API_BASE_URL || 'http://localhost:9002/v1';
export const HTTPS_BASE_URL =
  process.env.HTTPS_BASE_URL ||
  process.env.BASE_URL ||
  'https://localhost:9102';

export default exports;
