import 'graphiql/graphiql.css';

import DocumentTitle from './DocumentTitle';
import queryString from 'query-string';
import GraphiQL from 'graphiql';
import React from 'react';
import gql from 'graphql-tag';
import { getAuthHeader } from '../auth';
import { graphql } from 'react-apollo';

const GRAPHQL_ENDPOINT = '/v1/graphql';

function graphQLFetcher(graphQLParams) {
  return fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader()
    },
    body: JSON.stringify(graphQLParams)
  }).then(response => response.json());
}

@graphql(gql`
  query Email {
    me {
      primaryEmail
    }
  }
`)
export default class GraphQLPage extends React.Component {
  handleEditQuery = query => {
    this.handleEdit({ query });
  };

  handleEditVariables = variables => {
    this.handleEdit({ variables });
  };

  handleEditOperationName = operationName => {
    this.handleEdit({ operationName });
  };

  handleEdit = values => {
    const { match, history } = this.props;
    history.replace({
      search: queryString.stringify({ ...match.query, ...values })
    });
  };

  render() {
    const { match } = this.props;

    return (
      <DocumentTitle title="GraphQL API Explorer">
        <div>
          <GraphiQL
            fetcher={graphQLFetcher}
            query={match.params.query}
            variables={match.params.variables}
            operationName={match.params.operationName}
            onEditQuery={this.handleEditQuery}
            onEditVariables={this.handleEditVariables}
            onEditOperationName={this.handleEditOperationName}
          />
          <style jsx>{`
            div {
              height: 100%;
            }

            div :global(.topBar),
            div :global(.doc-explorer-title-bar),
            div :global(.history-title-bar) {
              height: initial;
            }

            div :global(.title) {
              display: none;
            }

            div :global(.execute-button-wrap) {
              margin-left: 0;
            }
          `}</style>
        </div>
      </DocumentTitle>
    );
  }
}
