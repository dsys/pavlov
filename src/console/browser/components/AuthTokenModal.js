import CodeBlock from './CodeBlock';
import FormError from './FormError';
import InputField from './InputField';
import Modal from './Modal';
import React from 'react';
import SubmitButton from './SubmitButton';
import TextBlock from './TextBlock';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    mutation CreateAuthToken($password: String!, $audience: String!) {
      createAuthToken(password: $password, audience: $audience) {
        ok
        warning
        signedAuthToken
        authToken {
          id
        }
      }
    }
  `,
  {
    name: 'createAuthToken',
    options: props => ({ refetchQueries: ['AuthTokensPage'] })
  }
)
export default class AuthTokenModal extends React.Component {
  state = {
    submitting: false,
    password: '',
    audience: '',
    warning: null,
    signedAuthToken: null,
    authTokenId: null
  };

  isSubmitDisabled = () => {
    const { password, audience } = this.state;
    return !(password && audience);
  };

  handleClose = () => {
    this.props.history.push('/settings');
  };

  handleChangePassword = e => {
    this.setState({ password: e.target.value });
  };

  handleChangeAudience = e => {
    this.setState({ audience: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    if (!this.isSubmitDisabled()) {
      const { password, audience } = this.state;
      const { data } = await this.props.createAuthToken({
        variables: { password, audience }
      });

      if (data.createAuthToken.ok) {
        this.setState({
          warning: null,
          signedAuthToken: data.createAuthToken.signedAuthToken,
          authTokenId: data.createAuthToken.authToken.id
        });
      } else {
        this.setState({
          warning: data.createAuthToken.warning,
          signedAuthToken: null,
          authTokenId: null
        });
      }
    }
  };

  render() {
    const {
      password,
      audience,
      warning,
      signedAuthToken,
      authTokenId
    } = this.state;

    return (
      <Modal title="Create an auth token" onClose={this.handleClose}>
        {signedAuthToken ? (
          <div>
            <TextBlock>
              Your auth token (id: {authTokenId}) has been created. You may now
              use it to make API requests. Please copy it for your records, as
              the following signed token will only appear once. You may revoke
              it at any time via the dashboard.
            </TextBlock>
            <CodeBlock>{signedAuthToken}</CodeBlock>
          </div>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <TextBlock>
              Auth tokens allow you to make requests to the Pavlov Storage API.
            </TextBlock>
            <FormError text={warning} />
            <InputField
              label="Your Password, Again"
              type="password"
              value={password}
              onChange={this.handleChangePassword}
            />
            <InputField
              label="Audience"
              type="text"
              value={audience}
              onChange={this.handleChangeAudience}
            />
            <SubmitButton disabled={this.isSubmitDisabled()}>
              Create
            </SubmitButton>
          </form>
        )}
      </Modal>
    );
  }
}
