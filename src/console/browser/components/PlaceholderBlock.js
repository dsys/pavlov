import Icon from './Icon';
import React from 'react';
import colors from '../colors';

export default function PlaceholderBlock({
  icon = 'default',
  text = 'Nothing to see here.'
}) {
  return (
    <div className="placeholder">
      <div className="emoji">
        <Icon name={icon} width={48} height={48} />
      </div>
      <div className="text">{text}</div>
      <style jsx>{`
        .placeholder {
          padding: 40px;
          background: ${colors.gray2};
          border-radius: 8px;
          color: ${colors.gray1};
        }

        .emoji {
          display: flex;
          justify-content: center;
          margin: 10px 0;
        }

        .text {
          text-align: center;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
