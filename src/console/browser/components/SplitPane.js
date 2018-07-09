import PropTypes from 'prop-types';
import React from 'react';
import colors from '../colors';

const LOCAL_STORAGE_KEY_PREFIX = 'pavlov.split.';

function getLocalStorage(localStorageKey) {
  const val = window.localStorage.getItem(
    `${LOCAL_STORAGE_KEY_PREFIX}.${localStorageKey}`
  );

  return parseFloat(val, 10);
}

function setLocalStorage(localStorageKey, split) {
  const val = split.toString();
  return window.localStorage.setItem(
    `${LOCAL_STORAGE_KEY_PREFIX}.${localStorageKey}`,
    val
  );
}

function unfocus() {
  if (document.selection) {
    document.selection.empty();
  } else {
    try {
      window.getSelection().removeAllRanges();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

export default class SplitPane extends React.Component {
  state = {
    active: false,
    split: null,
    startPos: null,
    startSplit: null
  };

  componentWillMount() {
    const { defaultSplit, localStorageKey } = this.props;
    if (localStorageKey) {
      this.setState({
        split: getLocalStorage(localStorageKey) || defaultSplit
      });
    } else {
      this.setState({ split: defaultSplit });
    }
  }

  handleMouseDown = ({ clientX, clientY }) => {
    unfocus();

    this.setState({
      active: true,
      startPos: this.props.direction === 'v' ? clientX : clientY,
      startSplit: this.state.split
    });
  };

  handleMouseMove = ({ clientX, clientY }) => {
    const { direction, maxSplit, minSplit } = this.props;
    const { active, startPos, startSplit } = this.state;

    if (active && this.splitPane) {
      unfocus();

      const currentPos = direction === 'v' ? clientX : clientY;

      let newSplit = startSplit + (currentPos - startPos);
      if (newSplit < minSplit) {
        newSplit = minSplit;
      } else if (newSplit > maxSplit) {
        newSplit = maxSplit;
      }

      this.setState({ split: newSplit });
    }
  };

  handleMouseUp = () => {
    const { localStorageKey } = this.props;
    const { active, split } = this.state;

    if (active) {
      setLocalStorage(localStorageKey, split);
      this.setState({ active: false, startPos: null, startSplit: null });
    }
  };

  handleTouchStart = event => {
    this.handleMouseDown(event.touches[0]);
  };

  handleTouchMove = event => {
    this.handleMouseMove(event.touches[0]);
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('touchmove', this.handleTouchMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('touchmove', this.handleTouchMove);
  }

  render() {
    const {
      children,
      splitSize,
      direction,
      fixed,
      fullWidth,
      dark
    } = this.props;
    const { split, active } = this.state;

    const primaryStyle =
      direction === 'v' ? { width: split } : { height: split };

    const splitStyle =
      direction === 'v' ? { width: splitSize } : { height: splitSize };

    const secondaryStyle = direction === 'v' ? {} : { marginTop: split };

    return (
      <div
        className={`split-pane ${dark ? 'dark' : ''} ${fullWidth
          ? 'fullWidth'
          : ''} ${direction} ${fixed ? 'fixed' : ''} ${active ? 'active' : ''}`}
        ref={elem => (this.splitPane = elem)}
      >
        <div className="pane primary" style={primaryStyle}>
          <div className="primary-inner">{children[0]}</div>
          <div
            className="split"
            style={splitStyle}
            onMouseDown={this.handleMouseDown}
            onTouchStart={this.handleTouchStart}
            onTouchEnd={this.handleMouseUp}
          />
        </div>
        <div className="spacer" style={{ width: split }} />
        <div className="pane secondary" style={secondaryStyle}>
          {children[1]}
        </div>
        <style jsx>{`
          .split-pane {
            display: flex;
          }

          .split-pane.fullWidth {
            width: 100%;
          }

          .split {
            flex: none;
            background: ${colors.gray2};
          }

          .split-pane.dark .split {
            background: ${colors.black2};
            border: 1px solid ${colors.black3};
          }

          .split:hover,
          .split-pane.dark .split:hover,
          .active .split {
            border: 1px solid ${colors.gray3};
          }

          .v {
            flex-direction: row;
          }

          .v .split {
            cursor: col-resize;
            border-left-width: 1px;
            border-right-width: 1px;
          }

          .h {
            flex-direction: column;
          }

          .h .split {
            width: 100%;
            cursor: row-resize;
            border-top-width: 1px;
            border-bottom-width: 1px;
          }

          .primary {
            flex: none;
            z-index: 1;
            display: flex;
          }

          .primary-inner {
            flex: auto;
          }

          .spacer {
            display: none;
          }

          .secondary {
            flex: auto;
          }

          @media (min-width: 1024px) {
            .fixed .primary {
              position: fixed;
            }

            .fixed .spacer {
              display: block;
              flex: none;
            }
          }
        `}</style>
      </div>
    );
  }
}

SplitPane.propTypes = {
  direction: PropTypes.oneOf(['v', 'h'])
};

SplitPane.defaultProps = {
  direction: 'v',
  splitSize: 6,
  minSplit: 200,
  maxSplit: 600,
  defaultSplit: 200,
  localStorageKey: null,
  fixed: false,
  fullWidth: false
};
