import DocumentTitle from './DocumentTitle';
import PageHeader from './PageHeader';
import React from 'react';
import Spinner from './Spinner';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(gql`
  {
    database {
      id
    }
  }
`)
export default class EventsPage extends React.Component {
  render() {
    const { database } = this.props.data;
    if (database) {
      return (
        <DocumentTitle title="Events">
          <div className="page">
            <PageHeader title="Events" />
            <style jsx>{`
              .page {
                padding: 0 40px;
                max-width: 800px;
                margin: 40px auto;
              }
            `}</style>
          </div>
        </DocumentTitle>
      );
    } else {
      return (
        <DocumentTitle title="Events">
          <Spinner />
        </DocumentTitle>
      );
    }
  }
}
