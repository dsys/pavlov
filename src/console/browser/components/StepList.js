import React from 'react';
import colors from '../colors';

export default function StepList({ steps }) {
  return (
    <ul>
      <div className="vertical-line" />
      {steps.map((step, i) => (
        <li key={i} className={step.state}>
          <div className="orb">{i + 1}</div> {step.text}
        </li>
      ))}
      <style jsx>{`
        ul {
          position: relative;
        }

        li {
          display: flex;
          align-items: center;
          text-transform: uppercase;
          font-size: 18px;
          color: ${colors.gray1};
        }

        li + li {
          margin-top: 20px;
        }

        .orb {
          min-width: 30px;
          width: 30px;
          height: 30px;
          background: ${colors.white};
          border: 2px solid ${colors.gray1};
          border-radius: 15px;
          text-align: center;
          line-height: 26px;
          margin-right: 20px;
        }

        li.complete .orb {
          border-color: ${colors.purple3};
          background: ${colors.purple3};
          color: ${colors.white};
        }

        li.active {
          color: ${colors.purple3};
        }

        li.active .orb {
          border-color: ${colors.purple3};
          background: ${colors.white};
          color: ${colors.purple3};
        }

        .vertical-line {
          position: absolute;
          left: 13px;
          top: 10px;
          bottom: 10px;
          width: 4px;
          background: ${colors.gray3};
          z-index: -1;
        }
      `}</style>
    </ul>
  );
}
