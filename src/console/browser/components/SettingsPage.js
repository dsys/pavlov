import AuthTokenModal from './AuthTokenModal';
import AuthTokensTable from './AuthTokensTable';
import DataDrop from './DataDrop';
import DocumentTitle from './DocumentTitle';
import EmailVerificationWarning from './EmailVerificationWarning';
import PageHeader from './PageHeader';
import React from 'react';
import SectionHeader from './SectionHeader';
import SimpleTable from './SimpleTable';
import TextBlock from './TextBlock';
import colors from '../colors';
import gql from 'graphql-tag';
import { Route } from 'react-router-dom';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    query SettingsPage {
      me {
        preferredName
        username
        primaryEmail
        primaryEmailVerified
      }
      database {
        id
        name
      }
      allAuthTokens {
        id
        issuer
        audience
        createdAt
        expiresAt
      }
    }
  `
)
@graphql(
  gql`
    mutation ResendEmailVerification {
      resendEmailVerification {
        ok
      }
    }
  `,
  { name: 'resendEmailVerification' }
)
@graphql(
  gql`
    mutation DeleteAuthToken($id: ID!) {
      deleteAuthToken(id: $id) {
        ok
      }
    }
  `,
  { name: 'deleteAuthToken' }
)
export default class SettingsPage extends React.Component {
  state = { resendingEmailVerification: false };

  handleResendEmailVerification = async e => {
    e.preventDefault();
    this.setState({ resendingEmailVerification: true });
    await this.props.resendEmailVerification();
    this.setState({ resendingEmailVerification: false });
    alert(
      'Verification email resent! Please check your spam folder in case it is in there. 📥'
    );
  };

  handleNewAuthToken = () => {
    this.props.history.push('/settings/auth-tokens/new');
  };

  handleDeleteAuthToken = id => {
    this.props.deleteAuthToken({
      variables: { id },
      refetchQueries: ['AuthTokensPage']
    });
  };

  render() {
    const { me, database, allAuthTokens } = this.props.data;
    return (
      <DocumentTitle title="Settings">
        <div className="page">
          <PageHeader title="Settings" />
          <SectionHeader title="Your Cleargraph Account" />
          <SimpleTable
            well
            data={[
              ['Preferred Name', me && me.preferredName],
              ['Username', me && me.username],
              ['Password', '**********'],
              [
                'Primary Email',
                me && (
                  <div>
                    <span>{me.primaryEmail}</span>
                    <EmailVerificationWarning
                      verified={me.primaryEmailVerified}
                      resending={this.state.resendingEmailVerification}
                      onResend={this.handleResendEmailVerification}
                    />
                  </div>
                )
              ],
              ['Database Name', database && database.name]
            ]}
          />
          <SectionHeader
            title="Personal Auth Tokens"
            icon="plus"
            onClickIcon={this.handleNewAuthToken}
          />
          <TextBlock>
            Create auth tokens to access the Pavlov API. The information listed
            below is not sensitive, and can be used to reference auth tokens.
            Use the button above to create a new signed auth token.
          </TextBlock>
          <AuthTokensTable
            authTokens={allAuthTokens}
            onDelete={this.handleDeleteAuthToken}
          />
          <Route path="/settings/auth-tokens/new" component={AuthTokenModal} />
          <SectionHeader title="Data Drop" />
          <TextBlock>
            Our secure data drop allows you to send large files (i.e. datasets)
            to the Pavlov team. All files will be stored securely and
            automatically deleted after 3 days.
          </TextBlock>
          <DataDrop />
          <style jsx>{`
            .page {
              padding: 0 40px;
              max-width: 800px;
              margin: 40px auto;
            }

            .unverified {
              color: ${colors.red};
              padding-left: 0.5em;
            }
          `}</style>
        </div>
      </DocumentTitle>
    );
  }
}
