import React from 'react';
import colors from '../colors';

export default class CollapsibleSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: 'initialOpen' in props ? props.initialOpen : true };
  }

  handleClickHeader = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { leftSide, rightSide, children } = this.props;
    const arrowStyle = this.state.isOpen
      ? { borderTopColor: colors.gray1, borderBottomWidth: 2.5, marginRight: 5 }
      : {
          borderLeftColor: colors.gray1,
          borderRightWidth: 2.5,
          marginRight: 7.5
        };

    return (
      <div>
        <header onClick={this.handleClickHeader}>
          <h4>
            <span className="arrow" style={arrowStyle} />
            {leftSide}
          </h4>
          <h5>{rightSide}</h5>
        </header>
        {this.state.isOpen && children}
        <style jsx>{`
          header {
            display: flex;
            justify-content: space-between;
            background: ${colors.gray2};
            border-bottom: 1px solid ${colors.gray3};
            padding: 2px 5px;
            color: ${colors.gray1};
            cursor: pointer;
          }

          h4 {
            font-weight: bold;
          }

          .arrow {
            display: inline-block;
            border-color: transparent;
            border-width: 5px;
            border-style: solid;
            width: 0;
            height: 0;
          }
        `}</style>
      </div>
    );
  }
}
