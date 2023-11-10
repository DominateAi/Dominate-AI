import React from "react";

const ActivitySummaryViewProfileModalInputFieldNum = ({
  name,
  value,
  handleChange
}) => {
  return (
    <>
      <input
        type="text"
        pattern="[0-9]*"
        id={name}
        name={name}
        className="add-lead-input-field font-18-regular"
        placeholder=""
        onChange={handleChange}
        value={value}
        maxLength={6}
      />
      {/* {error.name && (
            <div className="is-invalid add-lead-form-field-errors">
              {error.name}
            </div>
          )} */}
    </>
  );
};

export default ActivitySummaryViewProfileModalInputFieldNum;
