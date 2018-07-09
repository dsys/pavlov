/** @flow */

if (process.env.NODE_ENV === 'production' && process.env.RAVEN_DSN) {
  const Raven = require('raven');
  Raven.config(process.env.RAVEN_DSN).install();
  exports.ravenRequestMiddleware = Raven.requestHandler();
  exports.ravenErrorMiddleware = Raven.errorHandler();
} else {
  exports.ravenRequestMiddleware = (req, res, next) => next();
  exports.ravenErrorMiddleware = (req, res, next) => next();
}
