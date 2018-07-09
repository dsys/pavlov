import ContextCard from './ContextCard';
import PlaceholderBlock from './PlaceholderBlock';
import React from 'react';
import Identifier from './Identifier';
import colors from '../colors';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    query ExternalTasksContextCard($targetId: ID!) {
      target(id: $targetId) {
        id
        externalTasks {
          id
          taskURL
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
export default class ExternalTasksContextCard extends React.Component {
  render() {
    const { target } = this.props.data;
    if (target) {
      return (
        <ContextCard title="External Tasks">
          {target.externalTasks.length === 0 ? (
            <PlaceholderBlock icon="workflow" text="No external tasks found." />
          ) : (
            target.externalTasks.map((t, i) => (
              <div key={i} className="external-task">
                <Identifier id={t.id} />
                <a href={t.taskURL}>View</a>
              </div>
            ))
          )}
          <style jsx>
            {`
              .external-task {
                padding: 10px;
              }

              .external-task + .external-task {
                border-top: 1px solid ${colors.gray2};
              }

              a {
                display: block;
                background: ${colors.purple3};
                padding: 2px 6px;
                border-radius: 2px;
                float: right;
                color: white;
              }
            `}
          </style>
        </ContextCard>
      );
    } else {
      return <ContextCard title="External Tasks" loading />;
    }
  }
}
