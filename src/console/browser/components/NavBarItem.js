import CircleImage from './CircleImage';
import React from 'react';
import colors from '../colors';
import { NavLink } from 'react-router-dom';
import { Manager, Target, Popper, Arrow } from 'react-popper';

export default class NavBarItem extends React.Component {
  state = { popper: false };

  handlePopperOpen = () => {
    this.setState({ popper: true });
  };

  handlePopperClose = () => {
    this.setState({ popper: false });
  };

  render() {
    const { to, exact, icon, imageURL, title, onClick } = this.props;
    const { popper } = this.state;

    return (
      <div className="nav-bar-item">
        <Manager>
          <Target>
            <NavLink
              to={to}
              exact={exact}
              className="nav-link"
              activeClassName="active"
              onClick={onClick}
            >
              <div
                className="icon-wrapper"
                onMouseEnter={this.handlePopperOpen}
                onMouseLeave={this.handlePopperClose}
              >
                <CircleImage alt={title} icon={icon} src={imageURL} />
              </div>
            </NavLink>
          </Target>
          {popper && (
            <Popper placement="right" className="popper">
              <Arrow className="popper-arrow" />
              <div className="title">{title}</div>
            </Popper>
          )}
        </Manager>
        <style jsx>{`
          .icon-wrapper {
            padding: 15px;
          }

          .title {
            white-space: nowrap;
          }

          .nav-bar-item :global(.nav-link) {
            display: block;
          }

          .nav-bar-item :global(.nav-link:hover) {
            background: ${colors.black2};
          }

          .nav-bar-item :global(.nav-link.active) {
            background: ${colors.black3};
          }

          .nav-bar-item :global(.popper) {
            background: ${colors.black};
            color: ${colors.white};
            border-radius: 5px;
            padding: 4px 8px;
            box-shadow: 0 2px 10px 2px ${colors.blackTransparent};
            z-index: 1000;
            margin-left: 10px;
          }

          .nav-bar-item :global(.popper-arrow) {
            width: 0;
            height: 0;
            border-style: solid;
            position: absolute;
            border-width: 6px 6px 6px 0;
            border-color: transparent ${colors.black} transparent transparent;
            left: -6px;
            top: calc(50% - 6px);
          }
        `}</style>
      </div>
    );
  }
}
