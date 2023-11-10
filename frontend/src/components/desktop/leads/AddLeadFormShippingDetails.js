import React from "react";
// import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import PropTypes from "prop-types";

const AddLeadFormShippingDetails = ({
  // checkboxId,
  // handleCheckboxChange,
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
      {/* shipping address
                <div className="mb-30">
                    <label
                        htmlFor="leadsShippingAddress"
                        className="add-lead-label font-24-semibold"
                    >
                        Shipping Address
                    </label>
                    <br />
                    <textarea
                        rows="4"
                        id="leadsShippingAddress"
                        name="leadsShippingAddress"
                        className="add-lead-input-field font-18-regular"
                        placeholder=""
                        onChange={handleChange}
                    ></textarea>
                </div> */}

      {/* <div className="shipping-form-flex"> */}
      {/* website */}
      <div className="mb-30">
        <label
          htmlFor="leadsShippingWebsite"
          className="add-lead-label font-24-semibold"
        >
          Website
        </label>
        <br />
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
      {/* </div> */}

      {/* billing address */}
      <div className="mb-30">
        <label
          htmlFor="leadsShippingBilling"
          className="add-lead-label font-24-semibold"
        >
          Billing Address
        </label>
        <br />
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
        {/* checkbox */}
        {/* {checkboxId && (
          <div className="customCheckbox text-right">
            <label htmlFor={checkboxId}>
              <Checkbox id={checkboxId} onChange={handleCheckboxChange} />
              <span className="font-18-regular pl-2">
                Same as Shipping Address
              </span>
            </label>
          </div>
        )} */}
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

      {/* city */}
      <div className="mb-30">
        <label
          htmlFor="leadsShippingCity"
          className="add-lead-label font-24-semibold"
        >
          City
        </label>
        <br />
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
      {/* </div> */}

      {/* <div className="shipping-form-flex"> */}
      {/* pincode */}
      <div className="mb-30">
        <label
          htmlFor="leadsShippingPinCode"
          className="add-lead-label font-24-semibold"
        >
          PinCode
        </label>
        <br />
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
  );
};

AddLeadFormShippingDetails.defaultProps = {
  error: ""
};

AddLeadFormShippingDetails.propTypes = {
  // checkboxId: PropTypes.string,
  billingValue: PropTypes.string,
  handleChange: PropTypes.func.isRequired
  // handleCheckboxChange: PropTypes.func.isRequired
};

export default AddLeadFormShippingDetails;
