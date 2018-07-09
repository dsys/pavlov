/** @flow */

import { adminPG } from '../db/postgres';
import q from '../db/queries';
import { createLoaders } from '../loaders';
import { resolveTarget, runWorkflow, generateUpdateData } from '../workflows';

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

      if (!databaseRow || !workflowRow) {
        res.status(404).send({ errors: [{ message: 'not found' }] });
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

      // TODO: Stick me on a task queue. Currently this is running asynchronously to give the illusion of a task queue on the backend, but that's bad practice. :P
      const [updateRow, updatedTargetRow] = await runWorkflow(
        loaders,
        databaseRow,
        workflowRow,
        targetRow,
        req.body || {}
      );

      const updateData = await generateUpdateData(
        loaders,
        databaseRow,
        workflowRow,
        updatedTargetRow,
        updateRow
      );

      res.status(200).send(updateData);
    } else {
      res.status(404).send({ errors: [{ message: 'not found' }] });
    }
  } catch (err) {
    next(err);
  }
}
