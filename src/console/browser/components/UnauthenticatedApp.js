import LoginPage from './LoginPage';
import React from 'react';
import RegisterPage from './RegisterPage';
import QueryRoute from './QueryRoute';
import { Switch, Route, Redirect } from 'react-router-dom';

export default function UnauthenticatedApp() {
  return (
    <Switch>
      <QueryRoute path="/register" component={RegisterPage} />
      <Route path="/login" component={LoginPage} />
      <Route render={() => <Redirect to="/login" />} />
    </Switch>
  );
}
