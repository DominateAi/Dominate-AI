import React from "react";

export default function ActivityContentEmailComposeModalSubjectInputField({
  name,
  onChange,
  value,
  error,
  autoFocus
}) {
  return (
    <div className="mb-30">
      <input
        type="text"
        id={name}
        name={name}
        placeholder="Subject"
        className="font-18-regular ac-email-modal-subject-input"
        onChange={onChange}
        value={value}
        autoFocus={autoFocus}
      />
      {error && (
        <div className="is-invalid add-lead-form-field-errors ml-0">
          {error}
        </div>
      )}
    </div>
  );
}
