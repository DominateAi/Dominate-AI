import React from "react";

const AddEmployeesFormFields = ({
  htmlFor,
  type,
  labelName,
  id,
  name,
  placeholder,
  value,
  onChange,
  error
}) => {
  return (
    <div className="mb-30">
      <label htmlFor={htmlFor} className="add-lead-label font-24-semibold">
        {labelName}
      </label>
      <br />
      <input
        type={type}
        id={id}
        name={name}
        className="add-lead-input-field font-18-regular"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        autoFocus={true}
      />
      {error && (
        <div className="is-invalid add-lead-form-field-errors">{error}</div>
      )}
    </div>
  );
};

export default AddEmployeesFormFields;
