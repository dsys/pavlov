import React from 'react';
import colors from '../colors';

export default function Notice({ children }) {
  return (
    <div>
      {children}
      <style jsx>{`
        div {
          background: ${colors.purpleTransparent};
          text-align: center;
          padding: 20px;
          border: 1px solid ${colors.purple3};
          border-radius: 5px;
          color: ${colors.purple3};
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
}
