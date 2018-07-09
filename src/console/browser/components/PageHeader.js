import PropTypes from 'prop-types';
import React from 'react';
import colors from '../colors';

export default function PageHeader({ title, subtitle }) {
  return (
    <header>
      <h1>{title}</h1>
      <h3>{subtitle}</h3>
      <style jsx>{`
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 40px 0;
        }

        h1 {
          font-size: 24px;
          line-height: 30px;
          color: ${colors.black};
        }

        h3 {
          font-size: 18px;
          line-height: 30px;
          color: ${colors.gray1};
        }
      `}</style>
    </header>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string
};
