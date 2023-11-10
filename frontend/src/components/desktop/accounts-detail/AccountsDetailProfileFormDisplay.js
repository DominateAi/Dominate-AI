import React, { Fragment, useState, useEffect } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import AccountDetailsAddLeadToAccountModal from "./AccountDetailsAddLeadToAccountModal";
import AccountsDetailProfileFormDisplayContactsLeadsCard from "./AccountsDetailProfileFormDisplayContactsLeadsCard";
import AccountUpdateProfileImageModal from "./AccountUpdateProfileImageModal";
import { connect } from "react-redux";
import { deleteLeadInAccountDetails } from "./../../../store/actions/accountsAction";
import { useDispatch, useSelector } from "react-redux";
import displaySmallText from "./../../../store/utils/sliceString";
import CommandCentreImgTextBorder from "../command-centre/CommandCentreImgTextBorder";

function AccountsDetailProfileFormDisplay({ onClickEdit }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    accountsName: "Account Name",
    displayListSelected: [],
    accountsLocation: "California, USA",
    accountsShippingAddress: "",
    accountsBillingAddress: "",
  });

  const [leadsOfAccount, setLeadsOfAccount] = useState([]);
  const [singleAccountData, setSingleAccountData] = useState([]);

  const singleAccountDataReducer = useSelector(
    (state) => state.account.singleAccountData
  );
  const leadsOfAccountReducer = useSelector(
    (state) => state.account.leadsOfAccount
  );

  useEffect(() => {
    if (!isEmpty(singleAccountDataReducer)) {
      setValues({
        ...values,
        accountsName: singleAccountDataReducer.accountname,
        accountsLocation: singleAccountDataReducer.location,
        accountsShippingAddress:
          singleAccountDataReducer.addresses.shipping_line_one,
        accountsBillingAddress:
          singleAccountDataReducer.addresses.billing_line_one,
      });
      setSingleAccountData(singleAccountDataReducer);
    }
  }, [singleAccountDataReducer]);

  useEffect(() => {
    if (!isEmpty(leadsOfAccountReducer)) {
      setLeadsOfAccount(leadsOfAccountReducer);
    }
  }, [leadsOfAccountReducer]);

  /*==========================================
          renderContactsLeads
  ===========================================*/

  const handleOnClickRemoveContactsLeads = (leadData) => (e) => {
    // const { singleAccountData } = values;

    dispatch(deleteLeadInAccountDetails(leadData._id, singleAccountData._id));
  };

  const renderContactsLeads = () => {
    const { displayListSelected } = values;
    // console.log(leadsOfAccount);
    return (
      <>
        <div className="account-details-general-tab-border-div">
          <div className="row mx-0 flex-nowrap justify-content-between account-profile-display-contactLeads-row">
            {/* <h3 className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-email.svg")}
              alt=""
            />
            Leads
          </h3> */}
            <CommandCentreImgTextBorder title="Leads" />
            <AccountDetailsAddLeadToAccountModal />
          </div>
        </div>
        <div className="row mx-0 align-items-center flex-nowrap account-details-conatcts-leads-card-title-div">
          <h3 className="font-14-semibold account-details-conatcts-leads-card-title-1">
            name
          </h3>
          <h3 className="font-14-semibold account-details-conatcts-leads-card-title-2">
            phone number
          </h3>
          <h3 className="font-14-semibold account-details-conatcts-leads-card-title-3">
            level
          </h3>
          <h3 className="font-14-semibold account-details-conatcts-leads-card-title-4">
            assigned to
          </h3>
          <h3 className="font-14-semibold account-details-conatcts-leads-card-title-5">
            status
          </h3>
        </div>
        {!isEmpty(leadsOfAccount) &&
          leadsOfAccount.map((data, index) => (
            <Fragment key={index}>
              <div className="row mx-0 align-items-center account-profile-display-contactLeads-outer-row">
                <AccountsDetailProfileFormDisplayContactsLeadsCard
                  cardData={data}
                />
                <div
                  className="account-contact-leads-remove-icon-block"
                  onClick={handleOnClickRemoveContactsLeads(data)}
                >
                  {/* <img
                    src={require("../../../../src/assets/img/accounts/accounts-contact-leads-remove.svg")}
                    alt="remove"
                  /> */}
                  <img
                    src={"/img/desktop-dark-ui/icons/close-icon.svg"}
                    alt="remove"
                  />
                </div>
              </div>
            </Fragment>
          ))}
      </>
    );
  };

  /*==========================================
          renderSalesPersonRow
  ===========================================*/
  const renderSalesPersonRow = () => {
    // const { singleAccountData } = values;
    return (
      <div>
        {/* <div className="row mx-0 justify-content-between mt-10 account-profile-display-salesperson-row"> */}
        {/* <h3 className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-email.svg")}
              alt=""
            />
            Salespersons
          </h3>
          <p className="font-16-light account-profile-display-salesperson-note">
            Salesperson will be automatically tagged based on leads assigned
          </p> */}
        {/* </div> */}
        <div className="account-details-general-tab-border-div pt-50">
          <CommandCentreImgTextBorder title="sales person" />
        </div>
        <div className="row mx-0 align-items-center accounts-profile-display-fields-text-block-salesperson-title-div">
          <h3 className="font-14-semibold accounts-profile-display-fields-text-block-salesperson-title-1">
            name
          </h3>
          <h3 className="font-14-semibold accounts-profile-display-fields-text-block-salesperson-title-2">
            email address
          </h3>
          <h3 className="font-14-semibold accounts-profile-display-fields-text-block-salesperson-title-3">
            role
          </h3>
        </div>
        {/* card */}
        {!isEmpty(singleAccountData) &&
          singleAccountData.usersData.map((user, index) => {
            return (
              <div
                key={index}
                className="accounts-profile-display-fields-text-block-salesperson "
              >
                <div className="row align-items-center mx-0">
                  <div className="accounts-profile-display-fields-text-block-salesperson-col1 mx-0 pl-0">
                    <div className="accounts-profile-display-fields-text-block-salesperson-img-div">
                      <img
                        src={require("../../../assets/img/accounts/deal-dot.svg")}
                        alt="sales person"
                        className="accounts-profile-display-fields-text-block-salesperson-img"
                      />
                    </div>
                    <h3 className="font-18-regular accounts-profile-display-fields-text-block-salesperson-title">
                      {user.name}
                    </h3>
                  </div>
                  <div className="accounts-profile-display-fields-text-block-salesperson-col2 mx-0">
                    {/* <h3 className="accounts-profile-display-fields-text-block-salesperson-subtitle">
                      Email adress
                    </h3> */}
                    <h3 className="font-18-regular accounts-profile-display-fields-text-block-salesperson-data">
                      {user.email}
                    </h3>
                  </div>
                  <div className="accounts-profile-display-fields-text-block-salesperson-col3 mx-0">
                    {/*  <h3 className="accounts-profile-display-fields-text-block-salesperson-subtitle">
                      Role
                    </h3> */}
                    <h3 className="font-18-regular accounts-profile-display-fields-text-block-salesperson-data">
                      {user.jobTitle === undefined ? "Admin" : user.jobTitle}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  /*==========================================
          renderNameEmail
  ===========================================*/
  const renderNameEmail = () => {
    return (
      <>
        {/* Billing Address */}
        <div className="accounts-profile-display-fields-outer-block">
          {/* <h3 className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/accounts/acc-circle-billing.svg")}
              alt=""
            />
            Billing Address
          </h3> */}
          <div className="account-details-general-tab-border-div pt-50 pb-16">
            <CommandCentreImgTextBorder
              title="billing address"
              imgPath={
                "/img/desktop-dark-ui/icons/account-details-billing-add-icon.svg"
              }
            />
          </div>
          <div className="accounts-profile-display-fields-text-block-1">
            {/* leads-new-details-profile-form-display__blue-text */}
            <p className="font-18-semibold  leads-new-details-profile-form-display__blue-text--word-break">
              {!isEmpty(values.accountsBillingAddress)
                ? values.accountsBillingAddress
                : "-----"}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="accounts-profile-display-fields-outer-block">
          {/* <h3 className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/accounts/acc-circle-shipping.svg")}
              alt=""
            />
            Shipping Address
          </h3> */}
          <div className="account-details-general-tab-border-div pt-50 pb-16">
            <CommandCentreImgTextBorder
              title="shipping address"
              imgPath={
                "/img/desktop-dark-ui/icons/account-details-shipping-add-icon.svg"
              }
            />
          </div>
          <div className="accounts-profile-display-fields-text-block-1">
            {/* leads-new-details-profile-form-display__blue-text */}
            <p className="font-18-semibold  leads-new-details-profile-form-display__blue-text--word-break">
              {!isEmpty(values.accountsShippingAddress)
                ? values.accountsShippingAddress
                : "-----"}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="accounts-profile-display-fields-outer-block ">
          {/* <h3 className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/accounts/acc-circle-location.svg")}
              alt=""
            />
            Location
          </h3> */}
          <div className="account-details-general-tab-border-div pt-50 pb-16">
            <CommandCentreImgTextBorder
              title="location"
              imgPath={
                "/img/desktop-dark-ui/icons/account-details-location-icon.svg"
              }
            />
          </div>
          <div className="accounts-profile-display-fields-text-block-2">
            {/* leads-new-details-profile-form-display__blue-text */}
            <p className="font-18-semibold  leads-new-details-profile-form-display__blue-text--word-break">
              {!isEmpty(values.accountsLocation)
                ? values.accountsLocation
                : "-----"}
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="leads-new-details-profile-form leads-new-details-profile-form--display pt-0">
        {/*<p className="leads-new-details-profile-form-display__gray-italic-text leads-new-details-activity-log__text-gray-light-italic">
             *Double click to edit fields
     </p>*/}
        {/* <div className="lead-new-detail-edit-button-div lead-new-detail-edit-button-div--accounts-details">
          <button onClick={onClickEdit} className="lead-new-detail-edit-button">
            <img
              src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
              alt=""
            />
            Edit
          </button>
        </div> */}

        {/* main row */}
        <div className="row mx-0 account-profile-display-main-row">
          {/* img colm */}
          <div className="account-profile-img-colm">
            <img
              src={require("../../../assets/img/accounts/profile.svg")}
              alt="account"
              className="account-profile-img-colm__account"
            />
            <AccountUpdateProfileImageModal />
          </div>
          {/* content colm */}
          <div className="account-profile-content-colm">
            <h2 className="accounts-profile-display-title">
              {displaySmallText(values.accountsName, 15, true)}
            </h2>
            <button
              onClick={onClickEdit}
              className="lead-new-detail-edit-button lead-new-detail-edit-button--account-details"
            >
              <img
                src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
                alt=""
              />
              Edit
            </button>
          </div>
          {renderContactsLeads()}
          {renderSalesPersonRow()}
          {renderNameEmail()}
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export default AccountsDetailProfileFormDisplay;
