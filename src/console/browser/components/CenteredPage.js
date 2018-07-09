import React from 'react';

export default function CenteredPage({ children }) {
  return (
    <div className="centered-page">
      <div>{children}</div>
      <style jsx>
        {`
          .centered-page {
            display: flex;
            min-width: 100vw;
            min-height: 100vh;
            width: 320px;
            padding: 20px;
            height: 640px;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
}
