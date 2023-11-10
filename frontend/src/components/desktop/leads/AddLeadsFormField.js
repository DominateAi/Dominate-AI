import React from "react";
import PropTypes from "prop-types";

const AddLeadsFormField = ({
  htmlFor,
  labelName,
  id,
  name,
  placeholder,
  value,
  onChange,
  checkboxClass,
  type,
  maxLength,
  error,
  disable,
}) => {
  return (
    <div className={`mb-30 ${checkboxClass}`}>
      <label htmlFor={htmlFor} className="add-lead-label font-24-semibold">
        {labelName}
      </label>
      <br />
      <div>
        <input
          type={type}
          id={id}
          name={name}
          className="add-lead-input-field font-18-regular"
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          autoFocus
          autoComplete="off"
          disabled={disable}
        />
        {error && (
          <div className="is-invalid add-lead-form-field-errors">{error}</div>
        )}
      </div>
    </div>
  );
};

AddLeadsFormField.defaultProps = {
  error: "",
  maxLength: "",
};

AddLeadsFormField.propTypes = {
  htmlFor: PropTypes.string,
  labelName: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  checkboxClass: PropTypes.string,
  error: PropTypes.string,
};

export default AddLeadsFormField;
