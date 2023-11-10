import React from "react";

export default function EditLeadSocialMediaAccount({
  img,
  name,
  placeholder,
  onChange,
  value,
  error,
  maxLength,
  // maxLength = { maxLength },
}) {
  return (
    <div className="d-flex align-items-end social-media-leads-img-input-block">
      <img src={img} alt="social media" className="summary-outlookImg" />
      <div className="ml-30 social-media-leads-input-block">
        <input
          type="text"
          name={name}
          className="add-lead-input-field font-18-regular ml-0"
          placeholder={placeholder}
          onChange={onChange}
          maxLength={maxLength}
          value={value}
        />
        {error && (
          <div className="is-invalid add-lead-form-field-errors">{error}</div>
        )}
      </div>
    </div>
  );
}
