import React from 'react';
import colors from '../colors';

export default function BigButton({ onClick, children }) {
  return (
    <button onClick={onClick}>
      <div>{children}</div>
      <style jsx>{`
        button {
          background: ${colors.white};
          border: 1px solid ${colors.gray1};
          border-bottom: 2px solid ${colors.gray1};
          font-size: 26px;
          line-height: normal;
          padding: 40px 40px;
          color: ${colors.black};
          width: 100%;
          border-radius: 2px;
          outline: none;
          transition: box-shadow 0.2s;
          box-shadow: 0 1px 1px ${colors.gray2};
          margin: 20px;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button:hover,
        button:focus {
          box-shadow: 0 0 5px 5px ${colors.gray2};
        }

        button:active {
          margin-top: 21px;
          border-bottom-width: 1px;
          box-shadow: inset 0 0 5px 5px ${colors.gray2};
        }

        button > div {
          height: 100%;
        }
      `}</style>
    </button>
  );
}
