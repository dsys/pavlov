import ActorContextCard from './ActorContextCard';
import DecisionDrawer from './DecisionDrawer';
import ExternalTasksContextCard from './ExternalTasksContextCard';
import IPAddressContextCard from './IPAddressContextCard';
import ImageContextCard from './ImageContextCard';
import React from 'react';
import SimilarImagesContextCard from './SimilarImagesContextCard';
import Spinner from './Spinner';
import TargetContextCard from './TargetContextCard';
import TargetHeader from './TargetHeader';
import UpdateHistoryContextCard from './UpdateHistoryContextCard';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    query TargetContext($id: ID!) {
      target(id: $id) {
        id
        title
        subtitle
        thumbnailIcon
        thumbnailURL
        label
        score
        updatedAt
        hasActor
        hasImage
        hasIPAddress
        environment
        workflow {
          id
          drawerLabels
        }
      }
    }
  `,
  {
    options: props => ({
      variables: { id: props.targetId },
      pollInterval: 5000
    })
  }
)
@graphql(
  gql`
    mutation AddDecision(
      $id: ID!
      $label: String!
      $score: Float
      $reasons: [String!]!
    ) {
      addDecision(id: $id, label: $label, score: $score, reasons: $reasons) {
        id
        target {
          id
          label
          score
          reasons
        }
      }
    }
  `,
  { name: 'addDecision' }
)
export default class TargetContext extends React.Component {
  handleChangeDecision = async ({ label, score, reasons }) => {
    const { targetId, addDecision, onChangeDecision } = this.props;
    const { target } = this.props.data;

    await addDecision({
      variables: { id: targetId, label, score, reasons },
      refetchQueries: ['UpdateHistoryContextCard'],
      optimisticResponse: {
        __typename: 'Mutation',
        addDecision: {
          __typename: 'Decision',
          id: null,
          target: {
            __typename: 'Target',
            id: targetId,
            label: target ? target.label : null,
            score,
            reasons
          }
        }
      }
    });

    if (onChangeDecision) {
      onChangeDecision({ targetId, label, score, reasons });
    }
  };

  render() {
    const { onSelectTarget } = this.props;
    const { loading, target } = this.props.data;

    if (loading) {
      return <Spinner />;
    }

    return (
      <div className="target-context">
        <div className="header-wrapper">
          <TargetHeader {...target} />
        </div>
        {target.hasImage && <ImageContextCard targetId={target.id} />}
        {target.hasImage && (
          <SimilarImagesContextCard
            workflowId={target.workflow.id}
            environment={target.environment}
            targetId={target.id}
            onSelectTarget={onSelectTarget}
          />
        )}
        {target.hasActor && <ActorContextCard targetId={target.id} />}
        {target.hasIPAddress && <IPAddressContextCard targetId={target.id} />}
        <TargetContextCard targetId={target.id} />
        <ExternalTasksContextCard targetId={target.id} />
        <UpdateHistoryContextCard targetId={target.id} />

        <DecisionDrawer
          drawerLabels={target.workflow.drawerLabels}
          currentLabel={target.label}
          onChangeDecision={this.handleChangeDecision}
          fixed
        />

        <style jsx>{`
          .target-context {
            position: relative;
          }

          .header-wrapper {
            margin: 30px 40px 0;
          }
        `}</style>
      </div>
    );
  }
}
