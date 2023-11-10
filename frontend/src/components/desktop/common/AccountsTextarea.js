import React from "react";

const AccountsTextarea = ({
  checkboxClass,
  htmlFor,
  labelName,
  placeholder,
  value,
  onChange,
  maxLength,
  error,
  isDisabled,
}) => {
  return (
    <div className={`mb-30 ${checkboxClass}`}>
      <label htmlFor={htmlFor} className="add-lead-label font-24-semibold">
        {labelName}
      </label>
      <br />
      <textarea
        rows="4"
        id={htmlFor}
        name={htmlFor}
        className="add-lead-input-field font-18-regular"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        disabled={isDisabled}
      />
      {error && (
        <p className="is-invalid add-lead-form-field-errors">{error}</p>
      )}
    </div>
  );
};

AccountsTextarea.defaultProps = {
  placeholder: "",
  error: "",
  maxLength: "",
};

export default AccountsTextarea;
