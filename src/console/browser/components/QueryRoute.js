import React from 'react';
import { Route } from 'react-router';
import queryString from 'query-string';

export default function QueryRoute(props) {
  const Component = props.component;
  return (
    <Route
      path={props.path}
      render={routeProps => {
        routeProps.match.query = {
          ...(props.defaultQuery || {}),
          ...queryString.parse(routeProps.location.search, {
            arrayFormat: 'bracket'
          })
        };
        return <Component {...routeProps} />;
      }}
    />
  );
}
