import log from '../log';
import _ from 'lodash';
import Queue from 'bull';

import { adminPG } from '../db/postgres';
import { createLoaders } from '../loaders';
import { encodeId, decodeIdOfType } from '../identifiers';
import {
  runWorkflow,
  sendUpdateWebhook,
  createExternalTask,
  createExternalTaskAuthToken
} from '../workflows';
import { HTTPS_BASE_URL } from '../config';
import { signExternalTaskAuthToken } from '../auth';
import {
  addLabeledPhashToIndex,
  removeLabeledPhashFromIndex
} from '../images/phash';
import { MTurk } from '../external/mturk';

const REDIS_URL = process.env.REDIS_URL;
const name = 'workflowsQueue';
const queue = new Queue(name, REDIS_URL);

const jobProcessors = {
  runWorkflow: async job => {
    const loaders = createLoaders(adminPG);

    const target_uuid = decodeIdOfType('TRG', job.data.target_id);

    const targetRow = await loaders.target.load(target_uuid);
    if (!targetRow)
      throw new Error(`Unable to load target of id ${target_uuid}`);

    const databaseRow = await loaders.database.load(targetRow.database_id);
    if (!databaseRow)
      throw new Error(`Unable to load database of id ${targetRow.database_id}`);

    const workflowRow = await loaders.workflow.load(targetRow.workflow_id);
    if (!workflowRow)
      throw new Error(`Unable to load workflow of id ${targetRow.workflow_id}`);

    runWorkflow(
      loaders,
      databaseRow,
      workflowRow,
      targetRow,
      job.data.args || {}
    );
  },
  updatePhashIndex: async job => {
    const loaders = createLoaders(adminPG);

    const target_uuid = decodeIdOfType('TRG', job.data.target_id);

    const targetRow = await loaders.target.load(target_uuid);
    if (!targetRow)
      throw new Error(`Unable to load target of id ${target_uuid}`);

    const databaseRow = await loaders.database.load(targetRow.database_id);
    if (!databaseRow)
      throw new Error(`Unable to load database of id ${targetRow.database_id}`);

    const imageRow = await loaders.image.load(targetRow.image_id);
    if (!imageRow)
      throw new Error(`Unable to load image of id ${targetRow.image_id}`);

    addLabeledPhashToIndex(loaders, databaseRow, imageRow, job.data.newLabel);
    removeLabeledPhashFromIndex(
      loaders,
      databaseRow,
      imageRow,
      job.data.oldLabel
    );
  },
  sendUpdateWebhook: async job => {
    const loaders = createLoaders(adminPG);

    const update_uuid = decodeIdOfType('UPD', job.data.update_id);

    const updateRow = await loaders.update.load(update_uuid);
    if (!updateRow)
      throw new Error(`Unable to load update of id ${update_uuid}`);

    const targetRow = await loaders.target.load(updateRow.target_id);
    if (!targetRow)
      throw new Error(`Unable to load target of id ${updateRow.target_id}`);

    const databaseRow = await loaders.database.load(updateRow.database_id);
    if (!databaseRow)
      throw new Error(`Unable to load database of id ${updateRow.database_id}`);

    const workflowRow = await loaders.workflow.load(targetRow.workflow_id);
    if (!workflowRow)
      throw new Error(`Unable to load workflow of id ${targetRow.workflow_id}`);

    return sendUpdateWebhook(
      loaders,
      databaseRow,
      workflowRow,
      targetRow,
      updateRow
    );
  },
  handleExternalTasks: async job => {
    const loaders = createLoaders(adminPG);

    const target_uuid = decodeIdOfType('TRG', job.data.target_id);

    const targetRow = await loaders.target.load(target_uuid);
    if (!targetRow)
      throw new Error(`Unable to load target of id ${target_uuid}`);

    const databaseRow = await loaders.database.load(targetRow.database_id);
    if (!databaseRow)
      throw new Error(`Unable to load database of id ${targetRow.database_id}`);

    const externalTaskTypeRows = await loaders.externalTaskTypesByWorkflowId.load(
      targetRow.workflow_id
    );
    if (!externalTaskTypeRows)
      throw new Error(
        `Unable to load external task type rows for workflow id ${targetRow.workflow_id}`
      );

    const nextResults = job.data.nextResults;

    for (const ettRow of externalTaskTypeRows) {
      if (ettRow.create_labels.indexOf(nextResults.label) !== -1) {
        const externalTaskRow = await createExternalTask(
          loaders,
          databaseRow,
          ettRow,
          targetRow
        );
        const externalTaskId = encodeId('EXT', externalTaskRow.id);
        const externalTaskAuthToken = await createExternalTaskAuthToken(
          loaders,
          externalTaskRow
        );
        const signedAuthToken = await signExternalTaskAuthToken(
          externalTaskAuthToken
        );

        const mturk = new MTurk();
        const question = mturk.formatQuestion(
          `${HTTPS_BASE_URL}/ext/mturk/${externalTaskId}?authToken=${signedAuthToken}`,
          800
        );

        await mturk.createHIT(
          externalTaskId,
          question,
          ettRow.title,
          ettRow.description,
          ettRow.reward,
          ettRow.keywords,
          ettRow.lifetime,
          ettRow.max_assignments,
          ettRow.assignment_duration,
          ettRow.autoapproval_delay
        );

        log.info(`created external task ${externalTaskId}`);
      }
    }
  }
};

_.each(jobProcessors, (processor, name) => queue.process(name, processor));

export default queue;
