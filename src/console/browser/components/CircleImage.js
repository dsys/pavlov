import Icon from './Icon';
import React from 'react';
import colors from '../colors';

export default function CircleImage({ src, alt, style, icon }) {
  return (
    <div style={style} className="circle" title={alt}>
      <Icon name={icon} />
      {src && (
        <div className="image" style={{ backgroundImage: `url(${src})` }} />
      )}
      <style jsx>{`
        .circle {
          display: block;
          padding: 0
          width: 40px;
          height: 40px;
          color: ${colors.gray1};
          background: ${colors.gray3};
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
          position: relative;
        }

        .image {
          position: absolute;
          left: 2px;
          top: 2px;
          display: block;
          width: 36px;
          height: 36px;
          border-radius: 4px;
          background-repeat: no-repeat;
          background-position: 50%;
          background-size: cover;
        }
      `}</style>
    </div>
  );
}
