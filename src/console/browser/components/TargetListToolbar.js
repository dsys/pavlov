import Icon from './Icon';
import Popover from './Popover';
import React from 'react';
import RunWorkflowForm from './RunWorkflowForm';
import Toggle from './Toggle';
import colors from '../colors';

export default class TargetListToolbar extends React.Component {
  handleChangeEnvironment = value => {
    this.props.onChangeEnvironment(value ? 'LIVE' : 'TEST');
  };

  render() {
    const {
      environment,
      settingsActive,
      running,
      runError,
      runPopoverOpen,
      onSettings,
      onToggleRunPopover,
      onRefresh,
      onRun
    } = this.props;

    return (
      <div className="toolbar">
        <div className="left">
          <Toggle
            leftSide="TEST"
            rightSide="LIVE"
            value={environment === 'LIVE'}
            onChange={this.handleChangeEnvironment}
          />
        </div>
        <div className="right">
          <Popover visible={runPopoverOpen} placement="bottom-start">
            <button
              onClick={onToggleRunPopover}
              className={runPopoverOpen ? 'active' : ''}
            >
              <Icon name="run" width={24} height={24} />
            </button>
            <RunWorkflowForm
              running={running}
              error={runError}
              onSubmit={onRun}
            />
          </Popover>
          <button
            className={settingsActive ? 'active' : ''}
            onClick={onSettings}
          >
            <Icon name="gear" width={24} height={24} />
          </button>
          <button onClick={onRefresh}>
            <Icon name="refresh" width={24} height={24} />
          </button>
        </div>
        <style jsx>{`
          .toolbar {
            background: ${colors.white};
            color: ${colors.gray1};
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 70px;
            border-bottom: 1px solid ${colors.gray2};
            padding: 0 20px;
          }

          .left,
          .right {
            display: flex;
            align-items: center;
          }

          button {
            display: flex;
            align-items: center;
            color: ${colors.gray1};
            text-decoration: none;
            padding: 5px;
            flex: none;
            border: 0;
            margin: 0;
            background: transparent;
            cursor: pointer;
          }

          button:hover,
          button:focus,
          button.active {
            color: ${colors.purple3};
          }
        `}</style>
      </div>
    );
  }
}
