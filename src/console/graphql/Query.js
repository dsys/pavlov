import { DEFAULT_CLIENT as ES_CLIENT } from '../elasticsearch/client';
import { createTargetSearchQuery, searchTargets } from '../workflows/search';
import { resolveActor } from '../actors';
import { resolveIPAddress } from '../ip-addresses/resolve';

const SEARCH_PAGE_LIMIT = 32;

export default {
  ok() {
    return true;
  },
  me(root, args, { sandbox }) {
    return sandbox.findMe();
  },
  authToken(root, { id }, { sandbox }) {
    return sandbox.findAuthToken(id);
  },
  database(root, { id }, { sandbox }) {
    if (id == null) {
      return sandbox.findDefaultDatabase();
    } else {
      return sandbox.findDatabase(id);
    }
  },
  async actor(root, lookupFields, { adminLoaders, loaders }) {
    const databaseRow = await loaders.defaultDatabase.load(0);
    return resolveActor(adminLoaders, lookupFields, databaseRow);
  },
  image(root, { id }, { loaders }) {
    return loaders.image.load(id);
  },
  person(root, { id }, { loaders }) {
    return loaders.person.load(id);
  },
  ipAddress(root, lookupFields, { loaders, adminLoaders }) {
    return resolveIPAddress(adminLoaders, lookupFields);
  },
  workflow(root, { id }, { loaders }) {
    return loaders.workflow.load(id);
  },
  target(root, { id }, { loaders }) {
    return loaders.target.load(id);
  },
  decision(root, { id }, { loaders }) {
    return loaders.decision.load(id);
  },
  externalTask(root, { id }, { loaders }) {
    return loaders.externalTask.load(id);
  },
  async searchTargets(
    root,
    { workflowId, environment, searchTerms, cursor },
    { loaders, adminLoaders }
  ) {
    const databaseRow = await loaders.defaultDatabase.load(0);
    if (!databaseRow) {
      return { hasNextPage: false, targets: [] };
    }

    const workflowRow = await loaders.workflow.load(workflowId);
    if (!workflowRow) {
      return { hasNextPage: false, targets: [] };
    }

    const query = createTargetSearchQuery(
      SEARCH_PAGE_LIMIT,
      cursor,
      databaseRow,
      workflowRow,
      environment,
      searchTerms || []
    );

    return searchTargets(loaders, ES_CLIENT, query);
  },
  allAuthTokens(root, args, { sandbox }) {
    return sandbox.findAllAuthTokens();
  },
  allDatabases(root, args, { sandbox }) {
    return sandbox.findAllDatabases();
  },
  allWorkflows(root, args, { loaders }) {
    return loaders.allWorkflows.load(0);
  }
};
