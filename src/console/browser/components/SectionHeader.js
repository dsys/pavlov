import Icon from './Icon';
import InlineButton from './InlineButton';
import PropTypes from 'prop-types';
import React from 'react';
import colors from '../colors';

export default function SectionHeader({
  title,
  subtitle,
  icon,
  style,
  onClickIcon
}) {
  return (
    <header style={style}>
      <h2>{title}</h2>
      {icon && (
        <InlineButton onClick={onClickIcon} noPadding>
          <Icon name={icon} />
        </InlineButton>
      )}
      <style jsx>{`
        header {
          display: flex;
          align-items: center;
          margin: 40px 0 20px;
        }

        h2 {
          font-size: 18px;
          line-height: 20px;
          margin-right: 20px;
          color: ${colors.gray1};
        }
      `}</style>
    </header>
  );
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  onClickIcon: PropTypes.func
};
