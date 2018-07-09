import Icon from './Icon';
import colors from '../colors';
import React from 'react';

export default function DeleteButton(props) {
  return (
    <button {...props}>
      <Icon name="delete" />
      <style jsx>
        {`
          button {
            display: block;
            color: ${colors.gray1};
            transition: color 0.2s;
            background: transparent;
            border: none;
            padding: 0;
            cursor: pointer;
          }

          button:hover,
          button:focus {
            color: ${colors.red};
          }
        `}
      </style>
    </button>
  );
}
