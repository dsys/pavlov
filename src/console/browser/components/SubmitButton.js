import React from 'react';
import colors from '../colors';

export default function SubmitButton({ text, disabled, children }) {
  return (
    <button disabled={disabled}>
      {text || children}
      <style jsx>{`
        button {
          background: ${colors.purple2};
          border: 1px solid ${colors.purple1};
          border-bottom: 2px solid ${colors.purple1};
          border-radius: 2px;
          box-shadow: 0 1px 1px ${colors.gray2};
          color: ${colors.white};
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          line-height: 1;
          margin-top: 20px;
          outline: none;
          padding: 20px;
          text-align: center;
          text-decoration: none;
          transition: color 0.2s, background 0.2s, border-color 0.2s,
            box-shadow 0.2s;
          text-transform: uppercase;
          width: 100%;
        }

        button:active {
          margin-top: 21px;
          border-bottom-width: 1px;
          box-shadow: inset 0 1px 2px ${colors.black}, 0 -1px 0 ${colors.gray2};
        }

        button:focus,
        button:hover {
          background: ${colors.purple3};
          border-color: ${colors.purple2};
          box-shadow: 0 1px 2px ${colors.gray2};
        }

        button[disabled] {
          background: ${colors.white};
          border: 1px solid ${colors.gray2};
          border-bottom: 2px solid ${colors.gray2};
          color: ${colors.gray1};
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}
