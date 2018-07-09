import DocumentTitle from './DocumentTitle';
import React from 'react';
import TargetHeader from './TargetHeader';
import colors from '../colors';

export default class TargetListItem extends React.Component {
  static height = 70;

  handleClick = () => {
    const { id, onSelect } = this.props;
    onSelect(id);
  };

  render() {
    const {
      thumbnailURL,
      thumbnailIcon,
      title,
      subtitle,
      label,
      score,
      updatedAt,
      selected,
      style
    } = this.props;

    return (
      <div
        className={`target-list-item ${selected ? 'selected' : ''}`}
        style={style}
        onClick={this.handleClick}
      >
        {selected && <DocumentTitle title={title} />}
        <TargetHeader
          invert={selected}
          title={title}
          subtitle={subtitle}
          thumbnailIcon={thumbnailIcon}
          thumbnailURL={thumbnailURL}
          label={label}
          score={score}
          updatedAt={updatedAt}
        />
        <style jsx>{`
          .target-list-item {
            max-width: 100%;
            padding: 15px 20px;
            cursor: pointer;
            transition: 0.2s background;
            background: ${colors.white};
          }

          .target-list-item + .target-list-item {
            border-top: 1px solid ${colors.gray2};
          }

          .target-list-item:hover,
          .target-list-item:focus {
            background: ${colors.gray2};
          }

          .target-list-item.selected {
            background: ${colors.gray1};
          }

          .target-list-item + .target-list-item.selected {
            border-color: ${colors.gray1};
          }
        `}</style>
      </div>
    );
  }
}
