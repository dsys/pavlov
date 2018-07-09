import React from 'react';
import colors from '../colors';

export default function SchemaReference({ schema }) {
  return (
    <ul className="tables">
      {schema.tables.map(({ name, columns }, i) => (
        <li key={i} className="table">
          <div className="table-name">{name}</div>
          <ul className="columns">
            {columns.map((col, j) => (
              <li key={j} className="column">
                <div className="column-info">
                  <div className="column-name">{col.name}</div>
                  {col.desc && <div className="column-desc">{col.desc}</div>}
                </div>
                <div className="column-type">{col.type.split(' ')[0]}</div>
              </li>
            ))}
          </ul>
        </li>
      ))}
      <style jsx>{`
        .tables {
          margin: 20px 0;
        }

        .table {
          margin: 10px 20px;
        }

        .table-name {
          font-size: 14px;
          color: ${colors.gray1};
          font-weight: bold;
          display: flex;
          align-items: center;
        }

        .columns {
          margin: 10px 0 10px 10px;
        }

        .column {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .column-name {
          font-weight: bold;
        }

        .column-desc {
          color: ${colors.gray1};
        }

        .column-type {
          color: ${colors.purple3};
          text-transform: uppercase;
        }

        .table-name,
        .column-name,
        .column-type {
          font-family: monospace;
        }
      `}</style>
    </ul>
  );
}
