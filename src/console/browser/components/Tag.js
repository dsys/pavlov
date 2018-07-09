import React from 'react';
import colors from '../colors';

function generateText(label, score) {
  if (score != null) {
    return (
      <span>
        {label} <span className="score">{score.toFixed(2)}</span>
        <style jsx>{`
          .score {
            padding-left: 0.25em;
          }
        `}</style>
      </span>
    );
  } else {
    return label;
  }
}

export default function Tag({ label, score, style }) {
  const text = generateText(label, score);
  const { fg, bg } = colors.forLabel(label);
  const styleWithColor = { ...style, background: bg, color: fg };
  return (
    <strong style={styleWithColor}>
      {text}
      <style jsx>{`
        strong {
          font-size: 10px;
          display: inline-block;
          padding: 0 6px;
          line-height: 20px;
          letter-spacing: 0.05em;
          text-align: center;
          border-radius: 4px;
          border: 2px solid ${colors.gray2};
          margin-right: -2px;
        }
      `}</style>
    </strong>
  );
}
