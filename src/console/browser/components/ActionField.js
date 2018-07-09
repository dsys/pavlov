import Icon from './Icon';
import React from 'react';
import classNames from 'classnames';
import colors from '../colors';

export default function ActionField({
  actionAutohide,
  actionIcon,
  actionText,
  onAction,
  children
}) {
  return (
    <div className={classNames('action-field', { autohide: actionAutohide })}>
      <div className="left">{children}</div>
      <div className="right">
        <button className="action" onClick={onAction}>
          <span>{actionText}</span>
          <Icon name={actionIcon} width={20} height={20} />
        </button>
      </div>
      <style jsx>{`
        .action-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .left {
          flex: auto;
        }

        .right {
          flex: none;
        }

        .autohide .right {
          visibility: hidden;
        }

        .autohide:hover .right {
          visibility: visible;
        }

        button {
          border: 0;
          padding: 5px;
          background: transparent;
          color: ${colors.gray3};
          transition: color 0.2s;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        button:focus,
        button:hover {
          color: ${colors.gray1};
        }

        span {
          margin-right: 0.5em;
        }
      `}</style>
    </div>
  );
}
