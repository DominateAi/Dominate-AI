import React, { Component } from "react";
import PropTypes from "prop-types";

const EditLeadShippingDetails = ({
  state,
  city,
  pincode,
  website,
  billingValue,
  handleChange,
  error
}) => {
  return (
    <div className="">
      {/* website */}
      <div className="mb-30">
        <label
          htmlFor="leadsShippingWebsite"
          className="add-lead-label font-24-semibold"
        >
          Website
        </label>
        <br />
        <div>
          <input
            type="text"
            id="leadsShippingWebsite"
            name="leadsShippingWebsite"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            onChange={handleChange}
            value={website}
          />
          {error.leadsShippingWebsite && (
            <div className="is-invalid add-lead-form-field-errors">
              {error.leadsShippingWebsite}
            </div>
          )}
        </div>
      </div>

      {/* billing address */}
      <div className="mb-30">
        <label
          htmlFor="leadsShippingBilling"
          className="add-lead-label font-24-semibold"
        >
          Billing Address
        </label>
        <br />
        <div>
          <textarea
            rows="4"
            id="leadsShippingBilling"
            name="leadsShippingBilling"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            value={billingValue}
            onChange={handleChange}
          />
          {error.leadsShippingBilling && (
            <div className="is-invalid add-lead-form-field-errors">
              {error.leadsShippingBilling}
            </div>
          )}
        </div>
      </div>

      {/* state */}
      <div className="mb-30">
        <label
          htmlFor="leadsShippingState"
          className="add-lead-label font-24-semibold"
        >
          State
        </label>
        <br />
        <div>
          <input
            type="text"
            id="leadsShippingState"
            name="leadsShippingState"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            onChange={handleChange}
            value={state}
            autoFocus={true}
          />
          {error.leadsShippingState && (
            <div className="is-invalid add-lead-form-field-errors">
              {error.leadsShippingState}
            </div>
          )}
        </div>
      </div>

      {/* city */}
      <div className="mb-30">
        <label
          htmlFor="leadsShippingCity"
          className="add-lead-label font-24-semibold"
        >
          City
        </label>
        <br />
        <div>
          <input
            type="text"
            id="leadsShippingCity"
            name="leadsShippingCity"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            onChange={handleChange}
            value={city}
          />
          {error.leadsShippingCity && (
            <div className="is-invalid add-lead-form-field-errors">
              {error.leadsShippingCity}
            </div>
          )}
        </div>
      </div>

      {/* pincode */}
      <div className="mb-30">
        <label
          htmlFor="leadsShippingPinCode"
          className="add-lead-label font-24-semibold"
        >
          PinCode
        </label>
        <br />
        <div>
          <input
            type="text"
            pattern="[0-9]*"
            id="leadsShippingPinCode"
            name="leadsShippingPinCode"
            className="add-lead-input-field font-18-regular"
            placeholder=""
            onChange={handleChange}
            value={pincode}
            maxLength={6}
          />
          {error.leadsShippingPinCode && (
            <div className="is-invalid add-lead-form-field-errors">
              {error.leadsShippingPinCode}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EditLeadShippingDetails.defaultProps = {
  error: ""
};

EditLeadShippingDetails.propTypes = {
  billingValue: PropTypes.string,
  handleChange: PropTypes.func.isRequired
};

export default EditLeadShippingDetails;
