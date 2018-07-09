import React from 'react';
import PropTypes from 'prop-types';
import ReactDocumentTitle from 'react-document-title';

export default function DocumentTitle({ title, children }) {
  const formattedTitle = title ? `${title} | Pavlov` : 'Pavlov';
  return (
    <ReactDocumentTitle title={formattedTitle}>{children}</ReactDocumentTitle>
  );
}

DocumentTitle.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element
};
