import ContextCard from './ContextCard';
import PlaceholderBlock from './PlaceholderBlock';
import React from 'react';
import TargetHeader from './TargetHeader';
import _ from 'lodash';
import colors from '../colors';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    query SimilarImagesContextCard(
      $workflowId: ID!
      $environment: Environment!
      $targetId: ID!
    ) {
      target(id: $targetId) {
        id
        image {
          id
          similarImages {
            similarity
            image {
              id
              targets(workflowId: $workflowId, environment: $environment) {
                id
                title
                subtitle
                thumbnailIcon
                thumbnailURL
                label
                score
                updatedAt
              }
            }
          }
        }
      }
    }
  `
)
class RequestedSimilarImagesContextCard extends React.Component {
  render() {
    const { onSelectTarget } = this.props;
    const { target } = this.props.data;

    if (!target) return <ContextCard title="Similar Images" loading />;

    const similarTargets = _.flatten(
      target.image.similarImages.map(s => s.image.targets)
    );
    return (
      <ContextCard title="Similar Images">
        {similarTargets.length === 0 ? (
          <PlaceholderBlock icon="image" text="No similar images found." />
        ) : (
          similarTargets.map((t, i) => (
            <div
              key={i}
              className="similar-image"
              onClick={() => onSelectTarget(t.id)}
            >
              <TargetHeader {...t} />
            </div>
          ))
        )}

        <style jsx>{`
          .similar-image {
            padding: 10px;
            cursor: pointer;
          }

          .similar-image + .similar-image {
            border-top: 1px solid ${colors.gray2};
          }

          .similar-image:hover,
          .similar-image:focus {
            background: ${colors.gray2};
          }
        `}</style>
      </ContextCard>
    );
  }
}

export default class SimilarImagesContextCard extends React.Component {
  state = { requested: false };

  handleRequestLoad = () => {
    this.setState({ requested: true });
  };

  render() {
    const { requested } = this.state;

    if (requested) {
      return <RequestedSimilarImagesContextCard {...this.props} />;
    } else {
      return (
        <ContextCard title="Similar Images">
          <button onClick={this.handleRequestLoad}>load</button>
        </ContextCard>
      );
    }
  }
}
