import AuthenticatedApp from './AuthenticatedApp';
import EmbeddedTargetContextPage from './EmbeddedTargetContextPage';
import MTurkPage from './MTurkPage';
import QueryRoute from './QueryRoute';
import React from 'react';
import TelemetrySandboxPage from './TelemetrySandboxPage';
import UnauthenticatedApp from './UnauthenticatedApp';
import VerifyEmailPage from './VerifyEmailPage';
import colors from '../colors';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { isAuthenticated, addAuthListener, removeAuthListener } from '../auth';

export default class App extends React.Component {
  state = { isAuthenticated: isAuthenticated() };

  componentWillMount() {
    addAuthListener(this.handleAuth);
  }

  componentWillUnmount() {
    removeAuthListener(this.handleAuth);
  }

  handleAuth = auth => {
    this.setState({ isAuthenticated: isAuthenticated() });
  };

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route
              path="/verify/:verificationCode"
              component={VerifyEmailPage}
            />
            <QueryRoute
              path="/ext/target/:targetId"
              component={EmbeddedTargetContextPage}
            />
            <QueryRoute
              path="/ext/mturk/:externalTaskId"
              component={MTurkPage}
            />
            <QueryRoute
              path="/ext/telemetry/sandbox"
              component={TelemetrySandboxPage}
            />
            <Route
              render={() =>
                this.state.isAuthenticated ? (
                  <AuthenticatedApp />
                ) : (
                  <UnauthenticatedApp />
                )}
            />
          </Switch>
        </BrowserRouter>
        <ToastContainer
          position="top-center"
          style={{ zIndex: 100 }}
          type="default"
          autoClose={5000}
          hideProgressBar={false}
          toastClassName="__toast-wrapper"
          bodyClassName="__toast-body"
          progressClassName="__toast-progress"
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        <style jsx>{`
          div :global(.__toast-wrapper) {
            border-radius: 5px;
            padding: 20px;
            font-family: inherit;
          }

          div :global(.__toast-body) {
            font-size: 14px;
            color: ${colors.black};
            font-family: inherit;
          }

          div :global(.__toast-progress) {
            background: ${colors.purple3};
          }
        `}</style>
      </div>
    );
  }
}
