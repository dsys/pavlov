import React from 'react';
import colors from '../colors';
import _ from 'lodash';
import Badge from './Badge';

export default function DataCell({ data }) {
  if (typeof data === 'string') {
    return <div>{data}</div>;
  } else if (typeof data === 'number') {
    return (
      <div>
        {data}
        <style jsx>{`
          div {
            color: ${colors.purple3};
          }
        `}</style>
      </div>
    );
  } else if (typeof data === 'boolean') {
    return <Badge text={data ? 'TRUE' : 'FALSE'} invert={!data} />;
  } else if (data == null) {
    return (
      <div>
        NULL
        <style jsx>{`
          div {
            color: ${colors.gray3};
            font-weight: bold;
          }
        `}</style>
      </div>
    );
  } else if (_.isPlainObject(data)) {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return (
        <div>
          {'{ }'}
          <style jsx>{`
            div {
              color: ${colors.gray3};
              font-weight: bold;
            }
          `}</style>
        </div>
      );
    } else {
      return (
        <table>
          <tbody>
            {keys.map((k, i) => (
              <tr key={i}>
                <td className="k">{k}</td>
                <td className="v">
                  <DataCell data={data[k]} />
                </td>
              </tr>
            ))}
          </tbody>
          <style jsx>{`
            tr {
              display: block;
              margin: 2px 0;
            }

            .k {
              padding: 0 4px;
              background: ${colors.gray2};
              border-radius: 2px;
            }

            .v {
              padding: 0 4px;
            }
          `}</style>
        </table>
      );
    }
  } else if (Array.isArray(data)) {
    return (
      <table>
        <tbody>
          {data.map((v, i) => (
            <tr key={i}>
              <td className="i">{i}</td>
              <td className="v">
                <DataCell data={v} />
              </td>
            </tr>
          ))}
        </tbody>
        <style jsx>{`
          tr {
            display: block;
            margin: 2px 0;
          }

          .i {
            padding: 0 4px;
            background: ${colors.gray2};
            border-radius: 2px;
          }

          .v {
            padding: 0 4px;
          }
        `}</style>
      </table>
    );
  } else {
    return <div>{JSON.stringify(data)}</div>;
  }
}
