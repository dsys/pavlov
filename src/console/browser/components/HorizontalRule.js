import React from 'react';
import colors from '../colors';

export default function HorizontalRule() {
  return (
    <div>
      <hr />
      <style jsx>
        {`
          hr {
            background: ${colors.gray3};
            border: 0;
            height: 1px;
            margin: 40px 0;
          }
        `}
      </style>
    </div>
  );
}
