import PropTypes from 'prop-types';
import React from 'react';
import squareImg from './square.png';
import wideImg from './wide.png';

export default function Logo({ height, shape, padded, center }) {
  const wrapperStyle = { margin: padded ? 20 : 0 };
  const imgStyle = {
    display: 'block',
    margin: center ? '0 auto' : 0,
    height
  };

  return (
    <div style={wrapperStyle}>
      <img src={shape === 'square' ? squareImg : wideImg} style={imgStyle} />
    </div>
  );
}

Logo.defaultProps = {
  height: '32px',
  shape: 'wide',
  padded: false,
  center: false
};

Logo.propTypes = {
  height: PropTypes.string,
  shape: PropTypes.oneOf(['square', 'wide']),
  padded: PropTypes.bool,
  center: PropTypes.bool
};
