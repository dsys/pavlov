import React from 'react';
import colors from '../colors';
import classNames from 'classnames';

export default function HTTPStatus({ code }) {
  return (
    <span
      className={classNames({
        success: code !== 0 && code < 400,
        error: code === 0 || code >= 400
      })}
    >
      {code === 0 ? 'ERROR' : code}
      <style jsx>{`
        font-weight: bold;

        .success {
          color: ${colors.green};
        }

        .error {
          color: ${colors.red};
        }
      `}</style>
    </span>
  );
}
