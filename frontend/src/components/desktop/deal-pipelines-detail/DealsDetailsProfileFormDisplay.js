import React, { useState, useEffect } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import DealsUpdateProfileImageModal from "./DealsUpdateProfileImageModal";
import { useSelector } from "react-redux";

function DealsDetailsProfileFormDisplay({ onClickEdit }) {
  const [values, setValues] = useState({
    dealsName: "",
    dealsAccountNameSelectedOption: "",
    leadNameSelectedOption: "",
    salesPersonName: "",
    worthValueOfDeal: "",
  });

  const singleDealData = useSelector((state) => state.deals.singleDealData);
  const allFieldsValue = useSelector(
    (state) => state.commandCenter.allFieldsValue
  );

  useEffect(() => {
    if (!isEmpty(singleDealData)) {
      setValues({
        ...values,
        singleDealData: singleDealData,
        dealsName: singleDealData.dealname,
        worthValueOfDeal: singleDealData.value,
        leadNameSelectedOption:
          singleDealData.lead !== undefined ? singleDealData.lead.name : "",
        dealsAccountNameSelectedOption: singleDealData.account.accountname,
        salesPersonName: singleDealData.salesperson.name,
      });
    }
  }, [singleDealData]);

  /*==========================================
          renderNameEmail
  ===========================================*/
  const renderNameEmail = () => {
    // const { allFieldsValue } = this.props;

    return (
      <>
        {/* account name */}
        <div className="accounts-profile-display-fields-outer-block">
          <h3 className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-account.svg")}
              alt=""
            />
            Account Name
          </h3>
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(values.dealsAccountNameSelectedOption)
              ? values.dealsAccountNameSelectedOption
              : "-----"}
          </p>
        </div>

        {/* lead name */}
        <div className="accounts-profile-display-fields-outer-block">
          <h3 className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-lead.svg")}
              alt=""
            />
            Lead Name
          </h3>
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(values.leadNameSelectedOption)
              ? values.leadNameSelectedOption
              : "-----"}
          </p>
        </div>

        {/* Salesperson */}
        <div className="accounts-profile-display-fields-outer-block">
          <h3 className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-email.svg")}
              alt=""
            />
            Salesperson
          </h3>
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(values.salesPersonName)
              ? values.salesPersonName
              : "-----"}
          </p>
        </div>

        {/* worth amount */}
        <div className="accounts-profile-display-fields-outer-block">
          <h3 className="add-lead-label font-21-regular">
            <img
              src={require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-amount.svg")}
              alt=""
            />
            Worth Amount($)
          </h3>
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(values.worthValueOfDeal)
              ? values.worthValueOfDeal
              : "-----"}
          </p>
        </div>

        {/* Custom Fields */}
        {!isEmpty(allFieldsValue) ? (
          <h5 className="font-24-semibold deals-details-profile-from-display-custom-fields-title">
            Custom Fields
          </h5>
        ) : (
          ""
        )}
        {!isEmpty(allFieldsValue) &&
          allFieldsValue.map((data, index) => {
            return (
              <div
                key={index}
                className="accounts-profile-display-fields-outer-block"
              >
                <h3 className="add-lead-label font-21-regular">
                  <img
                    src={require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-account.svg")}
                    alt=""
                  />
                  {data.fieldData.name}
                </h3>
                <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
                  {data.value}
                </p>
              </div>
            );
          })}
      </>
    );
  };
  return (
    <>
      <div className="leads-new-details-profile-form leads-new-details-profile-form--display pt-0">
        {/*<p className="leads-new-details-profile-form-display__gray-italic-text leads-new-details-activity-log__text-gray-light-italic">
                 *Double click to edit fields
         </p>*/}
        <div className="lead-new-detail-edit-button-div lead-new-detail-edit-button-div--deals-details">
          <button onClick={onClickEdit} className="lead-new-detail-edit-button">
            <img
              src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
              alt=""
            />
            Edit
          </button>
        </div>

        {/* main row */}
        <div className="row mx-0 account-profile-display-main-row">
          {/* img colm */}
          <div className="account-profile-img-colm">
            {/* <img
                    src={require("../../../assets/img/accounts/profile.svg")}
                    alt="deal"
                    className="account-profile-img-colm__account"
                  /> */}
            <DealsUpdateProfileImageModal />
          </div>
          {/* content colm */}
          <div className="account-profile-content-colm">
            <h2 className="accounts-profile-display-title">
              {values.dealsName}
            </h2>
            {renderNameEmail()}
          </div>
        </div>
      </div>
    </>
  );
}

export default DealsDetailsProfileFormDisplay;
