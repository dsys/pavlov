import React from 'react';
import colors from '../colors';

export default function Footnote({ children }) {
  return (
    <div>
      {children}
      <style jsx>{`
        div {
          font-size: 12px;
          line-height: 20px;
          color: ${colors.gray1};
        }
      `}</style>
    </div>
  );
}
