import FieldLabel from './FieldLabel';
import Icon from './Icon';
import React from 'react';
import colors from '../colors';
import classNames from 'classnames';

export default class InlineInputField extends React.Component {
  state = { editing: false, editingValue: '' };

  handleChange = e => {
    const editingValue = e.target.value;
    this.setState({
      editing: editingValue !== this.props.value,
      editingValue
    });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.handleApprove();
    }
  };

  handleApprove = () => {
    this.props.onChange(this.state.editingValue);
    this.setState({ editing: false, editingValue: '' });
    if (this.input) {
      this.input.blur();
    }
  };

  handleDeny = () => {
    this.setState({ editing: false, editingValue: this.props.value });
  };

  setInputRef = elem => {
    this.input = elem;
  };

  render() {
    const { label, value, placeholder } = this.props;
    const { editing, editingValue } = this.state;

    return (
      <div className={classNames('inline-input-field', { editing })}>
        {label && <FieldLabel text={label} />}
        <div className="input-wrapper">
          <input
            type="text"
            placeholder={placeholder}
            value={editing ? editingValue : value}
            onKeyPress={this.handleKeyPress}
            onChange={this.handleChange}
            ref={this.setInputRef}
          />
          {editing ? (
            <div className="actions">
              <button className="approve" onClick={this.handleApprove}>
                <Icon name="checkmark" width={20} height={20} />
              </button>
              <button className="deny" onClick={this.handleDeny}>
                <Icon name="close" width={20} height={20} />
              </button>
            </div>
          ) : (
            <div className="edit">
              <Icon name="edit" width={20} height={20} />
            </div>
          )}
        </div>
        <style jsx>{`
          .input-wrapper {
            position: relative;
          }

          input {
            display: block;
            padding: 8px 80px 8px 10px;
            margin: 0 0 0 -10px;
            font-size: 14px;
            border: 1px solid ${colors.white};
            border-radius: 4px;
            font-family: inherit;
            width: calc(100% + 16px);
            height: 40px;
            line-height: 20px;
            height: 40px;
            transition: border 0.2s, color 0.2s, box-shadow 0.2s;
            color: ${colors.black};
          }

          input:hover {
            border-color: ${colors.gray2};
            color: ${colors.black};
            box-shadow: 0 2px 5px ${colors.blackTransparent};
          }

          .editing input,
          input:focus {
            border-color: ${colors.gray3};
            color: ${colors.black};
            box-shadow: 0 2px 5px ${colors.blackTransparent};
          }

          .actions {
            position: absolute;
            right: 0;
            top: 0;
          }

          .edit {
            position: absolute;
            right: 5px;
            top: 10px;
            color: ${colors.gray3};
          }

          .actions button {
            border: 0;
            padding: 10px 5px;
            margin: 0;
            background: transparent;
            opacity: 0.5;
            transition: opacity 0.2s;
            cursor: pointer;
          }

          .actions button:focus,
          .actions button:hover {
            opacity: 1;
          }

          .approve {
            color: ${colors.green};
          }

          .deny {
            color: ${colors.red};
          }
        `}</style>
      </div>
    );
  }
}
