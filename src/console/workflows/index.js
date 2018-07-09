/** @flow */

import _ from 'lodash';
import fetch from 'node-fetch';
import retry from 'async-retry';
import log from '../log';
import sql from '../sql-tag';
import { DEFAULT_CLIENT as ES_CLIENT } from '../elasticsearch/client';
import { JWT_ISSUER, JWT_EXPIRATION } from '../config';
import { encodeId, decodeIdOfType } from '../identifiers';
import { execute } from '../graphql';
import { putTargets } from './search';
import { resolveActor } from '../actors';
import { resolveImage } from '../images/resolve';
import { resolveIPAddress } from '../ip-addresses/resolve';
import { workflowsQueue } from '../queues';

import type { Environment } from './environment';
import type { ActorLookupFields } from '../actors';
import type { ImageLookupFields } from '../images/resolve';
import type { IPAddressLookupFields } from '../ip-addresses/resolve';
import type { Loaders } from '../loaders';
import type { UploadedFile } from '../router/upload';
import type {
  ActorRow,
  DatabaseRow,
  DecisionRow,
  ExternalTaskRow,
  ExternalTaskTypeRow,
  ImageEntityRow,
  IPAddressEntityRow,
  TargetRow,
  UpdateRow,
  WorkflowRow,
  WorkflowSettingsRow
} from '../rows';

export type WorkflowFunctionInput = Object;

export type WorkflowFunctionOutput = {
  score?: number,
  label?: string,
  reasons?: Array<string>,
  error?: string
};

export type WorkflowLookupFields = {
  id: ?string,
  name: ?string
};

const WEBHOOK_RETRIES = 3;
const WEBHOOK_RETRY_FACTOR = 2;
const WEBHOOK_RETRY_TIMEOUT = 2 * 1000;

/**
 * Resolves a workflow.
 */
export function resolveWorkflow(
  loaders: Loaders,
  lookupFields: WorkflowLookupFields
): Promise<?WorkflowRow> {
  if (lookupFields.id) {
    const workflowUUID = decodeIdOfType('WRK', lookupFields.id);
    return loaders.workflow.load(workflowUUID);
  } else if (lookupFields.name) {
    return loaders.workflowByName.load(lookupFields.name);
  } else {
    return Promise.resolve(null);
  }
}

/** Resolves a target. */
export async function resolveTarget(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  workflowRow: WorkflowRow,
  environment: Environment,
  actorLookupFields: ?ActorLookupFields,
  imageLookupFields: ?ImageLookupFields,
  ipAddressLookupFields: ?IPAddressLookupFields,
  uploadedFiles: Array<UploadedFile>
): Promise<{
  actorRow: ?ActorRow,
  imageRow: ?ImageEntityRow,
  ipAddressRow: ?IPAddressEntityRow
}> {
  let actorRow = null;
  let imageRow = null;
  let ipAddressRow = null;

  if (workflowRow.actor_target_arity === 'NONE' && actorLookupFields) {
    throw new Error('actor not allowed');
  }

  if (workflowRow.image_target_arity === 'NONE' && imageLookupFields) {
    throw new Error('image not allowed');
  }

  if (workflowRow.ip_address_target_arity === 'NONE' && ipAddressLookupFields) {
    throw new Error('IP address not allowed');
  }

  if (actorLookupFields) {
    actorRow = await resolveActor(loaders, actorLookupFields, databaseRow);
  }

  if (imageLookupFields) {
    imageRow = await resolveImage(
      loaders,
      databaseRow,
      imageLookupFields,
      uploadedFiles
    );
  }

  if (ipAddressLookupFields) {
    ipAddressRow = await resolveIPAddress(loaders, ipAddressLookupFields);
  }

  if (workflowRow.actor_target_arity === 'REQUIRED' && !actorRow) {
    throw new Error('actor required');
  }

  if (workflowRow.image_target_arity === 'REQUIRED' && !imageRow) {
    throw new Error('image required');
  }

  if (workflowRow.ip_address_target_arity === 'REQUIRED' && !ipAddressRow) {
    throw new Error('IP address required');
  }

  const key = {};

  if (workflowRow.actor_target_arity !== 'NONE') {
    key.actor = actorRow ? actorRow.id : null;
  }

  if (workflowRow.image_target_arity !== 'NONE') {
    key.image = imageRow ? imageRow.id : null;
  }

  if (workflowRow.ip_address_target_arity !== 'NONE') {
    key.ipAddress = ipAddressRow ? encodeId('IPA', ipAddressRow.id) : null;
  }

  return loaders.queryContext.one(sql`
    INSERT INTO
      storage.targets (
        workflow_id,
        database_id,
        environment,
        key,
        actor_id,
        image_id,
        ip_address_id
      )
    VALUES
      (
        ${workflowRow.id},
        ${databaseRow.id},
        ${environment},
        ${key},
        ${actorRow && actorRow.id},
        ${imageRow && imageRow.id},
        ${ipAddressRow && ipAddressRow.id}
      )
    ON CONFLICT ON CONSTRAINT
      target_key_unique
    DO UPDATE SET
      key = ${key}
    RETURNING
      *
  `);
}

export async function callWorkflowFunction(
  workflowRow: WorkflowRow,
  input: WorkflowFunctionInput
): Promise<WorkflowFunctionOutput> {
  try {
    const res = await fetch(workflowRow.function_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      timeout: 30 * 1000
    });

    const resBody = await res.json();
    // TODO: Validate response.

    return resBody;
  } catch (cause) {
    return { error: cause.message };
  }
}

export async function generateFunctionData(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  workflowRow: WorkflowRow,
  targetRow: TargetRow,
  args: Object
): Promise<{ args: Object, data: ?Object, errors?: Array<Object> }> {
  if (!workflowRow.function_data_query) {
    return Promise.resolve({ args: {}, data: null });
  }

  const body = await execute(
    workflowRow.function_data_query,
    { loaders },
    {
      databaseId: encodeId('DBX', databaseRow.id),
      workflowId: encodeId('WRK', workflowRow.id),
      targetId: encodeId('TRG', targetRow.id),
      environment: targetRow.environment,
      searchLabel: 'DENY',
      noSimilarImages: args.noSimilarImages || false,
      hasActor: !!targetRow.actor_id,
      hasImage: !!targetRow.image_id,
      actorId: targetRow.actor_id ? encodeId('ACT', targetRow.actor_id) : '',
      imageId: targetRow.image_id ? encodeId('IMG', targetRow.image_id) : ''
    }
  );

  body.args = args;

  return body;
}

export function generateUpdateData(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  workflowRow: WorkflowRow,
  targetRow: TargetRow,
  updateRow: ?UpdateRow
): Promise<{ data: ?Object, errors?: Array<Object> }> {
  if (!workflowRow.update_data_query) {
    return Promise.resolve({ data: null });
  }

  return execute(
    workflowRow.update_data_query,
    { loaders },
    {
      databaseId: encodeId('DBX', databaseRow.id),
      workflowId: encodeId('WRK', workflowRow.id),
      targetId: encodeId('TRG', targetRow.id),
      updateId: updateRow ? encodeId('UPD', updateRow.id) : null,
      hasActor: !!targetRow.actor_id,
      hasImage: !!targetRow.image_id,
      actorId: targetRow.actor_id ? encodeId('ACT', targetRow.actor_id) : '',
      imageId: targetRow.image_id ? encodeId('IMG', targetRow.image_id) : ''
    }
  );
}

/**
 * Runs a workflow.
 *
 * TODO: Clean up all this cruft.
 */
export async function runWorkflow(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  workflowRow: WorkflowRow,
  targetRow: TargetRow,
  args: Object = {}
): Promise<[?UpdateRow, TargetRow]> {
  if (!targetRow.state) {
    targetRow.state = {};
  }
  if (!targetRow.state.errors) {
    targetRow.state.errors = [];
  }

  let label = 'ERROR';
  let score = null;
  let reasons = [];
  let state = targetRow.state;
  let aliases = targetRow.aliases;

  const input = await generateFunctionData(
    loaders,
    databaseRow,
    workflowRow,
    targetRow,
    args
  );

  if (input.errors) {
    log.warn(`ERROR GENERATING FUNCTION DATA: ${input.errors}`);
    targetRow.state.errors.push(input.errors);
    state = targetRow.state;
  } else {
    const output = await callWorkflowFunction(workflowRow, input);
    if (output.error) {
      targetRow.state.errors.push(output.error);
      state = targetRow.state;
    } else {
      label = output.label || 'ERROR';
      score = output.score || null;
      reasons = output.reasons || [];
      state = output.state || null;
      aliases = output.aliases || [];
    }
  }

  const prevResults = {
    label: targetRow.label,
    score: targetRow.score == null ? null : parseFloat(targetRow.score),
    reasons: targetRow.reasons,
    state: targetRow.state,
    aliases: targetRow.aliases
  };

  const nextResults = { label, score, reasons, state, aliases };

  if (_.isEqual(prevResults, nextResults)) {
    return [null, targetRow];
  }

  if (prevResults.label !== nextResults.label) {
    workflowsQueue.add(
      'handleExternalTasks',
      {
        prevResults,
        nextResults,
        target_id: targetRow.id
      },
      { removeOnComplete: true }
    );
    workflowsQueue.add(
      'updatePhashIndex',
      {
        oldLabel: prevResults.label,
        newLabel: nextResults.label,
        target_id: targetRow.id
      },
      { removeOnComplete: true }
    );
  }

  return updateTarget(
    loaders,
    databaseRow,
    workflowRow,
    targetRow,
    label,
    score,
    reasons,
    state,
    aliases
  );
}

export async function addDecision(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  workflowRow: WorkflowRow,
  targetRow: TargetRow,
  userId: string,
  label: string,
  score: ?number,
  reasons: Array<string>
): Promise<DecisionRow> {
  const decisionRow = await loaders.queryContext.one(
    sql`
      INSERT INTO
        storage.decisions (
          target_id,
          database_id,
          user_id,
          label,
          score,
          reasons
        )
      VALUES
        (
          ${targetRow.id},
          ${databaseRow.id},
          ${userId},
          ${label},
          ${score},
          ${sql.as.json(reasons, true)}
        )
      RETURNING
        *
    `
  );

  await updateTarget(
    loaders,
    databaseRow,
    workflowRow,
    targetRow,
    label,
    score,
    reasons,
    targetRow.state,
    targetRow.aliases
  );

  return decisionRow;
}

export async function addExternalTaskDecision(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  workflowRow: WorkflowRow,
  targetRow: TargetRow,
  externalTaskRow: ExternalTaskRow,
  label: string,
  score: ?number,
  reasons: Array<string>,
  metadata: ?Object
): Promise<DecisionRow> {
  const decisionRow = await loaders.queryContext.one(
    sql`
      INSERT INTO
        storage.decisions (
          target_id,
          database_id,
          external_task_id,
          label,
          score,
          reasons,
          metadata
        )
      VALUES
        (
          ${targetRow.id},
          ${databaseRow.id},
          ${externalTaskRow.id},
          ${label},
          ${score},
          ${sql.as.json(reasons, true)},
          ${sql.as.json(metadata, true)}
        )
      RETURNING
        *
    `
  );

  workflowsQueue.add(
    'runWorkflow',
    {
      target_id: targetRow.id,
      args: {
        noSimilarImages: true
      }
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

  return decisionRow;
}

export async function updateTarget(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  workflowRow: WorkflowRow,
  targetRow: TargetRow,
  label: string,
  score: ?number,
  reasons: Array<string>,
  state: mixed,
  aliases: Array<string>
): Promise<[UpdateRow, TargetRow]> {
  const updatedAt = new Date();

  const [updateRow, updatedTargetRow] = await loaders.queryContext.tx(tx => {
    return tx.batch([
      tx.one(sql`
        INSERT INTO
          storage.updates (
            database_id,
            target_id,
            label,
            score,
            reasons,
            state,
            aliases,
            created_at
          )
        VALUES
          (
            ${databaseRow.id},
            ${targetRow.id},
            ${label},
            ${score},
            ${JSON.stringify(reasons)},
            ${state},
            ${JSON.stringify(aliases)},
            ${updatedAt}
          )
        RETURNING
          *
      `),
      tx.one(sql`
        UPDATE
          storage.targets
        SET
          label = ${label},
          score = ${score},
          reasons = ${JSON.stringify(reasons)},
          state = ${state},
          aliases = ${JSON.stringify(aliases)},
          updated_at = ${updatedAt}
        WHERE
          id = ${targetRow.id}
        RETURNING
          *
      `)
    ]);
  });

  // Clear the target cache so that when generating the update input, we reflect the changes to the target's state.
  loaders.target.clearAll();

  await putTargets(ES_CLIENT, [updatedTargetRow]);

  if (label !== 'ERROR') {
    workflowsQueue.add(
      'sendUpdateWebhook',
      { update_id: updateRow.id },
      { removeOnComplete: true }
    );
  }

  return [updateRow, updatedTargetRow];
}

export function updateWorkflowUpdateWebhookURL(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  workflowRow: WorkflowRow,
  environment: Environment,
  updateWebhookURL: string
): Promise<WorkflowSettingsRow> {
  return loaders.queryContext.one(
    sql`
      INSERT INTO
        storage.workflow_settings (
          database_id,
          workflow_id,
          environment,
          update_webhook_url
        )
      VALUES
        (
          ${databaseRow.id},
          ${workflowRow.id},
          ${environment},
          ${updateWebhookURL}
        )
      ON CONFLICT ON CONSTRAINT
        workflow_settings_database_env_unique
      DO UPDATE SET
        update_webhook_url = ${updateWebhookURL}
      RETURNING
        *
    `
  );
}

export function regenerateWorkflowUpdateWebhookSecret(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  workflowRow: WorkflowRow,
  environment: Environment
): Promise<WorkflowSettingsRow> {
  return loaders.queryContext.one(
    sql`
      INSERT INTO
        storage.workflow_settings (
          database_id,
          workflow_id,
          environment,
          update_webhook_secret
        )
      VALUES
        (
          ${databaseRow.id},
          ${workflowRow.id},
          ${environment},
          DEFAULT
        )
      ON CONFLICT ON CONSTRAINT
        workflow_settings_database_env_unique
      DO UPDATE SET
        update_webhook_secret = DEFAULT
      RETURNING
        *
    `
  );
}

/**
 * Sends an HTTP POST request to a workflow's update webhook URL.
 */
export async function sendUpdateWebhook(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  workflowRow: WorkflowRow,
  targetRow: TargetRow,
  updateRow: UpdateRow
): Promise<UpdateRow> {
  const updateData = await generateUpdateData(
    loaders,
    databaseRow,
    workflowRow,
    targetRow,
    updateRow
  );
  if (updateData.errors) {
    log.warn(
      `Errors generating webhook update data: ${updateData.errors.map(
        e => `"${e.message}"`
      )}`
    );
    return updateRow;
  }

  const workflowSettingsRow = await loaders.workflowSettings.load({
    databaseId: databaseRow.id,
    workflowId: workflowRow.id,
    environment: targetRow.environment
  });
  if (!workflowSettingsRow || !workflowSettingsRow.update_webhook_url) {
    return updateRow;
  }

  const at = new Date();
  let status = 0;

  try {
    await retry(
      async bail => {
        // TODO: Validate that the URL is publicly accessible.
        const res = await fetch(workflowSettingsRow.update_webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Pavlov-Webhook-Secret': workflowSettingsRow.update_webhook_secret
          },
          body: JSON.stringify(updateData)
        });

        status = res.status;
        if (status > 400) {
          let err = new Error(`Webhook request failed with status ${status}`);
          err.webhookStatus = status;
          throw err;
        }

        const updateId = encodeId('UPD', updateRow.id);
        log.info(`sent update webhook ${updateId} and received ${status}`);
      },
      {
        retries: WEBHOOK_RETRIES,
        factor: WEBHOOK_RETRY_FACTOR,
        minTimeout: WEBHOOK_RETRY_TIMEOUT,
        onRetry: err => log.warn(err, 'retrying webhook')
      }
    );
  } catch (err) {
    log.error(err, `Webhook failed after ${WEBHOOK_RETRIES} retries`);
    status = err.webhookStatus;
  }

  return loaders.queryContext.one(sql`
    UPDATE
      storage.updates
    SET
      webhook_status = ${status},
      webhook_at = ${at}
    WHERE
      id = ${updateRow.id}
    RETURNING
      *
  `);
}

export async function validateDecision(
  loaders: Loaders,
  workflowRow: WorkflowRow,
  label: string,
  score: ?number,
  reasons: Array<string>
): Promise<?string> {
  if (label !== 'ERROR' && !workflowRow.possible_labels.includes(label))
    return 'invalid label';

  return null;
}

export function createExternalTask(
  loaders: Loaders,
  databaseRow: DatabaseRow,
  externalTaskTypeRow: ExternalTaskTypeRow,
  targetRow: TargetRow
): Promise<ExternalTaskRow> {
  return loaders.queryContext.one(sql`
    INSERT INTO
      storage.external_tasks (
        database_id,
        type_id,
        target_id
      )
    VALUES
      (
        ${databaseRow.id},
        ${externalTaskTypeRow.id},
        ${targetRow.id}
      )
    RETURNING
      *
  `);
}

export function createExternalTaskAuthToken(
  loaders: Loaders,
  externalTaskRow: ExternalTaskRow
): Promise<ExternalTaskRow> {
  return loaders.queryContext.one(sql`
    INSERT INTO
      storage.external_task_auth_tokens (
        audience,
        issuer,
        external_task_id,
        expires_at
      )
    VALUES
      (
        'External task',
        ${JWT_ISSUER},
        ${externalTaskRow.id},
        now() + ${JWT_EXPIRATION}::interval
      )
    RETURNING
      *
  `);
}
