import 'react-virtualized/styles.css';

import DataCell from './DataCell';
import React from 'react';
import colors from '../colors';
import { AutoSizer, Table, Column } from 'react-virtualized';

export default class DataTable extends React.Component {
  rowGetter = ({ index }) => {
    const { data, skeleton } = this.props;
    if (skeleton) {
      return null;
    } else {
      return data[index];
    }
  };

  cellRenderer = ({ cellData, columnData }) => {
    return <DataCell data={cellData} />;
  };

  render() {
    const { headers, data, skeleton } = this.props;

    return (
      <div>
        <AutoSizer>
          {({ width, height }) => (
            <Table
              height={height}
              width={width}
              headerHeight={48}
              rowHeight={48}
              rowCount={skeleton ? 100 : data.length}
              rowGetter={this.rowGetter}
              className={skeleton ? 'skeleton' : ''}
            >
              {!skeleton &&
                headers.map((h, i) => (
                  <Column
                    key={i}
                    label={h.label}
                    dataKey={h.dataKey}
                    width={500}
                    cellRenderer={this.cellRenderer}
                  />
                ))}
            </Table>
          )}
        </AutoSizer>
        <style jsx>{`
          div {
            height: 100%;
          }

          div :global(.ReactVirtualized__Table__headerRow) {
            box-shadow: 0 2px 4px ${colors.gray3};
          }

          div :global(.ReactVirtualized__Table__headerColumn) {
            padding-right: 10px;
            display: flex;
            align-items: center;
            border-right: 1px solid ${colors.gray3};
          }

          div :global(.ReactVirtualized__Table__row) {
            border-bottom: 1px solid ${colors.gray3};
          }

          div :global(.ReactVirtualized__Table__rowColumn) {
            display: flex;
            padding-right: 10px;
            align-items: center;
          }

          div :global(.skeleton .ReactVirtualized__Grid) {
            overflow-y: hidden !important;
          }
        `}</style>
      </div>
    );
  }
}
