import PropTypes from 'prop-types';
import React from 'react';
import colors from '../colors';

export default function Table({ cols, rows, renderRow }) {
  return (
    <table>
      <thead>
        <tr>{cols.map((k, i) => <th key={i}>{k}</th>)}</tr>
      </thead>
      <tbody>{rows.map(renderRow)}</tbody>
      <style jsx>{`
        table {
          background: ${colors.white};
          margin: 20px 0;
          width: 100%;
        }

        th {
          padding: 5px 10px 5px 0;
          text-align: left;
          color: ${colors.purple3};
          font-size: 12px;
          line-height: 20px;
          text-transform: uppercase;
        }

        tbody :global(strong) {
          font-weight: bold;
        }

        tbody :global(tr:hover) {
          background: ${colors.gray2};
        }

        tbody :global(td) {
          border-top: 1px solid ${colors.gray3};
          padding: 5px 10px 5px 0;
          vertical-align: middle;
        }
      `}</style>
    </table>
  );
}

Table.propTypes = {
  cols: PropTypes.arrayOf(PropTypes.string),
  rows: PropTypes.arrayOf(PropTypes.any),
  renderRow: PropTypes.func.isRequired
};

Table.defaultProps = { cols: [], rows: [] };
