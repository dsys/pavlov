import React from 'react';
import colors from '../colors';

export default class RunWorkflowExampleButton extends React.Component {
  handleClick = () => {
    const { language, onClick } = this.props;
    onClick(language);
  };

  render() {
    const { active, display } = this.props;

    return (
      <button className={active ? 'active' : ''} onClick={this.handleClick}>
        {display}
        <style jsx>{`
          button {
            background: ${colors.gray2};
            border: 0;
            flex: 1 0 0;
            padding: 15px 20px;
            margin: 0;
            border-radius: 5px 5px 0 0;
            font-size: 18px;
            text-align: center;
            text-decoration: none;
            color: ${colors.black};
            transition: 0.2s all;
            cursor: pointer;
          }

          button + button {
            margin-left: 20px;
          }

          button:hover,
          button:focus {
            background: ${colors.gray3};
            color: ${colors.black};
          }

          button.active {
            background: ${colors.black};
            color: ${colors.white};
          }
        `}</style>
      </button>
    );
  }
}
