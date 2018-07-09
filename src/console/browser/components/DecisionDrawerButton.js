import Icon from './Icon';
import React from 'react';
import colors from '../colors';
import { Manager, Target, Popper, Arrow } from 'react-popper';

const BUTTONS = {
  APPROVE: {
    color: colors.green,
    icon: 'checkmark',
    context: (
      <div className="context">
        <div>No hate</div>
        <div>No logos</div>
        <div>No brands</div>
      </div>
    )
  },
  DENY: {
    color: colors.red,
    icon: 'close',
    context: (
      <div className="context">
        <div>Has hate</div>
        <div>Or logos</div>
        <div>Or brands</div>
      </div>
    )
  },
  ESCALATE: { color: colors.purple2, icon: 'up' },
  FLIP: { color: colors.gray1, icon: 'refresh' }
};

export default class DecisionDrawerButton extends React.Component {
  state = { popper: false };

  handlePopperOpen = () => {
    this.setState({ popper: true });
  };

  handlePopperClose = () => {
    this.setState({ popper: false });
  };

  handleClick = e => {
    const { label, disable, onClick } = this.props;
    e.stopPropagation();
    if (!disable) {
      onClick({ label, score: null, reasons: [] });
    }
  };

  render() {
    const { label, active } = this.props;
    const { popper } = this.state;
    return (
      <div className="decision-drawer-button">
        <Manager>
          <Target>
            <button
              className={active ? 'active' : ''}
              style={{ color: BUTTONS[label].color || 'black' }}
              onClick={this.handleClick}
              onMouseEnter={this.handlePopperOpen}
              onMouseLeave={this.handlePopperClose}
            >
              <Icon name={BUTTONS[label].icon} width={60} height={60} />
            </button>
          </Target>
          {popper &&
            BUTTONS[label].context && (
              <Popper placement="top" className="popper">
                <Arrow className="popper-arrow" />
                <div className="title">{BUTTONS[label].context}</div>
              </Popper>
            )}
        </Manager>
        <style jsx>{`
          button {
            display: flex;
            position: relative;
            align-items: center;
            justify-content: center;
            border-radius: 50px;
            background: ${colors.white};
            border: 1px solid ${colors.gray3};
            width: 80px;
            height: 80px;
            padding: 0;
            box-shadow: 0 3px 0 2px ${colors.blackTransparent};
            color: ${colors.gray3};
            margin: -5px 10px 5px 10px;
            cursor: pointer;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          button:hover,
          button:focus {
            border-color: ${colors.purple3};
            box-shadow: 0 3px 0 2px ${colors.blackTransparent};
          }

          .decision-drawer-button :global(.popper) {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            width: 100px;

            padding: 10px;
            font-size: 1.2em;
            font-weight: 700;

            background: ${colors.black};
            color: ${colors.white};
            border-radius: 5px;
            padding: 4px 8px;
            box-shadow: 0 2px 10px 2px ${colors.blackTransparent};
            z-index: 1000;
            margin-bottom: 10px;
          }

          .decision-drawer-button :global(.popper-arrow) {
            width: 0;
            height: 0;
            border-style: solid;
            position: absolute;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid ${colors.black};

            left: -6px;
            bottom: -6px;
          }

          button.active,
          button:active {
            margin-top: 0;
            margin-bottom: 0;
            border-color: ${colors.purple3};
            box-shadow: none;
          }

          button:active {
            box-shadow: inset 0 3px 0 2px ${colors.gray3};
          }
        `}</style>
      </div>
    );
  }
}
