import StorageSandbox from '../db/sandbox';
import bodyParser from 'body-parser';
import log from '../log';
import parseUA from 'ua-parser-js';
import { adminPG } from '../db/postgres';
import { createLoaders } from '../loaders';
import { graphqlExpress } from 'apollo-server-express';
import { schema } from '../graphql';
import {
  createExternalTaskSandboxQueryContext,
  createGuestQueryContext,
  createSandboxQueryContext
} from '../db/context';

export default [
  bodyParser.json(),
  bodyParser.text({ type: 'application/graphql' }),
  (req, res, next) => {
    if (req.is('application/graphql')) {
      req.body = { query: req.body };
    }
    next();
  },
  graphqlExpress(req => {
    // TODO: Deprecate legacy UA and sandbox. Use loaders instead.
    const ua = parseUA(req.headers['user-agent']);
    const sandbox = new StorageSandbox(req.authToken);

    const sandboxContext = req.authToken
      ? req.authToken.externalTaskId
        ? createExternalTaskSandboxQueryContext(req.authToken)
        : createSandboxQueryContext(req.authToken)
      : createGuestQueryContext();
    const loaders = createLoaders(sandboxContext);
    const adminLoaders = createLoaders(adminPG);

    return {
      debug: false,
      schema,
      tracing: true,
      cacheControl: true,
      context: {
        files: req.files || [],
        ua,
        sandbox,
        loaders,
        adminLoaders,
        authToken: req.authToken
      },
      formatError(err) {
        log.warn(err, 'error in GraphQL query');
        return err;
      }
    };
  })
];
