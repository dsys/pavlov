import ActionField from './ActionField';
import Code from './Code';
import DocumentTitle from './DocumentTitle';
import Identifier from './Identifier';
import InlineInputField from './InlineInputField';
import PageHeader from './PageHeader';
import React from 'react';
import RunWorkflowExample from './RunWorkflowExample';
import SectionHeader from './SectionHeader';
import SimpleTable from './SimpleTable';
import Spinner from './Spinner';
import Tag from './Tag';
import TextBlock from './TextBlock';
import ViewButton from './ViewButton';
import Well from './Well';
import WorkflowHistogram from './WorkflowHistogram';
import colors from '../colors';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    query WorkflowSettings($workflowId: ID!, $environment: Environment!) {
      workflow(id: $workflowId) {
        id
        name
        possibleLabels
        settings(environment: $environment) {
          syncURL
          sandboxURL
          updateWebhookURL
          updateWebhookSecret
        }
      }
    }
  `
)
@graphql(
  gql`
    query WorkflowHistogram($workflowId: ID!, $environment: Environment!) {
      workflow(id: $workflowId) {
        id
        possibleLabels
        histogramData(environment: $environment)
      }
    }
  `,
  { name: 'histogramData' }
)
@graphql(
  gql`
    mutation UpdateUpdateWebhookURL(
      $workflowId: ID!
      $environment: Environment!
      $updateWebhookURL: URL!
    ) {
      updateWorkflowSettings(
        id: $workflowId
        environment: $environment
        updateWebhookURL: $updateWebhookURL
      ) {
        id
        settings(environment: $environment) {
          updateWebhookURL
        }
      }
    }
  `,
  { name: 'updateUpdateWebhookURL' }
)
@graphql(
  gql`
    mutation RegenerateUpdateWebhookSecret(
      $workflowId: ID!
      $environment: Environment!
    ) {
      updateWorkflowSettings(
        id: $workflowId
        environment: $environment
        regenerateUpdateWebhookSecret: true
      ) {
        id
        settings(environment: $environment) {
          updateWebhookSecret
        }
      }
    }
  `,
  { name: 'regenerateUpdateWebhookSecret' }
)
export default class WorkflowSettings extends React.Component {
  handleChangeUpdateWebhookURL = async updateWebhookURL => {
    const { workflowId, environment, updateUpdateWebhookURL } = this.props;
    await updateUpdateWebhookURL({
      variables: { workflowId, environment, updateWebhookURL },
      optimisticResponse: {
        __typename: 'Mutation',
        updateWorkflowSettings: {
          __typename: 'Workflow',
          id: workflowId,
          settings: {
            updateWebhookURL
          }
        }
      }
    });
  };

  handleRegenerateUpdateWebhookSecret = async () => {
    const {
      workflowId,
      environment,
      regenerateUpdateWebhookSecret
    } = this.props;
    await regenerateUpdateWebhookSecret({
      variables: { workflowId, environment },
      optimisticResponse: {
        __typename: 'Mutation',
        updateWorkflowSettings: {
          __typename: 'Workflow',
          id: workflowId,
          settings: {
            updateWebhookSecret: 'XXXXXXXXXXXXXXXX'
          }
        }
      }
    });
  };

  render() {
    const { environment } = this.props;
    const { loading, workflow } = this.props.data;
    const title = `Workflow: ${workflow && workflow.name}`;

    if (workflow) {
      return (
        <DocumentTitle title={title}>
          <div className="page">
            <PageHeader title={title} />
            <Well style={{ margin: '40px 0' }}>
              <WorkflowHistogram {...this.props.histogramData} />
            </Well>
            <SimpleTable
              data={[
                [
                  'Workflow Identifier',
                  <Identifier key="1" id={workflow.id} />
                ],
                ['Workflow Name', workflow.name],
                [
                  'Workflow Environment',
                  <strong key="1">{environment}</strong>
                ],
                [
                  'Sandbox URL',
                  <ViewButton key="1" href={workflow.settings.sandboxURL} />
                ],
                [
                  'Possible Labels',
                  <div key="1">
                    {workflow.possibleLabels.map((label, i) => (
                      <Tag key={i} label={label} style={{ marginRight: 10 }} />
                    ))}
                  </div>
                ]
              ]}
            />
            <SectionHeader title="Running this workflow" />
            <TextBlock>
              Run this workflow by sending an HTTP POST request to the sync URL
              below. In your request, upload an image under the{' '}
              <Code>image</Code> file key, or provide an image URL using the{' '}
              <Code>imageURL</Code> field.
            </TextBlock>
            <RunWorkflowExample syncURL={workflow.settings.syncURL} />
            <SectionHeader title="Receiving updates" />
            <TextBlock>
              Pavlov will send a webhook to the URL below any time there is an
              update to a target of this workflow.
            </TextBlock>
            <SimpleTable
              data={[
                [
                  'Webhook URL',
                  <InlineInputField
                    key="1"
                    placeholder="https://..."
                    value={workflow.settings.updateWebhookURL}
                    onChange={this.handleChangeUpdateWebhookURL}
                  />
                ],
                [
                  'Webhook Secret',
                  <ActionField
                    key="1"
                    actionIcon="refresh"
                    actionText="Regenerate"
                    onAction={this.handleRegenerateUpdateWebhookSecret}
                  >
                    {workflow.settings.updateWebhookSecret}
                  </ActionField>
                ]
              ]}
            />
            <style jsx>{`
              .page {
                padding: 0 40px;
                margin: 40px auto;
              }

              strong {
                font-weight: bold;
              }

              code {
                background: ${colors.gray2};
                font-family: monospace;
              }
            `}</style>
          </div>
        </DocumentTitle>
      );
    } else if (loading) {
      return <Spinner />;
    } else {
      return null;
    }
  }
}
