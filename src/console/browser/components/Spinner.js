import React from 'react';
import colors from '../colors';

export default function Spinner({
  size = 40,
  margin = '80px auto',
  bgColor = colors.gray3
}) {
  return (
    <div className="spinner-wrapper" style={{ margin }}>
      <div className="spinner" style={{ width: size, height: size }} />
      <style jsx>{`
        .spinner-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .spinner {
          background-color: ${bgColor};
          animation: sk-rotateplane 1.2s infinite ease-in-out;
        }

        @keyframes sk-rotateplane {
          0% {
            transform: perspective(120px) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
          }
          100% {
            transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
          }
        }
      `}</style>
    </div>
  );
}
