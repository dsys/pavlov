import ContextCard from './ContextCard';
import Identifier from './Identifier';
import React from 'react';
import SimpleTable from './SimpleTable';
import Tag from './Tag';
import ViewButton from './ViewButton';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    query TargetContextCard($targetId: ID!) {
      target(id: $targetId) {
        id
        label
        score
        aliases
      }
    }
  `,
  {
    options: () => ({ pollInterval: 5 * 1000 })
  }
)
export default class TargetContextCard extends React.Component {
  render() {
    const { target } = this.props.data;
    if (target) {
      return (
        <ContextCard title="Target">
          <SimpleTable
            data={[
              ['Target Identifier', <Identifier key="1" id={target.id} />],
              [
                'Tag',
                <Tag key="1" label={target.label} score={target.score} />
              ],
              [
                'Aliases',
                target.aliases.length === 0 ? 'None' : target.aliases.join(', ')
              ],
              [
                'Embed URL',
                <ViewButton key="1" href={`/ext/target/${target.id}`} />
              ]
            ]}
          />
        </ContextCard>
      );
    } else {
      return <ContextCard title="Target" loading />;
    }
  }
}
