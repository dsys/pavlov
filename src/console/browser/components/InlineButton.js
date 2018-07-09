import React from 'react';
import colors from '../colors';

export default function InlineButton({
  noPadding,
  primary,
  onClick,
  text,
  children
}) {
  return (
    <button
      onClick={onClick}
      style={{ padding: noPadding ? 0 : '4px 6px' }}
      className={primary ? 'primary' : ''}
    >
      {text || children}
      <style jsx>
        {`
          button {
            display: inline-block;
            cursor: pointer;
            color: ${colors.purple3};
            border: 1px solid ${colors.gray2};
            border-radius: 2px;
            background: ${colors.white};
            transition: color 0.2s, box-shadow 0.2s, border-color 0.2s;
            font-size: 14px;
          }

          button:hover,
          button:focus {
            border-color: ${colors.purple3};
          }

          button:active {
            box-shadow: inset 0 1px 2px ${colors.gray1};
          }

          button.primary {
            color: ${colors.white};
            border: 1px solid ${colors.purple1};
            background: ${colors.purple3};
          }
        `}
      </style>
    </button>
  );
}
