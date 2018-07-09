import React from 'react';
import colors from '../colors';

export default function TextBlock({ children, style }) {
  return (
    <p>
      {children}
      <style jsx>
        {`
          p {
            font-size: 14px;
            line-height: 20px;
            color: ${colors.black};
            margin-bottom: 20px;
          }
        `}
      </style>
    </p>
  );
}
