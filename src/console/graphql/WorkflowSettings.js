/** @flow */

import { BASE_URL, API_BASE_URL } from '../config';

import type { WorkflowSettingsRow } from '../rows';

export default {
  environment(workflowSettingsRow: WorkflowSettingsRow): string {
    return workflowSettingsRow.environment;
  },
  syncURL(workflowSettingsRow: WorkflowSettingsRow): string {
    return `${API_BASE_URL}/sync/${workflowSettingsRow.run_token}`;
  },
  asyncURL(workflowSettingsRow: WorkflowSettingsRow): string {
    return `${API_BASE_URL}/async/${workflowSettingsRow.run_token}`;
  },
  sandboxURL(workflowSettingsRow: WorkflowSettingsRow): string {
    const emitURL = `${API_BASE_URL}/async/${workflowSettingsRow.run_token}`;
    return `${BASE_URL}/ext/telemetry/sandbox?url=${encodeURIComponent(
      emitURL
    )}`;
  },
  async updateWebhookURL(
    workflowSettingsRow: WorkflowSettingsRow
  ): Promise<?string> {
    return workflowSettingsRow.update_webhook_url;
  },
  async updateWebhookSecret(
    workflowSettingsRow: WorkflowSettingsRow
  ): Promise<string> {
    return workflowSettingsRow.update_webhook_secret;
  }
};
