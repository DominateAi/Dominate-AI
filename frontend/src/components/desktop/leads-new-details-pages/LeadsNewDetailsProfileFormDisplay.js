import React, { useState, useEffect } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import LeadsNewDetailsShippingDisplay from "./LeadsNewDetailsShippingDisplay";
import { useSelector } from "react-redux";

function LeadsNewDetailsProfileFormDisplay({ onEditButton }) {
  const [values, setValues] = useState({
    openEditModal: false,
    // edit modal basic
    name: "",
    email: "",
    countryCode: "",
    phoneNumber: "",
    company: "",
    accountNameSelected: "",
    leadsWorthAmount: "",
    selectedLeadsSourceDropdownOption: "",
    tagsArray: [],
    leadsAbout: "",
    location: "",
    leadMediaInstagramInput: "",
    leadMediaLinkedInInput: "",
    leadMediaFacebookInput: "",
    leadMediaOthersInput: "",
    leadsSkypeAddress: "",
    leadsShippingBilling: "",
    leadsShippingState: "",
    leadsShippingCity: "",
    leadsShippingPinCode: "",
    leadsShippingWebsite: "",
    success: false,
    leadActivityData: {},
  });

  const leadActivityData = useSelector(
    (state) => state.leads.leadActivitySummary
  );
  const allFieldsValue = useSelector(
    (state) => state.commandCenter.allFieldsValue
  );

  useEffect(() => {
    if (!isEmpty(leadActivityData)) {
      setValues({
        ...values,
        name: leadActivityData.name,
        email: leadActivityData.email,
        company: leadActivityData.company,
        phoneNumber: leadActivityData.phone,
        leadsWorthAmount: leadActivityData.worth,
        leadsAbout: leadActivityData.about,
        leadMediaInstagramInput: leadActivityData.media.instagram,
        leadMediaLinkedInInput: leadActivityData.media.linkedIn,
        leadMediaFacebookInput: leadActivityData.media.facebook,
        leadMediaOthersInput: leadActivityData.media.other,
        leadsSkypeAddress: leadActivityData.media.skype,
        tagsArray: leadActivityData.tags,
        selectedLeadsSourceDropdownOption: {
          value: leadActivityData.source,
          label: leadActivityData.source,
        },
        leadActivityData: leadActivityData,
      });
    }
  }, [leadActivityData]);

  /*==========================================
          renderName
  ===========================================*/
  const renderName = () => {
    return (
      <>
        {/* name */}
        <div className="leads-new-details-col-1 mb-30">
          <label htmlFor="name" className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-name.svg")}
              alt=""
            />
            Lead Name
          </label>
          <br />
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(values.name) ? values.name : "-----"}
          </p>
        </div>
      </>
    );
  };

  /*==========================================
          renderEmail
  ===========================================*/
  const renderEmail = () => {
    return (
      <>
        {/* email */}
        <div className="leads-new-details-col-1 mb-30">
          <label htmlFor="email" className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-email.svg")}
              alt=""
            />
            Email Address
          </label>
          <br />
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(values.email) ? values.email : "-----"}
          </p>
        </div>
      </>
    );
  };
  /*==========================================
          renderPhoneNumberblock
  ===========================================*/
  const renderPhoneNumberblock = () => {
    return (
      <div className="leads-new-details-colm-phone mb-30">
        <label htmlFor="country" className="add-lead-label font-21-regular">
          <img
            src={require("../../../../src/assets/img/leads-new/profile/circle-phone.svg")}
            alt=""
          />
          Phone Number
        </label>
        <br />
        <div className="countryCode-fixed-plus-input-container phone-form-control-block__lead-profile">
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(values.phoneNumber) ? (
              <>{values.phoneNumber}</>
            ) : (
              "-- -----"
            )}
          </p>
        </div>
      </div>
    );
  };

  /*==========================================
          renderWorthAmount
  ===========================================*/
  const renderWorthAmount = () => {
    return (
      <div className="leads-new-details-col-1 mb-30">
        <label
          htmlFor="leadsWorthAmount"
          className="add-lead-label font-24-semibold"
        >
          <img
            src={require("../../../../src/assets/img/leads-new/profile/circle-worth.svg")}
            alt=""
          />
          Worth Amount
        </label>
        <br />
        <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
          {!isEmpty(values.leadsWorthAmount)
            ? values.leadsWorthAmount
            : "-----"}
        </p>
      </div>
    );
  };

  const renderCustomFields = () => {
    // const { allFieldsValue } = this.props;

    if (!isEmpty(allFieldsValue)) {
      return allFieldsValue.map((data, index) => {
        return (
          <div key={index} className="leads-new-details-col-1 mb-10">
            <label
              htmlFor="leadsSource"
              className="add-lead-label font-24-semibold"
            >
              <img
                src={require("../../../../src/assets/img/leads-new/profile/circle-source.svg")}
                alt=""
              />

              {data.fieldData.name}
            </label>
            <p className="font-18-regular leads-new-details-profile-form-display__blue-text leads-new-details-profile-form-display__blue-text--word-break pt-20">
              {!isEmpty(data.value) ? data.value : "-----"}
            </p>
          </div>
        );
      });
    }
  };

  /*==========================================
          renderAddMoreInfoModel
  ===========================================*/
  const renderAddMoreInfoModel = () => {
    const { errors } = values;

    // about field
    const aboutInputField = (
      <div className="col-8 px-0 mb-30">
        <label htmlFor="leadsAbout" className="add-lead-label font-24-semibold">
          <img
            src={require("../../../../src/assets/img/leads-new/profile/circle-about.svg")}
            alt=""
          />
          About
        </label>
        <br />
        <p className="font-18-regular leads-new-details-profile-form-display__blue-text leads-new-details-profile-form-display__blue-text--word-break">
          {!isEmpty(values.leadsAbout) ? values.leadsAbout : "-----"}
        </p>
      </div>
    );

    // Select tags

    const selectFewTags = (
      <div className="col-10 px-0 pt-20">
        <span className="add-lead-label font-24-semibold">
          <img
            src={require("../../../../src/assets/img/leads-new/profile/circle-tags.svg")}
            alt=""
          />
          Added tags
        </span>

        <div className="leads-tags-in-input-field leads-tags-in-input-field--addLeadFormSelectTags">
          <div className="representative-recent-img-text-block leads-tags-in-input-field__block pt-0 mb-30">
            {!isEmpty(values.tagsArray) ? (
              values.tagsArray.map((tag, index) => (
                <p
                  key={index}
                  className="leads-new-details-profile-form-display__blue-text-tags"
                >
                  {tag}
                </p>
              ))
            ) : (
              <p className="leads-new-details-profile-form-display__blue-text-tags">
                -----
              </p>
            )}
          </div>
        </div>
      </div>
    );

    // Add Location

    const leadAddLocation = (
      <div className="leads-new-details-col-1 mb-10">
        <label htmlFor="location" className="add-lead-label font-24-semibold">
          <img
            src={require("../../../../src/assets/img/leads-new/profile/circle-location.svg")}
            alt=""
          />
          Location
        </label>
        <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
          {!isEmpty(values.location) ? values.location : "-----"}
        </p>
      </div>
    );

    // Lead Source dropdown

    const leadSourceDropdown = (
      <div className="leads-new-details-col-1 mb-10">
        <label
          htmlFor="leadsSource"
          className="add-lead-label font-24-semibold"
        >
          <img
            src={require("../../../../src/assets/img/leads-new/profile/circle-source.svg")}
            alt=""
          />
          Lead Source
        </label>
        <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
          {!isEmpty(values.selectedLeadsSourceDropdownOption)
            ? values.selectedLeadsSourceDropdownOption.value
            : "-----"}
        </p>
      </div>
    );

    // lead addd media accounts
    const leadAddMedia = (
      <>
        {/* media accounts */}
        <div className="row mx-0">
          <div className="col-12 px-0">
            <label
              htmlFor="leadMediaEmailCheckbox"
              className="add-lead-label font-24-semibold mt-20"
            >
              <img
                src={require("../../../../src/assets/img/leads-new/profile/circle-social-media.svg")}
                alt=""
              />
              Social Media Links
            </label>
          </div>

          <div className="row mx-0 leads-new-details-media-block">
            {/* linkedIn */}
            <div className="col-5 mb-30">
              <div className="d-flex align-items-end social-media-leads-img-input-block">
                <img
                  src={require("../../../../src/assets//img/icons/Dominate-Icon_linkedin.svg")}
                  alt="social media"
                  className="summary-outlookImg"
                />
                <p className="font-18-regular leads-new-details-profile-form-display__blue-text leads-new-details-profile-form-display__blue-text--word-break">
                  {!isEmpty(values.leadMediaLinkedInInput)
                    ? values.leadMediaLinkedInInput
                    : "-----"}
                </p>
              </div>
            </div>

            {/* facebook */}
            <div className="col-5 mb-30">
              <div className="d-flex align-items-end social-media-leads-img-input-block">
                <img
                  src={require("../../../../src/assets//img/icons/Dominate-Icon_facebook.png")}
                  alt="social media"
                  className="summary-outlookImg"
                />
                <p className="font-18-regular leads-new-details-profile-form-display__blue-text leads-new-details-profile-form-display__blue-text--word-break">
                  {!isEmpty(values.leadMediaFacebookInput)
                    ? values.leadMediaFacebookInput
                    : "-----"}
                </p>
              </div>
            </div>
            {/* instagram */}
            <div className="col-5 mb-30">
              <div className="d-flex align-items-end social-media-leads-img-input-block">
                <img
                  src={require("../../../../src/assets//img/icons/Dominate-Icon_instagram.png")}
                  alt="social media"
                  className="summary-outlookImg"
                />
                <p className="font-18-regular leads-new-details-profile-form-display__blue-text leads-new-details-profile-form-display__blue-text--word-break">
                  {!isEmpty(values.leadMediaInstagramInput)
                    ? values.leadMediaInstagramInput
                    : "-----"}
                </p>
              </div>
            </div>

            {/* other */}
            <div className="col-5 mb-30">
              <div className="d-flex align-items-end social-media-leads-img-input-block">
                <img
                  src={require("../../../../src/assets//img/icons/Dominate-Icon_others.svg")}
                  alt="social media"
                  className="summary-outlookImg"
                />
                <p className="font-18-regular leads-new-details-profile-form-display__blue-text leads-new-details-profile-form-display__blue-text--word-break">
                  {!isEmpty(values.leadMediaOthersInput)
                    ? values.leadMediaOthersInput
                    : "-----"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );

    // skype address
    const leadAddSkypeAddress = (
      <div className="leads-new-details-colm-phone">
        <label
          htmlFor="leadMediaEmailCheckbox"
          className="add-lead-label font-24-semibold mt-20 mb-0"
        >
          <img
            src={require("../../../../src/assets/img/leads-new/profile/circle-company.svg")}
            alt=""
          />
          Skype address
        </label>
        <div className="leads-new-details-skype-block mb-30">
          <div className="d-flex align-items-end social-media-leads-img-input-block ">
            <img
              src={require("../../../../src/assets//img/icons/icon-skype.svg")}
              alt="social media"
              className="summary-outlookImg"
            />
            <p className="font-18-regular leads-new-details-profile-form-display__blue-text leads-new-details-profile-form-display__blue-text--word-break">
              {!isEmpty(values.leadsSkypeAddress)
                ? values.leadsSkypeAddress
                : "-----"}
            </p>
          </div>
        </div>
      </div>
    );

    return (
      <>
        <div>{leadSourceDropdown}</div>
        <div>{selectFewTags}</div>
        <div>{aboutInputField}</div>
        {/* <div>{leadAddLocation}</div> */}
        <div>{leadAddMedia}</div>
        <div>{leadAddSkypeAddress}</div>
        <div>
          {!isEmpty(allFieldsValue) ? (
            <h5 className="font-21-medium leads-new-details-custom-fields-title">
              Custom Fields
            </h5>
          ) : (
            ""
          )}
          {renderCustomFields()}
        </div>

        {/* <LeadsNewDetailsShippingDisplay
          state={this.state.leadsShippingState}
          city={this.state.leadsShippingCity}
          pincode={this.state.leadsShippingPinCode}
          website={this.state.leadsShippingWebsite}
          billingValue={this.state.leadsShippingBilling}
        /> */}
      </>
    );
  };

  return (
    <>
      <div className="leads-new-details-profile-form leads-new-details-profile-form--display">
        {/*<p className="double_click_edit_text leads-new-details-profile-form-display__gray-italic-text leads-new-details-activity-log__text-gray-light-italic" onClick={this.props.onEditButton}>
               *Double click to edit fields
    </p>*/}
        <div className="lead-new-detail-edit-button-div">
          <button
            onClick={onEditButton}
            className="lead-new-detail-edit-button"
          >
            <img
              // src={require("./../../../assets/img/icons/profile-edit-icon.svg")}
              src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
              alt=""
            />
            Edit
          </button>
        </div>
        {renderName()}
        <div className="row mx-0">
          <div className="col-6 px-0">{renderEmail()}</div>
          <div className="col-6 px-0">{renderPhoneNumberblock()}</div>
        </div>

        <div className="row mx-0">
          <div className="col-6 px-0">
            {/* company */}
            <div className="leads-new-details-col-1 mb-30">
              <label
                htmlFor="company"
                className="add-lead-label font-21-regular"
              >
                <img
                  src={require("../../../../src/assets/img/leads-new/profile/circle-company.svg")}
                  alt=""
                />
                Account Name
              </label>
              <br />
              <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
                {!isEmpty(values.leadActivityData) &&
                  values.leadActivityData.accountData.accountname}
              </p>
            </div>
          </div>
          <div className="col-6 px-0">{renderWorthAmount()}</div>
        </div>

        {renderAddMoreInfoModel()}
      </div>
    </>
  );
}

export default LeadsNewDetailsProfileFormDisplay;
