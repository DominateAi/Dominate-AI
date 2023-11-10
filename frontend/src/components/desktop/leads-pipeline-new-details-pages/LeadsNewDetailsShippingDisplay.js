import React from "react";
import isEmpty from "./../../../store/validations/is-empty";
import PropTypes from "prop-types";

const LeadsNewDetailsShippingDisplay = ({
  state,
  city,
  pincode,
  website,
  billingValue,
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
        <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
          {!isEmpty(website) ? website : "-----"}
        </p>
      </div>

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
        <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
          {!isEmpty(billingValue) ? billingValue : "-----"}
        </p>
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
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(state) ? state : "-----"}
          </p>
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
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(city) ? city : "-----"}
          </p>
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
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(pincode) ? pincode : "-----"}
          </p>
        </div>
      </div>
    </div>
  );
};

LeadsNewDetailsShippingDisplay.defaultProps = {
  error: "",
};

LeadsNewDetailsShippingDisplay.propTypes = {
  billingValue: PropTypes.string,
};

export default LeadsNewDetailsShippingDisplay;
