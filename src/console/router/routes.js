import { Router } from 'express';

function renderAppMiddleware(req, res, next) {
  req.url = '/';
  next();
}

const ROUTES = [
  '/',
  '/docs',
  '/login',
  '/register',
  '/settings',
  '/settings/auth-tokens/new',
  '/ext/target/:targetId',
  '/ext/mturk/:externalTaskId',
  '/ext/telemetry/sandbox',
  '/v1/graphql',
  '/verify/:verificationCode',
  '/events',
  '/workflows',
  '/workflows/:id'
];

const routesMiddleware = new Router();

for (const path of ROUTES) {
  routesMiddleware.get(path, renderAppMiddleware);
}

export default routesMiddleware;
