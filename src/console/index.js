#! /usr/bin/env node

import 'babel-polyfill';
import './raven';
import enableDestroy from 'server-destroy';
import log from './log';
import router from './router';

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
const HTTP_PORT = parseInt(process.env.HTTP_PORT, 10) || 8080;
const HTTPS_PORT = parseInt(process.env.HTTPS_PORT, 10) || 8081;

if (__DEV__) {
  const https = require('https');
  const fs = require('fs');

  const server = router.listen(HTTP_PORT, err => {
    if (err) {
      log.fatal(err);
      process.exit(1);
    } else {
      log.info('HTTP server listening on port %s', HTTP_PORT);
    }
  });

  const httpsServer = https
    .createServer(
      {
        key: fs.readFileSync('../../etc/localhost/localhost.key'),
        cert: fs.readFileSync('../../etc/localhost/localhost.crt')
      },
      router
    )
    .listen(HTTPS_PORT, err => {
      if (err) {
        log.fatal(err);
        process.exit(1);
      } else {
        log.info('HTTPS server listening on port %s', HTTPS_PORT);
      }
    });

  enableDestroy(server);
  enableDestroy(httpsServer);
} else {
  const { ApolloEngine } = require('apollo-engine');
  const engine = new ApolloEngine({
    apiKey: process.env.APOLLO_ENGINE_API_KEY
  });

  engine.listen(
    {
      port: HTTP_PORT,
      expressApp: router,
      graphqlPaths: ['/v1/graphql']
    },
    () => {
      log.info('HTTP server listening on port %s', HTTP_PORT);
    }
  );

  engine.once('error', err => {
    log.fatal(err);
    process.exit(1);
  });

  enableDestroy(engine);
}

for (const signal of SHUTDOWN_SIGNALS) {
  process.once(signal, () => {
    log.info('received signal %s, exiting', signal);
    process.exit(0);
  });
}

process.once('unhandledRejection', (reason, p) => {
  p.catch(err => {
    log.fatal(err, 'exiting due to unhandled rejection');
    process.exit(1);
  });
});

process.once('uncaughtException', err => {
  log.fatal(err, 'exiting due to uncaught exception');
  process.exit(1);
});
