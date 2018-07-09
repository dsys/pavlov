import ContextCard from './ContextCard';
import React from 'react';
import SimpleTable from './SimpleTable';
import Tag from './Tag';
import UpdateHistoryInfo from './UpdateHistoryInfo';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    query UpdateHistoryContextCard($targetId: ID!) {
      target(id: $targetId) {
        id
        updates {
          id
          label
          score
          reasons
          aliases
          webhookStatus
          webhookAt
          createdAt
        }
      }
    }
  `,
  {
    options: () => ({
      pollInterval: 5000
    })
  }
)
@graphql(
  gql`
    mutation ResendUpdateWebhook($id: ID!) {
      resendUpdateWebhook(id: $id) {
        id
        webhookStatus
        webhookAt
      }
    }
  `,
  { name: 'resendUpdateWebhook' }
)
export default class UpdateHistoryContextCard extends React.Component {
  handleResendUpdateWebhook = id => {
    this.props.resendUpdateWebhook({
      variables: { id },
      optimisticResponse: {
        __typename: 'Mutation',
        resendUpdateWebhook: {
          __typename: 'Update',
          id,
          webhookStatus: null,
          webhookAt: null
        }
      }
    });
  };

  render() {
    const { target } = this.props.data;
    if (target) {
      return (
        <ContextCard title="Update History">
          <SimpleTable
            data={target.updates.map((d, i) => [
              <Tag key="0" label={d.label} score={d.score} />,
              <UpdateHistoryInfo
                key="1"
                onResendUpdateWebhook={this.handleResendUpdateWebhook}
                {...d}
              />
            ])}
          />
        </ContextCard>
      );
    } else {
      return <ContextCard title="Update History" loading />;
    }
  }
}
