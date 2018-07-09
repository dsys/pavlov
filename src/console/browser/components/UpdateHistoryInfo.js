import ActionField from './ActionField';
import HTTPStatus from './HTTPStatus';
import React from 'react';
import colors from '../colors';
import moment from 'moment';

function friendlyAbsoluteTime(t) {
  return moment(t).format('dddd, MMMM Do YYYY, h:mm:ss a');
}

function friendlyRelativeTime(t) {
  return moment(t).fromNow();
}

export default class UpdateHistoryInfo extends React.Component {
  handleResendUpdateWebhook = () => {
    const { id, onResendUpdateWebhook } = this.props;
    onResendUpdateWebhook(id);
  };

  render() {
    const {
      reasons,
      aliases,
      createdAt,
      webhookStatus,
      webhookAt
    } = this.props;

    return (
      <ActionField
        key="1"
        actionAutohide
        actionIcon="refresh"
        actionText="Resend Webhook"
        onAction={this.handleResendUpdateWebhook}
      >
        <h1>{friendlyAbsoluteTime(createdAt)}</h1>
        <p className="description">{reasons.join(', ')}</p>
        {aliases.length > 0 && (
          <p className="description">Aliases: {aliases.join(', ')}</p>
        )}
        {webhookAt != null && (
          <p className="webhook">
            <span>Webhook </span>
            {friendlyRelativeTime(webhookAt)}
            <span> returned </span>
            <HTTPStatus code={webhookStatus} />
          </p>
        )}
        <style jsx>{`
          h1 {
            font-weight: bold;
          }

          .description {
            color: ${colors.gray1};
          }
        `}</style>
      </ActionField>
    );
  }
}
