/** @flow */

import q from './queries';
import { sandboxPG, externalTaskSandboxPG } from './postgres';
import { UnauthorizedError } from '../errors';

export type AuthToken = any;
export type QueryContext = any;
export type QueryFile = any;

export function createGuestQueryContext(): QueryContext {
  return {
    tx: fn => {
      throw new UnauthorizedError();
    },
    none: (...args) => {
      throw new UnauthorizedError();
    },
    one: (...args) => {
      throw new UnauthorizedError();
    },
    oneOrNone: (...args) => {
      throw new UnauthorizedError();
    },
    many: (...args) => {
      throw new UnauthorizedError();
    },
    manyOrNone: (...args) => {
      throw new UnauthorizedError();
    }
  };
}

export function createSandboxQueryContext(authToken: AuthToken): QueryContext {
  return {
    tx: fn =>
      sandboxPG.tx(t => {
        t.none(q.setAuthToken, authToken);
        return fn(t);
      }),
    none: (...args) =>
      sandboxPG.task(t => {
        t.none(q.setAuthToken, authToken);
        return t.none(...args);
      }),
    one: (...args) =>
      sandboxPG.task(t => {
        t.none(q.setAuthToken, authToken);
        return t.one(...args);
      }),
    oneOrNone: (...args) =>
      sandboxPG.task(t => {
        t.none(q.setAuthToken, authToken);
        return t.oneOrNone(...args);
      }),
    many: (...args) =>
      sandboxPG.task(t => {
        t.none(q.setAuthToken, authToken);
        return t.many(...args);
      }),
    manyOrNone: (...args) =>
      sandboxPG.task(t => {
        t.none(q.setAuthToken, authToken);
        return t.manyOrNone(...args);
      })
  };
}

export function createExternalTaskSandboxQueryContext(
  authToken: AuthToken
): QueryContext {
  return {
    tx: fn =>
      externalTaskSandboxPG.tx(t => {
        t.none(q.setExternalTaskAuthToken, authToken);
        return fn(t);
      }),
    none: (...args) =>
      externalTaskSandboxPG.task(t => {
        t.none(q.setExternalTaskAuthToken, authToken);
        return t.none(...args);
      }),
    one: (...args) =>
      externalTaskSandboxPG.task(t => {
        t.none(q.setExternalTaskAuthToken, authToken);
        return t.one(...args);
      }),
    oneOrNone: (...args) =>
      externalTaskSandboxPG.task(t => {
        t.none(q.setExternalTaskAuthToken, authToken);
        return t.oneOrNone(...args);
      }),
    many: (...args) =>
      externalTaskSandboxPG.task(t => {
        t.none(q.setExternalTaskAuthToken, authToken);
        return t.many(...args);
      }),
    manyOrNone: (...args) =>
      externalTaskSandboxPG.task(t => {
        t.none(q.setExternalTaskAuthToken, authToken);
        return t.manyOrNone(...args);
      })
  };
}
