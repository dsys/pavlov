/*eslint-disable no-console*/
import colors from '../colors';
import React from 'react';

export default class ImageModerationInstructions extends React.Component {
  render() {
    return (
      <div className="instructions">
        <div className="header">
          <span className="red">DIRTY &#x2718;</span> OR{' '}
          <span className="green">CLEAN &#x2714;</span>
        </div>
        <div className="details">
          Dirty images contain any material that may result in a lawsuit upon
          printing or resale. If an image does not contain any such material, it
          is considered clean.
        </div>
        <div className="dirty-content-list red">
          <div>
            <span>&#x2718;</span> LOGOS, BRANDNAMES and TRADEMARKS
          </div>
          <div>
            <span>&#x2718;</span> TV SHOWS, MOVIES and BOOKS
          </div>
          <div>
            <span>&#x2718;</span> HATE SPEECH and other OFFENSIVE CONTENT
          </div>
          <div>
            <span>&#x2718;</span> SPORTS TEAMS
          </div>
        </div>
        <style jsx>{`
          .instructions {
          }

          .header {
            font-size: 2em;
            font-weight: 500;
            margin-bottom: 10px;
          }

          .header > div:first-of-type {
            margin-bottom: 5px;
          }

          .details {
            font-size: 1.3em;
            font-style: italic;
            margin-bottom: 10px;
          }

          .dirty-content-list {
            display: none;
            font-size: 1.3em;
            font-weight: 300;
          }

          .dirty-content-list > div {
          }

          .red {
            color: ${colors.red};
          }

          .green {
            color: ${colors.green};
          }
        `}</style>
      </div>
    );
  }
}
