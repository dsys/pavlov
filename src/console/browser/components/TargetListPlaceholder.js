import React from 'react';
import colors from '../colors';

export default function TargetListPlaceholder({ text, style }) {
  return (
    <div style={style}>
      {text}
      <style jsx>{`
        div {
          padding: 20px;
          color: ${colors.white};
          text-align: center;
          font-size: 18px;
          text-shadow: 0 -1px ${colors.blackTransparent};
        }
      `}</style>
    </div>
  );
}
