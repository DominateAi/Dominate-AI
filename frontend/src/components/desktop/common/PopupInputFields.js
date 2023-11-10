import React from "react";

function PopupInputFields({
  checkboxClass,
  htmlFor,
  labelName,
  id,
  name,
  placeholder,
  value,
  onChange,
  type,
  maxLength,
  error,
}) {
  return (
    <div className={`mb-30 ${checkboxClass}`}>
      <label
        htmlFor={htmlFor}
        className="flex-shrink-0 add-lead-label font-24-semibold"
      >
        {labelName}
      </label>
      <div className="popup-input-fields-input-and-error-block">
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
          autoComplete="off"
        />

        {error && (
          <div className="is-invalid add-lead-form-field-errors ml-30">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

PopupInputFields.defaultProps = {
  error: "",
  maxLength: "",
};

export default PopupInputFields;
