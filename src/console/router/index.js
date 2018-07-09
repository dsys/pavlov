import asyncMiddleware from './async';
import authMiddleware from './auth';
import bodyParser from 'body-parser';
import bunyanMiddleware from 'bunyan-middleware';
import cors from 'cors';
import dataDropMiddleware from './data-drop';
import express from 'express';
// import forceSSL from 'force-ssl';
import graphqlMiddleware from './graphql';
import log from '../log';
import methodOverride from 'method-override';
import path from 'path';
import reindexMiddleware from './reindex';
import routesMiddleware from './routes';
import serveFavicon from 'serve-favicon';
import syncMiddleware from './sync';
import uploadMiddleware from './upload';
import { ravenRequestMiddleware, ravenErrorMiddleware } from '../raven';

const STATIC_PATH = path.resolve(__dirname, '../static');
const FAVICON_PATH = path.resolve(__dirname, '../static/favicon.ico');

const router = express();

router.enable('trust proxy');

router.use(ravenRequestMiddleware);

router.use(methodOverride());

router.use(
  bunyanMiddleware({
    logger: log.child({ component: 'http' }),
    obscureHeaders: ['Authorization', 'Cookie']
  })
);

router.get('/_ping', (req, res) => {
  res.send('pong');
});

// if (!__DEV__) {
//   router.use(forceSSL);
// }

router.use(serveFavicon(FAVICON_PATH));

router.options('/v1/graphql', cors());
router.post('/v1/graphql', [
  cors(),
  authMiddleware,
  uploadMiddleware,
  graphqlMiddleware
]);

const runURLMiddlewares = [
  cors(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  uploadMiddleware
];

router.options('/v1/run/:runToken', cors());
router.post('/v1/run/:runToken', [...runURLMiddlewares, asyncMiddleware]);

router.options('/v1/async/:runToken', cors());
router.post('/v1/async/:runToken', [...runURLMiddlewares, asyncMiddleware]);

router.options('/v1/sync/:runToken', cors());
router.post('/v1/sync/:runToken', [...runURLMiddlewares, syncMiddleware]);

router.post('/_reindex', reindexMiddleware);
router.use('/s3', dataDropMiddleware);
router.use(routesMiddleware);

if (__DEV__) {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);

  const wdm = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    stats: { colors: true }
  });

  const whm = webpackHotMiddleware(compiler);

  router.use(wdm);
  router.use(whm);

  process.once('shutdown', () => {
    wdm.close();
  });
}

router.use(express.static(STATIC_PATH));

router.use(ravenErrorMiddleware);

router.use((err, req, res, next) => {
  log.error(err);

  const status = err.status || 500;
  res.status(status);

  if (status >= 500 && !__DEV__) {
    res.send({
      errors: [
        {
          message: 'internal server error',
          referenceId: res.sentry
        }
      ]
    });
  } else {
    res.send({
      errors: [
        {
          message: err.message,
          stack: __DEV__ ? (err.stack || '').split('\n') : undefined
        }
      ]
    });
  }
});

export default router;
