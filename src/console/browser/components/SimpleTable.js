import React from 'react';
import Well from './Well';
import colors from '../colors';

export default function SimpleTable({ well, data }) {
  const table = (
    <table>
      <tbody>
        {data.map(([head, body], i) => (
          <tr key={i}>
            <th>{head}</th>
            <td>{body}</td>
          </tr>
        ))}
      </tbody>
      <style jsx>{`
        table {
          width: 100%;
          font-size: 14px;
        }

        th {
          width: 25%;
          color: ${colors.purple3};
          text-align: left;
          border-right: 1px solid ${colors.gray2};
          padding: 5px 20px 5px 0;
          vertical-align: middle;
          height: 40px;
        }

        td {
          width: 75%;
          text-overflow: ellipsis;
          height: 40px;
          overflow-x: hidden;
          padding: 5px 0 5px 20px;
          vertical-align: middle;
        }
      `}</style>
    </table>
  );

  return well ? <Well>{table}</Well> : table;
}
