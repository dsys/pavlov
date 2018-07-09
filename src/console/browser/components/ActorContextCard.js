import ContextCard from './ContextCard';
import React from 'react';
import SimpleTable from './SimpleTable';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

function processLookupFields(lookupFields) {
  const data = [];
  if (lookupFields.name != null) {
    data.push(['Name', lookupFields.name]);
  }
  if (lookupFields.email != null) {
    data.push(['Email', lookupFields.email]);
  }
  if (lookupFields.phoneNumber != null) {
    data.push(['Phone Number', lookupFields.phoneNumber]);
  }
  if (lookupFields.ipAddress != null) {
    data.push(['IP Address', lookupFields.ipAddress]);
  }
  return data;
}

@graphql(
  gql`
    query ActorContextCard($targetId: ID!) {
      target(id: $targetId) {
        id
        actor {
          id
          lookupFields {
            name
            email
            phoneNumber
            ipAddress
          }
        }
      }
    }
  `
)
export default class ActorContextCard extends React.Component {
  render() {
    const { target } = this.props.data;
    if (target) {
      return (
        <ContextCard title="Actor">
          <SimpleTable data={processLookupFields(target.actor.lookupFields)} />
        </ContextCard>
      );
    } else {
      return <ContextCard title="Actor" loading />;
    }
  }
}
