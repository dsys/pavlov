import uaToAudience from '../utils/uaToAudience';
import verifyRecaptchaResponse from '../utils/verifyRecaptchaResponse';
import { decodeIdOfType } from '../identifiers';
import { resolveActor } from '../actors';
import { resolveDatabase } from '../databases';
import { resolveImage } from '../images/resolve';
import { workflowsQueue } from '../queues';
import {
  resolveWorkflow,
  resolveTarget,
  addDecision,
  addExternalTaskDecision,
  validateDecision,
  updateWorkflowUpdateWebhookURL,
  regenerateWorkflowUpdateWebhookSecret
} from '../workflows';
import { sendVerificationEmail } from '../mailers/verificationEmail';
import {
  createUser,
  createAuthToken,
  regenerateEmailVerificationCode,
  verifyEmail
} from '../db/auth';
import {
  checkInviteCode,
  checkUsername,
  checkPassword,
  checkEmail
} from '../utils/checkCredentials';
import { UnauthorizedError, InvalidCAPTCHAError } from '../errors';

export default {
  ok() {
    return true;
  },
  async createUser(
    root,
    {
      username,
      password,
      email,
      preferredName,
      recaptchaResponse,
      audience,
      inviteCode
    },
    { ua }
  ) {
    const captchaOK = await verifyRecaptchaResponse(recaptchaResponse);
    if (!captchaOK) {
      throw new InvalidCAPTCHAError();
    }

    const result = await createUser({
      username,
      password,
      email,
      preferredName,
      inviteCode,
      audience: audience || uaToAudience(ua)
    });

    if (result.user) {
      await sendVerificationEmail(result.user);
    }

    return result;
  },
  createAuthToken(root, { username, password, audience }, { sandbox, ua }) {
    if (sandbox.auth) {
      return createAuthToken({
        userId: sandbox.auth.userId,
        password,
        audience: audience || uaToAudience(ua)
      });
    } else {
      UnauthorizedError.assert(username);

      return createAuthToken({
        username,
        password,
        audience: audience || uaToAudience(ua)
      });
    }
  },
  async deleteAuthToken(root, { id }, { sandbox }) {
    const ok = await sandbox.deleteAuthToken(id);
    return { ok };
  },
  async runQuery(root, { sql }, { sandbox }) {
    const data = await sandbox.query(sql);
    if (data.length === 0) {
      return { headers: [], data: [] };
    }

    const headers = Object.keys(data[0]).map(dataKey => ({
      label: dataKey,
      dataKey
    }));

    return { headers, data };
  },
  async resolveActor(
    root,
    { database: databaseLookupFields, actor: actorLookupFields },
    { loaders }
  ) {
    const databaseRow = await resolveDatabase(loaders, databaseLookupFields);
    return resolveActor(loaders, actorLookupFields, databaseRow);
  },
  async resolveImage(
    root,
    { database: databaseLookupFields, image: imageLookupFields },
    { files, loaders }
  ) {
    const databaseRow = await resolveDatabase(loaders, databaseLookupFields);
    return resolveImage(loaders, databaseRow, imageLookupFields, files);
  },
  async resolveTarget(
    root,
    {
      database: databaseLookupFields,
      workflow: workflowLookupFields,
      actor: actorLookupFields,
      image: imageLookupFields,
      ipAddress: ipAddressLookupFields
    },
    { files, loaders }
  ) {
    const databaseRow = await resolveDatabase(loaders, databaseLookupFields);
    const workflowRow = await resolveWorkflow(loaders, workflowLookupFields);

    return resolveTarget(
      loaders,
      databaseRow,
      workflowRow,
      'PRODUCTION',
      actorLookupFields,
      imageLookupFields,
      ipAddressLookupFields,
      files
    );
  },
  async addDecision(
    root,
    { id, label, score, reasons = [] },
    { authToken, loaders }
  ) {
    const uuid = decodeIdOfType('TRG', id);

    const targetRow = await loaders.target.load(uuid);
    if (!targetRow) return null;

    const databaseRow = await loaders.database.load(targetRow.database_id);
    if (!databaseRow) return null;

    const workflowRow = await loaders.workflow.load(targetRow.workflow_id);
    if (!workflowRow) return null;

    const validationError = await validateDecision(
      loaders,
      workflowRow,
      label,
      score,
      reasons
    );

    if (validationError) {
      throw new Error(validationError);
    }

    return addDecision(
      loaders,
      databaseRow,
      workflowRow,
      targetRow,
      authToken.userId,
      label,
      score,
      reasons
    );
  },
  async addExternalTaskDecision(
    root,
    { id, label, score, reasons = [], metadata },
    { loaders, adminLoaders }
  ) {
    const uuid = decodeIdOfType('EXT', id);

    const externalTaskRow = await loaders.externalTask.load(uuid);
    if (!externalTaskRow) return { ok: false };

    const targetRow = await adminLoaders.target.load(externalTaskRow.target_id);
    if (!targetRow) return { ok: false };

    const databaseRow = await adminLoaders.database.load(
      externalTaskRow.database_id
    );
    if (!databaseRow) return { ok: false };

    const workflowRow = await adminLoaders.workflow.load(targetRow.workflow_id);
    if (!workflowRow) return { ok: false };

    await addExternalTaskDecision(
      adminLoaders,
      databaseRow,
      workflowRow,
      targetRow,
      externalTaskRow,
      label,
      score,
      reasons,
      metadata
    );

    return { ok: true };
  },
  checkInviteCode(root, { inviteCode }) {
    return checkInviteCode(inviteCode);
  },
  async checkUsername(root, { inviteCode, username }) {
    const icCheck = await checkInviteCode(inviteCode);
    if (!icCheck.ok) {
      return icCheck;
    }

    return checkUsername(username);
  },
  async checkPassword(root, { inviteCode, password }) {
    const icCheck = await checkInviteCode(inviteCode);
    if (!icCheck.ok) {
      return icCheck;
    }

    return checkPassword(password);
  },
  async checkEmail(root, { inviteCode, email }) {
    const icCheck = await checkInviteCode(inviteCode);
    if (!icCheck.ok) {
      return icCheck;
    }

    return checkEmail(icCheck.database, email);
  },
  verifyEmail(root, { verificationCode }) {
    return verifyEmail(verificationCode);
  },
  async resendEmailVerification(root, args, { sandbox }) {
    const me = await sandbox.findMe();
    if (me.email_verified) {
      return { ok: false };
    } else {
      const me2 = await regenerateEmailVerificationCode(me);
      await sendVerificationEmail(me2);
      return { ok: true };
    }
  },
  async updateWorkflowSettings(
    root,
    { id, updateWebhookURL, regenerateUpdateWebhookSecret, environment },
    { loaders }
  ) {
    // TODO: Support more than just the default database.
    const databaseRow = await loaders.defaultDatabase.load(0);
    const workflowUUID = decodeIdOfType('WRK', id);
    const workflowRow = await loaders.workflow.load(workflowUUID);
    if (!databaseRow || !workflowRow) return null;

    if (updateWebhookURL) {
      await updateWorkflowUpdateWebhookURL(
        loaders,
        databaseRow,
        workflowRow,
        environment,
        updateWebhookURL
      );
    }

    if (regenerateUpdateWebhookSecret) {
      await regenerateWorkflowUpdateWebhookSecret(
        loaders,
        databaseRow,
        workflowRow,
        environment
      );
    }

    return workflowRow;
  },
  async resendUpdateWebhook(root, { id }, { loaders }) {
    workflowsQueue.add(
      'sendUpdateWebhook',
      { update_id: id },
      { removeOnComplete: true }
    );
  }
};
