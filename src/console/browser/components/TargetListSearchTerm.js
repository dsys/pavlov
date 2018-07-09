import React from 'react';
import Icon from './Icon';
import colors from '../colors';

const LABEL_REGEX = /^([a-z]+):(.+)$/;

function parseValue({ value }) {
  const match = value.match(LABEL_REGEX);
  if (match) {
    return [match[1], match[2]];
  } else {
    return [null, value];
  }
}

export default class TargetListSearchTerm extends React.Component {
  handleRemove = () => {
    this.props.onRemove(this.props.value);
  };

  render() {
    const [operator, label] = parseValue(this.props.value);

    return (
      <div className="search-term">
        <button className="remove" onClick={this.handleRemove}>
          <Icon name="close" width={16} height={16} />
        </button>
        <div className="text">
          {operator && <span className="operator">{operator}:</span>}
          <span className="label">{label}</span>
        </div>
        <style jsx>{`
          .search-term {
            display: flex;
            border: 0;
            font-size: 12px;
            margin: 5px 10px 5px 0;
            background: ${colors.purple3};
            color: ${colors.white};
            border-radius: 4px;
            align-items: center;
            float: left;
            box-shadow: 0 1px ${colors.blackTransparent};
          }

          .remove {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 0;
            width: 24px;
            height: 24px;
            padding: 0;
            background: transparent;
            cursor: pointer;
            border-radius: 4px 0 0 4px;
            color: ${colors.white};
          }

          .remove:focus,
          .remove:hover {
            background-color: ${colors.purple2};
            color: ${colors.white};
          }

          .text {
            padding: 0 8px 0 4px;
          }

          .operator {
            color: ${colors.gray3};
          }
        `}</style>
      </div>
    );
  }
}
