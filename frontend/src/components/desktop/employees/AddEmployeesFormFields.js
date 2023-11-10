import React from "react";

const AddEmployeesFormFields = ({
  widthClass,
  checkboxClass,
  htmlFor,
  type,
  labelName,
  id,
  name,
  placeholder,
  value,
  onChange,
  maxLength,
  error,
  isDisable,
  pattern,
  onKeyPress,
}) => {
  return (
    <div className={`mb-30 ${checkboxClass}`}>
      {/* {console.log(maxLength)} */}
      <label htmlFor={htmlFor} className="add-lead-label font-24-semibold">
        {labelName}
      </label>
      <br />
      <div className="input_field_div">
        <input
          type={type}
          id={id}
          name={name}
          className="add-lead-input-field font-18-regular"
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          maxLength={maxLength}
          autoFocus={true}
          disabled={isDisable}
          pattern={pattern}
          onKeyPress={onKeyPress}
        />
        {error && (
          <div className="is-invalid add-lead-form-field-errors">{error}</div>
        )}
      </div>
    </div>
  );
};

AddEmployeesFormFields.defaultProps = {
  error: "",
  maxLength: "",
};

export default AddEmployeesFormFields;
