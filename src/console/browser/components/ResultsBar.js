import React from 'react';
import InlineButton from './InlineButton';
import Icon from './Icon';
import moment from 'moment';

export default function ResultsBar({ rowCount, lastUpdated, onDownloadCSV }) {
  const countText =
    rowCount === null ? '' : rowCount === 1 ? '1 row' : `${rowCount} rows`;

  const infoText = lastUpdated
    ? `Last updated at ${moment(lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}`
    : '';
  return (
    <div className="results-bar">
      <div className="count">{countText}</div>
      <div className="info">{infoText}</div>
      <div className="actions">
        {rowCount != null && (
          <InlineButton onClick={onDownloadCSV}>
            <div className="download-csv">
              <Icon name="drop" width={20} height={20} />
              <span>Download CSV</span>
            </div>
          </InlineButton>
        )}
      </div>
      <style jsx>{`
        .results-bar {
          display: flex;
          padding: 10px 20px;
          justify-content: space-between;
          align-items: center;
          height: 60px;
        }

        .count {
          font-weight: bold;
          font-size: 14px;
          width: 25%;
        }

        .info {
          flex-grow: 1;
          text-align: center;
        }

        .actions {
          text-align: right;
          width: 25%;
        }

        .download-csv {
          display: flex;
          align-items: center;
        }

        span {
          padding-left: 5px;
        }
      `}</style>
    </div>
  );
}
