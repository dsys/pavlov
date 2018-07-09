import pgMonitor from 'pg-monitor';
import pgPromise from 'pg-promise';
import q from './queries';
import { UnauthorizedError } from '../errors';
import {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DATABASE,
  POSTGRES_USERNAME_ADMIN,
  POSTGRES_PASSWORD_ADMIN,
  POSTGRES_USERNAME_SANDBOX_RW,
  POSTGRES_PASSWORD_SANDBOX_RW,
  POSTGRES_USERNAME_EXTERNAL_TASK_SANDBOX,
  POSTGRES_PASSWORD_EXTERNAL_TASK_SANDBOX
} from '../config';

const options = {};

const PGP = pgPromise(options);

if (__DEV__) {
  pgMonitor.attach(options);
}

process.once('exit', () => {
  PGP.end();
});

export const adminPG = PGP({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: POSTGRES_DATABASE,
  user: POSTGRES_USERNAME_ADMIN,
  password: POSTGRES_PASSWORD_ADMIN,
  max: process.env.POSTGRES_ADMIN_CONNECTIONS_MAX
    ? parseInt(process.env.POSTGRES_ADMIN_CONNECTIONS_MAX, 10)
    : 10,
  min: process.env.POSTGRES_ADMIN_CONNECTIONS_MIN
    ? parseInt(process.env.POSTGRES_ADMIN_CONNECTIONS_MIN, 10)
    : 3
});

export const sandboxPG = PGP({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: POSTGRES_DATABASE,
  user: POSTGRES_USERNAME_SANDBOX_RW,
  password: POSTGRES_PASSWORD_SANDBOX_RW,
  max: process.env.POSTGRES_SANDBOX_CONNECTIONS_MAX
    ? parseInt(process.env.POSTGRES_SANDBOX_CONNECTIONS_MAX, 10)
    : 10,
  min: process.env.POSTGRES_SANDBOX_CONNECTIONS_MIN
    ? parseInt(process.env.POSTGRES_SANDBOX_CONNECTIONS_MIN, 10)
    : 3
});

export const externalTaskSandboxPG = PGP({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: POSTGRES_DATABASE,
  user: POSTGRES_USERNAME_EXTERNAL_TASK_SANDBOX,
  password: POSTGRES_PASSWORD_EXTERNAL_TASK_SANDBOX,
  max: process.env.POSTGRES_EXTERNAL_TASK_SANDBOX_CONNECTIONS_MAX
    ? parseInt(process.env.POSTGRES_EXTERNAL_TASK_SANDBOX_CONNECTIONS_MAX, 10)
    : 10,
  min: process.env.POSTGRES_EXTERNAL_TASK_SANDBOX_CONNECTIONS_MIN
    ? parseInt(process.env.POSTGRES_EXTERNAL_TASK_SANDBOX_CONNECTIONS_MIN, 10)
    : 3
});

export function withSandbox(authToken, fn) {
  if (authToken) {
    return sandboxPG.task(async t => {
      await t.none(q.setAuthToken, authToken);
      return fn(t);
    });
  } else {
    return Promise.reject(new UnauthorizedError());
  }
}
