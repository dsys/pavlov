import React from 'react';
import colors from '../colors';

export default function Code({ children, style }) {
  return (
    <code style={style}>
      {children}
      <style jsx>{`
        code {
          background: ${colors.gray2};
          padding: 2px 4px;
          border-radius: 2px;
          color: ${colors.black};
          font-family: monospace;
        }
      `}</style>
    </code>
  );
}
