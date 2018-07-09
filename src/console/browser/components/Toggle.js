import PropTypes from 'prop-types';
import React from 'react';
import colors from '../colors';

export default class Toggle extends React.Component {
  handleClick = () => {
    this.props.onChange(!this.props.value);
  };

  render() {
    return (
      <div className={this.props.value ? 'toggle value' : 'toggle'}>
        <div className="background" onClick={this.handleClick}>
          <div className="knob">
            {this.props.value ? this.props.rightSide : this.props.leftSide}
          </div>
        </div>
        <div className="text" />
        <style jsx>{`
          .toggle {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
          }

          .background {
            position: relative;
            height: 36px;
            background: ${colors.gray3};
            width: 72px;
            border-radius: 20px;
            cursor: pointer;
          }

          .knob {
            position: absolute;
            top: 4px;
            left: 26px;
            width: 42px;
            height: 28px;
            background: ${colors.white};
            border-radius: 16px;
            transition: left 0.2s, color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            text-transform: uppercase;
            color: ${colors.gray1};
          }

          .value .background {
            background: ${colors.purple3};
          }

          .value .knob {
            left: 4px;
            color: ${colors.purple3};
          }
        `}</style>
      </div>
    );
  }
}

Toggle.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  leftSide: PropTypes.string,
  rightSide: PropTypes.string
};

Toggle.defaultProps = {
  onChange: () => {},
  leftSide: 'Invalue',
  rightSide: 'value'
};
