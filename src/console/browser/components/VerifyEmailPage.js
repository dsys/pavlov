import CenteredPage from './CenteredPage';
import DocumentTitle from './DocumentTitle';
import Logo from './Logo';
import React from 'react';
import colors from '../colors';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';

@graphql(
  gql`
    mutation VerifyEmail($verificationCode: String!) {
      verifyEmail(verificationCode: $verificationCode) {
        ok
        warning
      }
    }
  `,
  { name: 'verifyEmail' }
)
export default class VerifyEmailPage extends React.Component {
  state = { ok: null, warning: null };

  async componentDidMount() {
    const { match } = this.props;
    const {
      data: { verifyEmail: { ok, warning } }
    } = await this.props.verifyEmail({
      variables: { verificationCode: match.params.verificationCode }
    });

    this.setState({ ok, warning });
  }

  render() {
    return (
      <DocumentTitle>
        <CenteredPage>
          <Logo center height="64px" shape="square" />
          {this.state.ok ? (
            <div>
              <p>Thanks for verifying your email!</p>
              <p>
                <Link to="/">Return to the Pavlov Console &raquo;</Link>
              </p>
            </div>
          ) : this.state.warning ? (
            <div>
              <p className="warning">{this.state.warning}</p>
              <p className="note">You can close this window.</p>
            </div>
          ) : (
            <div>
              <p>Verifying...</p>
              <p className="note">Please do not close this window.</p>
            </div>
          )}
          <style jsx>{`
            p {
              font-size: 14px;
              margin: 20px 0;
              text-align: center;
            }

            .note {
              font-style: italic;
              color: ${colors.gray1};
            }

            .warning {
              color: ${colors.red};
            }
          `}</style>
        </CenteredPage>
      </DocumentTitle>
    );
  }
}
