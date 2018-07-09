import PropTypes from 'prop-types';
import React from 'react';
import colors from '../colors';
import Icon from './Icon';

export default function FormError({ text }) {
  if (text) {
    return (
      <div className="wrapper">
        <Icon name="close" />
        <div className="text">{text}</div>
        <style jsx>
          {`
            .wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              line-height: 20px;
              color: ${colors.red};
              margin: 20px 0;
            }

            .text {
              margin-left: 10px;
            }
          `}
        </style>
      </div>
    );
  } else {
    return null;
  }
}

FormError.propTypes = { text: PropTypes.string };
