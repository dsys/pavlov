import React from 'react';
import colors from '../colors';

export default function Identifier({ id }) {
  return (
    <code>
      {id}
      <style jsx>{`
        code {
          background: ${colors.black};
          padding: 2px 4px;
          border-radius: 2px;
          color: ${colors.gray3};
          font-family: monospace;
        }
      `}</style>
    </code>
  );
}
