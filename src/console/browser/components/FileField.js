import React from 'react';
import FieldLabel from './FieldLabel';

export default class FileField extends React.Component {
  setRef = elem => {
    this.input = elem;
  };

  handleChange = () => {
    if (this.input) {
      this.props.onChange(this.input.files[0]);
    }
  };

  render() {
    const { label, value, disabled } = this.props;

    return (
      <div className="file-field">
        <FieldLabel text={label} />
        <input
          ref={this.setRef}
          type="file"
          disabled={disabled}
          value={value}
          onChange={this.handleChange}
        />
        <style jsx>{`
          .file-field {
            margin: 20px 0;
          }

          input {
            display: block;
            margin-top: 5px;
          }
        `}</style>
      </div>
    );
  }
}
