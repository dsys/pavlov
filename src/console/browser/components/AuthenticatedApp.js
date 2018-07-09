import DocumentationPage from './DocumentationPage';
import EventsPage from './EventsPage';
import GraphQLPage from './GraphQLPage';
import NavBar from './NavBar';
import NotFoundPage from './NotFoundPage';
import React, { Component } from 'react';
import SettingsPage from './SettingsPage';
import Spinner from './Spinner';
import WorkflowsPage from './WorkflowsPage';
import colors from '../colors';
import gql from 'graphql-tag';
import QueryRoute from './QueryRoute';
import { Switch, Route, Redirect } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { useAuth, getCurrentAuthTokenId } from '../auth';

@graphql(
  gql`
    query UserInfo {
      me {
        preferredName
        thumbnailIcon
        thumbnailURL
      }
      database {
        id
        name
        thumbnailIcon
        thumbnailURL
      }
      allWorkflows {
        id
        name
        thumbnailURL
        thumbnailIcon
      }
    }
  `
)
@graphql(
  gql`
    mutation Logout($id: ID!) {
      deleteAuthToken(id: $id) {
        ok
      }
    }
  `,
  { name: 'logout' }
)
export default class AuthenticatedApp extends Component {
  handleLogout = async () => {
    try {
      await this.props.logout({ variables: { id: getCurrentAuthTokenId() } });
    } catch (err) {
      // Ignore
    }

    useAuth(null);
    this.props.client.resetStore();
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data.loading && !nextProps.data.me) {
      useAuth(null);
    }
  }

  render() {
    const { me, allWorkflows, database } = this.props.data;

    if (me && database) {
      return (
        <div className="app">
          <div className="nav-wrapper">
            <NavBar
              workflows={allWorkflows ? allWorkflows : []}
              me={me}
              database={database}
              onLogout={this.handleLogout}
            />
          </div>
          <div className="page-wrapper">
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Redirect to={`/workflows/${allWorkflows[0].id}`} />
                )}
              />,
              <QueryRoute
                path="/workflows/:id"
                component={WorkflowsPage}
                defaultQuery={{ env: 'LIVE', target: null, search: [] }}
              />,
              <Route path="/events" component={EventsPage} />
              <Route path="/docs" component={DocumentationPage} />
              <Route path="/settings" component={SettingsPage} />
              <QueryRoute path="/v1/graphql" component={GraphQLPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
          <style jsx>{`
            .app {
              display: flex;
              min-width: 960px;
              height: 100vh;
            }

            .nav-wrapper {
              height: 100%;
              flex: none;
            }

            .page-wrapper {
              background: ${colors.white};
              flex: auto;
              margin-left: 70px;
            }

            :global(a) {
              color: ${colors.purple2};
              transition: color 0.2s;
            }

            :global(a:hover),
            :global(a:focus) {
              color: ${colors.purple3};
            }
          `}</style>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}
