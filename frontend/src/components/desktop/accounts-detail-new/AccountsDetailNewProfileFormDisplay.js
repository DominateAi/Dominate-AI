import React, { useState, useEffect, Fragment } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import { deleteLeadInAccountDetails } from "./../../../store/actions/accountsAction";
import { useDispatch, useSelector } from "react-redux";

function AccountsDetailNewProfileFormDisplay({ onClickEdit }) {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    accountCredibility: "",
    accountStatus: "",
    tagsArray: [],
    customFieldName: "Lorem Ipsum",
    accountsShippingAddress: "",
    accountsBillingAddress: "",
    about: "",
    singleAccountData: {},
  });

  const singleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );
  const allFieldsValue = useSelector(
    (state) => state.commandCenter.allFieldsValue
  );

  useEffect(() => {
    if (!isEmpty(singleAccountData)) {
      setValues({
        ...values,
        singleAccountData: singleAccountData,
        accountCredibility: singleAccountData.credibility,
        accountStatus: singleAccountData.accountstatus,
        accountsShippingAddress: singleAccountData.addresses.billing_line_one,
        accountsBillingAddress: singleAccountData.addresses.shipping_line_one,
        tagsArray: singleAccountData.tags,
        about: singleAccountData.description,
      });
    }
  }, [singleAccountData]);

  const renderCustomFields = () => {
    // const { allFieldsValue } = this.props;

    if (!isEmpty(allFieldsValue)) {
      return allFieldsValue.map((data, index) => {
        return (
          <div
            key={index}
            className="accounts-profile-display-fields-outer-block accounts-profile-display-fields-outer-block--custom-fileds"
          >
            <h3 className="add-lead-label row mx-0 align-items-center font-21-regular">
              <img
                // src={require("../../../../src/assets/img/accounts-new/form-circle-icon-2.svg")}
                alt=""
                src={"/img/desktop-dark-ui/icons/star-with-pencil-icon.svg"}
                className="account-details-custom-fields-lable-icon"
              />
              {data.fieldData.name}
            </h3>
            <div className="accounts-profile-display-fields-text-block-2">
              <p className="font-13-medium">
                {" "}
                {!isEmpty(data.value) ? data.value : "-----"}
              </p>
            </div>
          </div>
        );
      });
    }
  };

  /*==========================================
          renderNameEmail
  ===========================================*/
  const renderNameEmail = () => {
    return (
      <>
        <div className="account-details-acc-credibility-and-status-div">
          <div className="row mx-0 align-items-start">
            {/* Account Credibility */}
            <div className="col-6 px-0 accounts-profile-display-fields-outer-block">
              <h3 className="add-lead-label font-21-regular align-items-center row mx-0 flex-nowrap">
                <img
                  // src={require("../../../../src/assets/img/accounts-new/form-circle-icon-1.svg")}
                  src={"/img/desktop-dark-ui/icons/info-square-icon.svg"}
                  alt=""
                  className="account-credibility-icon"
                />
                Account Credibility
              </h3>
              <div className="accounts-profile-display-fields-text-block-1">
                <p className="font-13-medium">
                  {!isEmpty(values.accountCredibility)
                    ? values.accountCredibility
                    : "-----"}
                </p>
              </div>
            </div>
            {/* Account Status */}
            <div className="col-6 px-0 accounts-profile-display-fields-outer-block">
              <h3 className="add-lead-label font-21-regular align-items-center row mx-0 flex-nowrap">
                <img
                  // src={require("../../../../src/assets/img/accounts-new/form-circle-icon-2.svg")}
                  src={"/img/desktop-dark-ui/icons/person-with-check-icon.svg"}
                  alt=""
                  className="account-status-icon"
                />
                Account Status
              </h3>
              <div className="accounts-profile-display-fields-text-block-1">
                <p className="font-13-medium">
                  {!isEmpty(values.accountStatus)
                    ? values.accountStatus
                    : "-----"}
                </p>
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="accounts-profile-display-fields-outer-block">
            <h3 className="add-lead-label font-21-regular align-items-center row mx-0 flex-nowrap">
              <img
                // src={require("../../../../src/assets/img/accounts-new/form-circle-icon-3.svg")}
                src={
                  "/img/desktop-dark-ui/icons/account-details-location-icon.svg"
                }
                alt=""
                className="account-billing-icon"
              />
              Billing Address
            </h3>
            <div className="accounts-profile-display-fields-text-block-1">
              <p className="font-13-medium">
                {!isEmpty(values.accountsBillingAddress)
                  ? values.accountsBillingAddress
                  : "-----"}
              </p>
            </div>
          </div>
          {/* Shipping Address */}
          <div className="accounts-profile-display-fields-outer-block">
            <h3 className="add-lead-label font-21-regular align-items-center row mx-0 flex-nowrap">
              <img
                // src={require("../../../../src/assets/img/accounts-new/form-circle-icon-4.svg")}
                src={
                  "/img/desktop-dark-ui/icons/account-details-billing-add-icon.svg"
                }
                alt=""
                className="account-shipping-address-icon"
              />
              Shipping Address
            </h3>
            <div className="accounts-profile-display-fields-text-block-1">
              <p className="font-13-medium">
                {!isEmpty(values.accountsShippingAddress)
                  ? values.accountsShippingAddress
                  : "-----"}
              </p>
            </div>
          </div>
          {/* Custom field name }
        {this.renderCustomFields()*/}

          {/* Tags */}
          <div className="accounts-profile-display-fields-outer-block">
            <h3 className="add-lead-label font-21-regular align-items-center row mx-0 flex-nowrap">
              <img
                // src={require("../../../../src/assets/img/accounts-new/form-circle-icon-2.svg")}
                src={"/img/desktop-dark-ui/icons/bookmark-icon.svg"}
                alt=""
                className="account-tags-icon"
              />
              Tags
            </h3>
            <div className="accounts-profile-display-fields-text-block-1 row mx-0 align-items-start">
              {!isEmpty(values.tagsArray)
                ? values.tagsArray.map((tag, index) => (
                    <p
                      key={index}
                      className="font-13-medium tag-border-block leads-tags-in-input-field__tags"
                    >
                      {tag}
                    </p>
                  ))
                : "-----"}
            </div>
          </div>
        </div>{" "}
        {/* Custom field name */}
        {!isEmpty(allFieldsValue) ? (
          <h2 className="mb-25 pt-40 row mx-0 align-items-center font-16-semibold">
            <img
              src={
                "/img/desktop-dark-ui/icons/account-details-custom-fileds-icon.svg"
              }
              alt=""
              className="account-details-custom-fileds-icon"
            />
            Custom Fields
          </h2>
        ) : (
          ""
        )}
        {renderCustomFields()}
      </>
    );
  };

  return (
    <>
      <div className="accounts-detail-new-profile-form-div">
        {/*<div className="row mx-0 align-items-center justify-content-between">*/}
        <div className="accounts-new-details-title-div">
          <h3 className="accounts-new-details-us-title">
            <img
              src={require("../../../../src/assets/img/accounts-new/office-icon.svg")}
              alt="office"
              className="accounts-new-details-profile-calendar-icon"
            />
            About Company
            {/*<span className="double_click_edit_account_text leads-new-details-profile-form-display__gray-italic-text leads-new-details-activity-log__text-gray-light-italic">
                  *Double click to edit fields
        </span>*/}
          </h3>
          <div className="lead-new-detail-edit-button-div">
            <button
              onClick={onClickEdit}
              className="lead-new-detail-edit-button"
            >
              <img
                src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
                alt=""
              />
              Edit
            </button>
          </div>
        </div>
        <div className="leads-new-details-profile-form leads-new-details-profile-form--display pt-0">
          {/* main row */}
          {/* content colm */}
          <div className="account-profile-content-colm account-details-new-form-card-block">
            <p className="font-13-regular mb-30 pt-20">{values.about}</p>

            {renderNameEmail()}
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountsDetailNewProfileFormDisplay;
