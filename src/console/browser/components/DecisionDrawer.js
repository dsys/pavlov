import DecisionDrawerButton from './DecisionDrawerButton';
import Spinner from './Spinner';
import React from 'react';
import colors from '../colors';

export default class DecisionDrawer extends React.Component {
  render() {
    const {
      drawerLabels,
      currentLabel,
      disable,
      onChangeDecision,
      decisionSubmitting,
      fixed,
      dark
    } = this.props;
    return (
      <div className="decision-drawer-wrapper">
        <div className={`inner ${fixed ? 'fixed' : ''}`}>
          <div
            className={`decision-drawer ${dark ? 'dark' : ''} ${fixed
              ? 'fixed'
              : ''} ${decisionSubmitting ? 'loading' : ''}`}
          >
            <div className="background">
              <div className="drawer-buttons">
                {drawerLabels.map((label, i) => (
                  <DecisionDrawerButton
                    key={i}
                    label={label}
                    active={label === currentLabel}
                    disable={disable}
                    onClick={onChangeDecision}
                  />
                ))}
              </div>
              <div className="loading-spinner">
                <Spinner margin="10px 20px" bgColor={colors.gray1} />
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .decision-drawer-wrapper {
            height: 200px;
          }

          .inner.fixed {
            position: absolute;
            left: 50%;
            width: 0;
          }

          .decision-drawer {
            display: flex;
            align-items: start;
            justify-content: center;
          }

          .decision-drawer.fixed {
            position: fixed;
            bottom: 0;
            height: 150px;
            width: 0;
          }

          .background {
            background: ${colors.gray3};
            padding: 10px 0;
            border-radius: 100px;
          }

          .decision-drawer.dark .background {
            background: ${colors.black2};
          }

          .drawer-buttons {
            display: flex;
          }

          .decision-drawer.loading .drawer-buttons {
            display: none;
          }

          .loading-spinner {
            display: none;
          }

          .decision-drawer.loading .loading-spinner {
            display: block;
          }
        `}</style>
      </div>
    );
  }
}
