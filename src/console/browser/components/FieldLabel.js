import React from 'react';
import colors from '../colors';

export default function FieldLabel({ text }) {
  return (
    <label>
      {text}
      <style jsx>{`
        label {
          color: ${colors.purple3};
          font-size: 12px;
          line-height: 20px;
          text-transform: uppercase;
          transition: all 0.2s;
        }
      `}</style>
    </label>
  );
}
