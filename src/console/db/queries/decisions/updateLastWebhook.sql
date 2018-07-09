UPDATE
  storage.decisions
SET
  last_webhook_status = ${lastWebhookStatus},
  last_webhook_at = now()
WHERE
  id = ${id}
RETURNING
  *
