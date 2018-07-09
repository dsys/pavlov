/** @flow */

import type { TargetRow } from '../rows';

import log from '../log';
import sql from '../sql-tag';
import { DEFAULT_CLIENT as ES_CLIENT } from '../elasticsearch/client';
import { adminPG } from '../db/postgres';
import { putTargets } from '../workflows/search';

const BATCH_SIZE = 1000;

export default async function(
  req: Request,
  res: Response,
  next: (err: Error) => void
) {
  try {
    let count = 0;
    let before = new Date();
    log.info('Starting to reindex all targets');
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const batch: Array<TargetRow> = await adminPG.manyOrNone(sql`
        SELECT * FROM storage.targets
        WHERE created_at <= ${before}
        ORDER BY created_at DESC
        LIMIT ${BATCH_SIZE};
      `);

      if (batch.length === 0) break;
      log.info(`Reindexed ${batch.length} documents`);
      await putTargets(ES_CLIENT, batch);
      count += batch.length;
      before = batch[batch.length - 1].created_at;
    }

    res.send({ data: { count } });
  } catch (err) {
    next(err);
  }
}
