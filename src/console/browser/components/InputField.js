import FieldLabel from './FieldLabel';
import PropTypes from 'prop-types';
import React from 'react';
import colors from '../colors';

export default function InputField({
  label,
  type,
  value,
  disabled,
  invalid,
  onChange
}) {
  return (
    <div className={invalid ? 'input-field invalid' : 'input-field'}>
      <FieldLabel text={label} />
      <input
        disabled={disabled}
        type={type}
        value={value || ''}
        onChange={onChange}
      />
      <style jsx>{`
        .input-field {
          margin: 10px 0;
        }

        label {
          color: ${colors.gray1};
          font-size: 12px;
          line-height: 20px;
          font-weight: bold;
          text-transform: uppercase;
          transition: all 0.2s;
        }

        input {
          background: ${colors.white};
          border: 1px solid ${colors.gray1};
          border-bottom: 2px solid ${colors.gray1};
          font-size: 26px;
          font-family: inherit;
          line-height: normal;
          padding: 0 8px;
          height: 50px;
          color: ${colors.black};
          width: 100%;
          border-radius: 2px;
          outline: none;
          transition: all 0.2s;
          box-shadow: 0 1px 1px ${colors.gray2};
        }

        input:focus {
          box-shadow: 0 0 5px ${colors.purple3};
        }

        input[disabled] {
          color: ${colors.gray1};
        }

        .invalid label {
          color: ${colors.red};
        }

        .invalid input {
          box-shadow: 0 1px 1px ${colors.red};
          border-color: ${colors.red};
        }
      `}</style>
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
};
