import CircleImage from './CircleImage';
import React from 'react';
import Tag from './Tag';
import colors from '../colors';
import moment from 'moment';

export default class TargetHeader extends React.Component {
  render() {
    const {
      invert,
      thumbnailURL,
      thumbnailIcon,
      title,
      subtitle,
      label,
      score,
      updatedAt
    } = this.props;

    const relativeTime = moment(updatedAt).fromNow();

    return (
      <header className={invert ? 'invert' : ''}>
        <div className="left">
          <CircleImage
            alt={title}
            src={thumbnailURL}
            icon={thumbnailIcon}
            style={{ marginRight: 10 }}
          />
          <div className="titles">
            <div className="title" onClick={this.toggleTitleExpanded}>
              {title}
            </div>
            <div className="subtitle">{subtitle}</div>
          </div>
        </div>
        <div className="right">
          <div className="tag">
            <Tag label={label} score={score} />
          </div>
          <div className="time">{relativeTime}</div>
        </div>

        <style jsx>{`
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .left {
            display: flex;
            align-items: center;
            flex: auto;
            overflow-x: hidden;
          }

          .right {
            flex: none;
            margin-left: 10px;
            text-align: right;
            height: 40px;
            margin-top: 0;
          }

          .titles {
            flex: auto;
            overflow-x: hidden;
          }

          .title {
            font-weight: bold;
            transition: 0.2s color;
            max-width: 500px;
            display: block;
            text-overflow: ellipsis;
            overflow-x: hidden;
            white-space: nowrap;
          }

          .title:hover {
            white-space: normal;
          }

          .subtitle {
            color: ${colors.gray1};
            transition: 0.2s color;
            text-overflow: ellipsis;
            overflow: hidden;
            max-height: 20px;
            white-space: nowrap;
          }

          .time {
            display: block;
            color: ${colors.gray1};
            font-size: 10px;
            transition: 0.2s color;
          }

          .invert .title,
          .invert .subtitle,
          .invert .time {
            color: ${colors.white};
          }
        `}</style>
      </header>
    );
  }
}
