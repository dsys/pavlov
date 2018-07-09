import React from 'react';
import queryString from 'query-string';
import { Link } from 'react-router';

export default function QueryLink(props) {
  const search = props.merge
    ? {
        ...queryString.parse(window.location.search, {
          arrayFormat: 'bracket'
        }),
        ...props.to.query
      }
    : props.to.query;

  return <Link {...props} to={{ ...props.to, search }} />;
}
