import React from "react";

export default function ActivityContentEmailComposeModalContentTextareaField({
  name,
  onChange,
  value,
  error
}) {
  return (
    <div className="mb-30">
      <textarea
        rows="8"
        id={name}
        name={name}
        className="font-18-regular ac-email-modal-subject-textarea"
        placeholder=""
        onChange={onChange}
        value={value}
      />
      {error && (
        <div className="is-invalid add-lead-form-field-errors ml-0">
          {error}
        </div>
      )}
    </div>
  );
}
