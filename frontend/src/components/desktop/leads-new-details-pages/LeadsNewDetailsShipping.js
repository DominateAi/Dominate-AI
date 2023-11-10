import React from "react";
import PropTypes from "prop-types";

const LeadsNewDetailsShipping = ({
  state,
  city,
  pincode,
  website,
  billingValue,
  handleChange,
  handleChangeNumber,
  error,
}) => {
  return (
    <div>
      {/* website */}
      <div className="leads-new-details-col-1 mb-30">
        <label
          htmlFor="leadsShippingWebsite"
          className="add-lead-label font-24-semibold"
        >
          <img
            src={require("../../../../src/assets/img/leads-new/profile/circle-email.svg")}
            alt=""
          />
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
          <div className="is-invalid is-invalid--leads-new-details-edit add-lead-form-field-errors">
            {error.leadsShippingWebsite}
          </div>
        )}
      </div>
      {/* </div> */}

      {/* billing address */}
      <div className="col-6 px-0 mb-30">
        <label
          htmlFor="leadsShippingBilling"
          className="add-lead-label font-24-semibold"
        >
          <img
            src={require("../../../../src/assets/img/leads-new/profile/circle-billing-address.svg")}
            alt=""
          />
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
          <div className="is-invalid is-invalid--leads-new-details-edit add-lead-form-field-errors">
            {error.leadsShippingBilling}
          </div>
        )}
      </div>

      <div className="row mx-0">
        {/* state */}
        <div className="mb-30 mr-40">
          <label
            htmlFor="leadsShippingState"
            className="add-lead-label font-24-semibold"
          >
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-state.svg")}
              alt=""
            />
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
            <div className="is-invalid is-invalid--leads-new-details-edit add-lead-form-field-errors">
              {error.leadsShippingState}
            </div>
          )}
        </div>

        {/* city */}
        <div className="mb-30 mr-40">
          <label
            htmlFor="leadsShippingCity"
            className="add-lead-label font-24-semibold"
          >
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-city.svg")}
              alt=""
            />
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
            <div className="is-invalid is-invalid--leads-new-details-edit add-lead-form-field-errors">
              {error.leadsShippingCity}
            </div>
          )}
        </div>

        {/* pincode */}
        <div className="mb-30">
          <label
            htmlFor="leadsShippingPinCode"
            className="add-lead-label font-24-semibold"
          >
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-pincode.svg")}
              alt=""
            />
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
            onChange={handleChangeNumber}
            value={pincode}
            maxLength={6}
          />
          {error.leadsShippingPinCode && (
            <div className="is-invalid is-invalid--leads-new-details-edit add-lead-form-field-errors">
              {error.leadsShippingPinCode}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

LeadsNewDetailsShipping.defaultProps = {
  error: "",
};

LeadsNewDetailsShipping.propTypes = {
  billingValue: PropTypes.string,
};

export default LeadsNewDetailsShipping;
