/** @flow */

import q from '../db/queries';
import { adminPG } from '../db/postgres';
import { createLoaders } from '../loaders';
import { encodeId } from '../identifiers';
import { resolveTarget } from '../workflows';
import { workflowsQueue } from '../queues';

export default async function(
  req: Request,
  res: Response,
  next: (err: Error) => void
) {
  try {
    // TODO: Separate out run token lookup as middleware before multer.
    const runToken = req.params.runToken;

    const imageSHA256 = req.body.imageSHA256 || null;
    const imageURL = req.body.imageURL || null;

    const uploadedFiles = req.files || [];
    const imageFile = uploadedFiles.find(f => f.fieldname === 'image');

    // TODO: Support client-side actor resolution.
    let actorLookupFields = null;
    if (req.body.email) {
      actorLookupFields = { email: req.body.email };
    }

    let imageLookupFields = null;
    if (imageSHA256) {
      imageLookupFields = { sha256: imageSHA256 };
    } else if (imageURL) {
      imageLookupFields = { url: imageURL };
    } else if (imageFile) {
      imageLookupFields = { file: 'image' };
    }

    let ipAddressLookupFields = null;
    if (req.body.ipAddress) {
      ipAddressLookupFields = { address: req.body.ipAddress };
    }

    const workflowSettings = await adminPG.oneOrNone(
      q.workflowSettings.selectByToken,
      runToken
    );
    if (workflowSettings) {
      // TODO: Run workflows in a workflow-specific query context.
      const loaders = createLoaders(adminPG);
      const databaseRow = await loaders.database.load(
        workflowSettings.database_id
      );
      const workflowRow = await loaders.workflow.load(
        workflowSettings.workflow_id
      );

      if (
        workflowRow.ip_address_arity === 'REQUIRED' &&
        ipAddressLookupFields == null
      ) {
        ipAddressLookupFields = {
          address: req.get('cf-connecting-ip') || req.ip
        };
      }

      if (!databaseRow || !workflowRow) {
        res.status(404).send({ error: 'not found' });
        return;
      }

      const targetRow = await resolveTarget(
        loaders,
        databaseRow,
        workflowRow,
        workflowSettings.environment,
        actorLookupFields,
        imageLookupFields,
        ipAddressLookupFields,
        uploadedFiles
      );

      workflowsQueue.add(
        'runWorkflow',
        {
          target_id: targetRow.id,
          args: req.body || {}
        },
        {
          attempts: 10,
          backoff: {
            type: 'exponential',
            delay: 1000
          },
          removeOnComplete: true
        }
      );

      const id = encodeId('TRG', targetRow.id);
      res.status(200).send({ id });
    } else {
      res.status(404).send({ error: 'not found' });
    }
  } catch (err) {
    next(err);
  }
}
