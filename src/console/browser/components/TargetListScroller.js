import React from 'react';
import TargetListItem from './TargetListItem';
import TargetListPlaceholder from './TargetListPlaceholder';
import { AutoSizer, List, InfiniteLoader } from 'react-virtualized';

export default class TargetListScroller extends React.Component {
  renderRow = ({ key, index, style }) => {
    const { selectedTargetId, onSelect } = this.props;
    const targets = this.getTargets();

    if (index < targets.length) {
      const r = targets[index];

      return (
        <TargetListItem
          key={key}
          id={r.id}
          thumbnailURL={r.thumbnailURL}
          thumbnailIcon={r.thumbnailIcon}
          title={r.title}
          subtitle={r.subtitle}
          label={r.label}
          score={r.score}
          updatedAt={r.updatedAt}
          selected={r.id === selectedTargetId}
          style={style}
          onSelect={onSelect}
        />
      );
    } else {
      return (
        <TargetListPlaceholder key={key} style={style} text="Loading..." />
      );
    }
  };

  renderPlaceholder = () => {
    const { loading, error } = this.props;
    return (
      <TargetListPlaceholder
        text={
          error
            ? 'Error searching targets.'
            : loading ? 'Loading...' : 'No targets to show.'
        }
      />
    );
  };

  isRowLoaded = ({ index }) => {
    return !!this.props.error || index < this.getTargets().length;
  };

  getTargets = () => {
    const { loading, error, searchTargets } = this.props;
    return !loading && !error && searchTargets ? searchTargets.items : [];
  };

  hasNextPage = () => {
    const { loading, error, searchTargets } = this.props;
    return !loading && !error && searchTargets && searchTargets.hasNextPage;
  };

  render() {
    const {
      updatedAt,
      selectedTargetId,
      onScroll,
      loadMoreRows,
      error,
      loading
    } = this.props;

    const targets = this.getTargets();
    const hasNextPage = this.hasNextPage();

    const rowCount =
      targets.length > 0 && hasNextPage ? targets.length + 1 : targets.length;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={loadMoreRows}
            rowCount={rowCount}
          >
            {({ onRowsRendered, registerChild }) => (
              <List
                ref={registerChild}
                width={width}
                height={height}
                rowCount={rowCount}
                rowHeight={TargetListItem.height}
                rowRenderer={this.renderRow}
                noRowsRenderer={this.renderPlaceholder}
                onRowsRendered={onRowsRendered}
                lastUpdated={updatedAt}
                selectedTargetId={selectedTargetId}
                onScroll={onScroll}
                loading={loading}
                error={error}
              />
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    );
  }
}
