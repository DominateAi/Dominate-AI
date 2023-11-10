import React from "react";

const ActivitySummaryViewProfileModalInputField = ({
  name,
  value,
  handleChange,
  maxLength,
  error,
}) => {
  return (
    <>
      <input
        type="text"
        id={name}
        name={name}
        className="add-lead-input-field font-18-regular"
        placeholder=""
        onChange={handleChange}
        maxLength={maxLength}
        value={value}
      />
      {error && (
        <div className="is-invalid add-lead-form-field-errors ml-0 w-100">
          {error}
        </div>
      )}
    </>
  );
};

ActivitySummaryViewProfileModalInputField.defaultProps = {
  error: "",
  maxLength: "",
};

export default ActivitySummaryViewProfileModalInputField;
