import AlphaNotice from './AlphaNotice';
import CenteredPage from './CenteredPage';
import DocumentTitle from './DocumentTitle';
import FormError from './FormError';
import InputField from './InputField';
import Logo from './Logo';
import React, { Component } from 'react';
import SubmitButton from './SubmitButton';
import colors from '../colors';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { useAuth } from '../auth';

@graphql(
  gql`
    mutation CreateAuthToken($username: String!, $password: String!) {
      createAuthToken(username: $username, password: $password) {
        ok
        warning
        signedAuthToken
        authToken {
          id
        }
      }
    }
  `,
  { name: 'createAuthToken' }
)
export default class LoginPage extends Component {
  state = { username: '', password: '', warning: '' };

  handleSubmit = async e => {
    e.preventDefault();

    const { username, password } = this.state;
    if (username && password) {
      const {
        data: { createAuthToken: { ok, warning, signedAuthToken, authToken } }
      } = await this.props.createAuthToken({
        variables: { username, password }
      });

      if (ok) {
        useAuth({ signedAuthToken, authTokenId: authToken.id });
        this.props.history.push('/');
      } else {
        this.setState({ warning });
      }
    }
  };

  handleChangeUsername = e => {
    this.setState({ username: e.target.value });
  };

  handleChangePassword = e => {
    this.setState({ password: e.target.value });
  };

  isComplete = () => {
    const { username, password } = this.state;
    return username && password;
  };

  render() {
    const { username, password, warning } = this.state;

    return (
      <DocumentTitle title="Login">
        <CenteredPage>
          <div className="logo">
            <Logo height="64px" shape="square" />
          </div>
          <AlphaNotice />
          <form onSubmit={this.handleSubmit}>
            <FormError text={warning} />
            <InputField
              label="username"
              type="text"
              value={username}
              onChange={this.handleChangeUsername}
            />
            <InputField
              label="password"
              type="password"
              value={password}
              onChange={this.handleChangePassword}
            />
            <SubmitButton disabled={!this.isComplete()}>
              log in &raquo;
            </SubmitButton>
          </form>
          <style jsx>{`
            .logo {
              display: flex;
              justify-content: center;
              margin-bottom: 20px;
            }

            small {
              display: block;
              color: ${colors.gray1};
              text-align: center;
              margin-top: 20px;
            }
          `}</style>
        </CenteredPage>
      </DocumentTitle>
    );
  }
}
