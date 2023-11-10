import React from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import PropTypes from "prop-types";

const AddQuotationFormCompanyDetails = ({
  checkboxId,
  handleCheckboxChange,
  state,
  city,
  pincode,
  website,
  billingValue,
  handleChange,
  error
}) => {
  return (
    <div>
      <div className="shipping-form-flex">
        {/* state */}
        <div className="mb-30">
          <label
            htmlFor="quotationCompanyState"
            className="add-lead-label font-24-semibold"
          >
            State
          </label>
          <br />
          <input
            type="text"
            id="quotationCompanyState"
            name="quotationCompanyState"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            onChange={handleChange}
            value={state}
            autoFocus={true}
          />
          {error.quotationCompanyState && (
            <div className="is-invalid add-lead-form-field-errors">
              {error.quotationCompanyState}
            </div>
          )}
        </div>

        {/* city */}
        <div className="mb-30">
          <label
            htmlFor="quotationCompanyCity"
            className="add-lead-label font-24-semibold"
          >
            City
          </label>
          <br />
          <input
            type="text"
            id="quotationCompanyCity"
            name="quotationCompanyCity"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            onChange={handleChange}
            value={city}
          />
          {error.quotationCompanyCity && (
            <div className="is-invalid add-lead-form-field-errors">
              {error.quotationCompanyCity}
            </div>
          )}
        </div>
      </div>

      <div className="shipping-form-flex">
        {/* pincode */}
        <div className="mb-30">
          <label
            htmlFor="quotationCompanyPinCode"
            className="add-lead-label font-24-semibold"
          >
            PinCode
          </label>
          <br />
          <input
            type="text"
            pattern="[0-9]*"
            id="quotationCompanyPinCode"
            name="quotationCompanyPinCode"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            onChange={handleChange}
            value={pincode}
            maxLength={6}
          />
          {error.quotationCompanyPinCode && (
            <div className="is-invalid add-lead-form-field-errors">
              {error.quotationCompanyPinCode}
            </div>
          )}
        </div>

        {/* website */}
        <div className="mb-30">
          <label
            htmlFor="quotationCompanyWebsite"
            className="add-lead-label font-24-semibold"
          >
            Website
          </label>
          <br />
          <input
            type="text"
            id="quotationCompanyWebsite"
            name="quotationCompanyWebsite"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            onChange={handleChange}
            value={website}
          />
          {error.quotationCompanyWebsite && (
            <div className="is-invalid add-lead-form-field-errors">
              {error.quotationCompanyWebsite}
            </div>
          )}
        </div>
      </div>

      {/* billing address */}
      <div className="mb-30">
        <label
          htmlFor="quotationCompanyBilling"
          className="add-lead-label font-24-semibold"
        >
          Your company address
        </label>
        <br />
        <textarea
          rows="4"
          id="quotationCompanyBilling"
          name="quotationCompanyBilling"
          className="add-lead-input-field font-18-regular"
          placeholder=""
          value={billingValue}
          onChange={handleChange}
        />
        {error.quotationCompanyBilling && (
          <div className="is-invalid add-lead-form-field-errors">
            {error.quotationCompanyBilling}
          </div>
        )}
        {/* checkbox */}
        {checkboxId && (
          <div className="customCheckbox mt-25 text-right">
            <label htmlFor={checkboxId}>
              <Checkbox id={checkboxId} onChange={handleCheckboxChange} />
              <span className="font-21-regular mt-20 pl-2">
                Make it default
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

AddQuotationFormCompanyDetails.defaultProps = {
  error: ""
};

AddQuotationFormCompanyDetails.propTypes = {
  checkboxId: PropTypes.string,
  billingValue: PropTypes.string,
  handleChange: PropTypes.func.isRequired
  // handleCheckboxChange: PropTypes.func.isRequired
};

export default AddQuotationFormCompanyDetails;
