import AlphaNotice from './AlphaNotice';
import CenteredPage from './CenteredPage';
import DocumentTitle from './DocumentTitle';
import FormError from './FormError';
import HorizontalRule from './HorizontalRule';
import InputField from './InputField';
import Logo from './Logo';
import React, { Component } from 'react';
import Recaptcha from './Recaptcha';
import Small from './Small';
import StepList from './StepList';
import SubmitButton from './SubmitButton';
import _ from 'lodash';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { toast } from 'react-toastify';
import { useAuth } from '../auth';

const CHECK_CALL_DEBOUNCE = 200;

@graphql(
  gql`
    mutation CheckInviteCode($inviteCode: String!) {
      checkInviteCode(inviteCode: $inviteCode) {
        ok
        database {
          name
        }
      }
    }
  `,
  {
    name: 'checkInviteCode'
  }
)
@graphql(
  gql`
    mutation CheckUsername($inviteCode: String!, $username: String!) {
      checkUsername(inviteCode: $inviteCode, username: $username) {
        ok
        warning
      }
    }
  `,
  {
    name: 'checkUsername'
  }
)
@graphql(
  gql`
    mutation CheckPassword($inviteCode: String!, $password: String!) {
      checkPassword(inviteCode: $inviteCode, password: $password) {
        ok
        strength
        warning
        suggestions
      }
    }
  `,
  {
    name: 'checkPassword'
  }
)
@graphql(
  gql`
    mutation CheckEmail($inviteCode: String!, $email: String!) {
      checkEmail(inviteCode: $inviteCode, email: $email) {
        ok
        warning
      }
    }
  `,
  {
    name: 'checkEmail'
  }
)
@graphql(
  gql`
    mutation CreateUser(
      $username: String!
      $password: String!
      $email: String!
      $preferredName: String!
      $inviteCode: String!
      $recaptchaResponse: String!
    ) {
      createUser(
        username: $username
        password: $password
        email: $email
        preferredName: $preferredName
        inviteCode: $inviteCode
        recaptchaResponse: $recaptchaResponse
      ) {
        ok
        warning
        signedAuthToken
        authToken {
          id
        }
      }
    }
  `,
  { name: 'createUser' }
)
export default class RegisterPage extends Component {
  state = {
    inviteCode: '',
    username: '',
    password: '',
    email: '',
    preferredName: '',
    usernameCheck: null,
    passwordCheck: null,
    emailCheck: null,
    recaptchaResponse: null,
    warning: null,
    renderRecaptcha: false
  };

  componentWillMount() {
    this.setState({ inviteCode: this.props.match.query.inviteCode });
  }

  handleChangeInviteCode = e => {
    this.setState({ inviteCode: e.target.value });
  };

  handleSubmitInviteCode = async e => {
    e.preventDefault();

    const inviteCode = this.state.inviteCode;
    if (inviteCode) {
      const {
        data: { checkInviteCode: { ok, database } }
      } = await this.props.checkInviteCode({
        variables: { inviteCode }
      });

      if (ok) {
        this.setState({ warning: null, databaseName: database.name });
      } else {
        this.setState({ warning: 'invalid invite code' });
      }
    }
  };

  handleSubmitRegister = e => {
    e.preventDefault();

    if (!this.isComplete() || this.state.renderRecaptcha) {
      return;
    }

    this.setState({ renderRecaptcha: true });
  };

  onChangeUsername = e => {
    const username = e.target.value;
    this.setState({ username, usernameCheck: null });
    if (username !== '') {
      this.checkUsername();
    }
  };

  onChangePassword = e => {
    const password = e.target.value;
    this.setState({ password, passwordCheck: null });
    if (password !== '') {
      this.checkPassword();
    }
  };

  onChangeEmail = e => {
    const email = e.target.value;
    this.setState({ email, emailCheck: null });
    if (email !== '') {
      this.checkEmail();
    }
  };

  onChangePreferredName = e => {
    this.setState({ preferredName: e.target.value });
  };

  onChangeRecaptchaResponse = async recaptchaResponse => {
    if (recaptchaResponse == null) {
      this.setState({ renderRecaptcha: false });
    }

    const variables = _.pick(this.state, [
      'username',
      'password',
      'email',
      'preferredName',
      'inviteCode'
    ]);

    variables.recaptchaResponse = recaptchaResponse;

    const {
      data: { createUser: { ok, warning, signedAuthToken, authToken } }
    } = await this.props.createUser({
      variables
    });

    if (ok) {
      useAuth({ signedAuthToken, authTokenId: authToken.id });
      this.props.history.push('/');
      toast('Please check your email to verify your Pavlov account.');
    } else {
      this.setState({ renderRecaptcha: false, warning });
    }
  };

  checkUsername = _.debounce(async () => {
    const { inviteCode, username } = this.state;
    const { data: { checkUsername } } = await this.props.checkUsername({
      variables: { inviteCode, username }
    });
    if (this.state.username === username) {
      this.setState({ usernameCheck: checkUsername });
    }
  }, CHECK_CALL_DEBOUNCE);

  checkPassword = _.debounce(async () => {
    const { inviteCode, password } = this.state;
    const { data: { checkPassword } } = await this.props.checkPassword({
      variables: { inviteCode, password }
    });
    if (this.state.password === password) {
      this.setState({ passwordCheck: checkPassword });
    }
  }, CHECK_CALL_DEBOUNCE);

  checkEmail = _.debounce(async () => {
    const { inviteCode, email } = this.state;
    const { data: { checkEmail } } = await this.props.checkEmail({
      variables: { inviteCode, email }
    });
    if (this.state.email === email) {
      this.setState({ emailCheck: checkEmail });
    }
  }, CHECK_CALL_DEBOUNCE);

  isComplete = () => {
    return (
      this.state.inviteCode &&
      this.state.username &&
      this.state.password &&
      this.state.usernameCheck &&
      this.state.usernameCheck.ok &&
      this.state.passwordCheck &&
      this.state.passwordCheck.ok &&
      this.state.emailCheck &&
      this.state.emailCheck.ok
    );
  };

  render() {
    const {
      inviteCode,
      username,
      password,
      email,
      preferredName,
      usernameCheck,
      passwordCheck,
      emailCheck,
      recaptchaResponse,
      warning,
      databaseName,
      renderRecaptcha
    } = this.state;

    if (databaseName) {
      return (
        <DocumentTitle title="Register">
          <div className="page">
            <Logo center height="64px" shape="square" />
            <div className="columns">
              <div className="left">
                <StepList
                  steps={[
                    { text: 'Invite Code', state: 'complete' },
                    { text: 'Set up Account', state: 'active' },
                    { text: 'Integrate', state: 'incomplete' }
                  ]}
                />
              </div>
              <form className="right" onSubmit={this.handleSubmitRegister}>
                <div className="field">
                  <div className="input">
                    <InputField
                      label="username"
                      type="text"
                      value={username}
                      disabled={renderRecaptcha}
                      invalid={usernameCheck && !usernameCheck.ok}
                      onChange={this.onChangeUsername}
                    />
                  </div>
                  <div className="assistant">
                    {usernameCheck ? (
                      usernameCheck.ok ? (
                        <Small text="Looks good!" />
                      ) : (
                        <Small danger text={usernameCheck.warning} />
                      )
                    ) : (
                      <Small text="This is what you will use to log into the Pavlov Console." />
                    )}
                  </div>
                </div>
                <div className="field">
                  <div className="input">
                    <InputField
                      label="password"
                      type="password"
                      value={password}
                      disabled={renderRecaptcha}
                      invalid={passwordCheck && !passwordCheck.ok}
                      onChange={this.onChangePassword}
                    />
                  </div>
                  <div className="assistant">
                    {passwordCheck ? (
                      passwordCheck.ok ? (
                        <Small text="Nice password!" />
                      ) : (
                        <div>
                          <Small danger text={passwordCheck.warning} />
                          <Small text={passwordCheck.suggestions.join(' ')} />
                        </div>
                      )
                    ) : (
                      <Small text="Choose something easy to remember yet hard to guess." />
                    )}
                  </div>
                </div>
                <HorizontalRule />
                <div className="field">
                  <div className="input">
                    <InputField
                      disabled
                      label="Company Name"
                      type="text"
                      value={databaseName}
                    />
                  </div>
                  <div className="assistant">
                    <Small text="This is the Pavlov database associated with your invite code." />
                  </div>
                </div>
                <div className="field">
                  <div className="input">
                    <InputField
                      label="Company Email"
                      type="email"
                      value={email}
                      disabled={renderRecaptcha}
                      onChange={this.onChangeEmail}
                    />
                  </div>
                  <div className="assistant">
                    {emailCheck ? (
                      emailCheck.ok ? (
                        <Small text="Sounds good to me." />
                      ) : (
                        <Small danger text={emailCheck.warning} />
                      )
                    ) : (
                      <Small text="Please don't use personal emails." />
                    )}
                  </div>
                </div>
                <div className="field">
                  <div className="input">
                    <InputField
                      label="Your Preferred Name"
                      type="text"
                      value={preferredName}
                      disabled={renderRecaptcha}
                      onChange={this.onChangePreferredName}
                    />
                  </div>
                  <div className="assistant">
                    <Small text="How would you like to be referred to?" />
                  </div>
                </div>
                <HorizontalRule />
                <div className="field">
                  <div className="input">
                    <SubmitButton disabled={renderRecaptcha}>
                      register &raquo;
                    </SubmitButton>
                  </div>
                  <div className="assistant">
                    <Small>
                      By clicking register, you agree to the Pavlov Terms of
                      Service.
                    </Small>
                  </div>
                </div>
                {renderRecaptcha && (
                  <Recaptcha
                    recaptchaResponse={recaptchaResponse}
                    onChange={this.onChangeRecaptchaResponse}
                  />
                )}
              </form>
            </div>
            <style jsx>{`
              .page {
                width: 100%;
                max-width: 1024px;
                margin: 0 auto;
                padding: 100px 20px;
              }

              .columns {
                display: flex;
                margin-top: 40px;
              }

              .left {
                flex: 1 0 0;
                margin: 20px 20px 20px 0;
              }

              .right {
                flex: 3 0 0;
              }

              .field {
                display: flex;
                align-items: center;
              }

              .input {
                flex: 2 0 0;
              }

              .assistant {
                margin-left: 20px;
                flex: 1 0 0;
                margin-top: 20px;
              }
            `}</style>
          </div>
        </DocumentTitle>
      );
    } else {
      return (
        <DocumentTitle title="Enter Invite Code">
          <CenteredPage>
            <Logo center height="64px" shape="square" />
            <AlphaNotice />
            <form onSubmit={this.handleSubmitInviteCode}>
              <FormError text={warning} />
              <InputField
                label="Invite Code"
                type="text"
                value={inviteCode}
                onChange={this.handleChangeInviteCode}
              />
              <SubmitButton>Use Invite Code</SubmitButton>
            </form>
          </CenteredPage>
        </DocumentTitle>
      );
    }
  }
}
