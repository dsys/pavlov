import React from 'react';
import colors from '../colors';

export default function Badge({ text, invert }) {
  return (
    <span className={invert ? 'invert' : ''}>
      {text}
      <style jsx>{`
        span {
          font-size: 12px;
          vertical-align: center;
          display: inline-block;
          padding: 0 4px;
          letter-spacing: 1px;
          border-radius: 2px;
          font-weight: bold;
          border: 1px solid ${colors.purple3};
          color: ${colors.white};
          background: ${colors.purple3};
        }

        .invert {
          color: ${colors.purple3};
          background: ${colors.white};
        }
      `}</style>
    </span>
  );
}
