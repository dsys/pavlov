import React from 'react';
import colors from '../colors';

export default function Well({ children, style }) {
  return (
    <div style={style}>
      {children}
      <style jsx>{`
        div {
          border: 1px solid ${colors.gray2};
          padding: 20px 20px;
          border-radius: 4px;
          box-shadow: 0 2px 5px ${colors.blackTransparent};
          background: ${colors.white};
        }
      `}</style>
    </div>
  );
}
