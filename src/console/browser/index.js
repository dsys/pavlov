import './styles/reset.scss';
import './styles/select.scss';
import 'react-toastify/dist/ReactToastify.min.css';

import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import apolloClient from './apollo';
import { ApolloProvider as Provider } from 'react-apollo';

const rootElem = document.getElementById('root');

if (__DEV__) {
  const { AppContainer } = require('react-hot-loader');

  // eslint-disable-next-line no-inner-declarations
  function render(AppComponent) {
    ReactDOM.render(
      React.createElement(
        AppContainer,
        {},
        <Provider client={apolloClient}>
          <AppComponent />
        </Provider>
      ),
      rootElem
    );
  }

  render(App);

  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App');
    render(NextApp);
  });
} else {
  ReactDOM.render(
    <Provider client={apolloClient}>
      <App />
    </Provider>,
    rootElem
  );
}
