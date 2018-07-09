import React from 'react';
import colors from '../colors';

export default function Small({ danger, children, text }) {
  return (
    <small className={danger ? 'danger' : null}>
      {children ? children : text}
      <style jsx>{`
        small {
          font-size: 10px;
          color: ${colors.gray1};
        }

        .danger {
          color: ${colors.red};
        }

        small + small {
          padding-left: 0.25em;
        }
      `}</style>
    </small>
  );
}
