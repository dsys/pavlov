import Icon from './Icon';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import colors from '../colors';

export default function Modal({ isOpen, children, onClose, title }) {
  const style = {
    overlay: { backgroundColor: colors.overlay, zIndex: 10 },
    content: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: 'none',
      background: 'transparent',
      borderRadius: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      minWidth: 480,
      minHeight: 480
    }
  };

  return (
    <ReactModal isOpen={isOpen} style={style} contentLabel="Modal">
      <div className="modal">
        <header>
          <h3 className="title">{title}</h3>
          <div className="close" onClick={onClose}>
            <Icon name="close" />
          </div>
        </header>
        {children}
      </div>
      <style jsx>{`
        .modal {
          min-width: 320px;
          min-height: 40px;
          max-width: 800px;
          max-height: 640px;
          background: ${colors.white};
          box-shadow: 0 2px 8px ${colors.gray1};
          border-radius: 8px;
          padding: 20px;
        }

        header {
          display: flex;
          justify-content: space-between;
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid ${colors.gray3};
        }

        .title {
          color: ${colors.gray1};
          font-size: 18px;
          line-height: 24px;
        }

        .close {
          color: ${colors.gray3};
          transition: color 0.2s;
          cursor: pointer;
        }

        .close:hover,
        .close:focus {
          color: ${colors.gray1};
        }
      `}</style>
    </ReactModal>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

Modal.defaultProps = {
  isOpen: true,
  onClose: () => {}
};
