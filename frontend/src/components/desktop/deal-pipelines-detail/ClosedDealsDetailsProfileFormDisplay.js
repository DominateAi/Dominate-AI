import React, { useState, useEffect } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import DealsUpdateProfileImageModal from "./DealsUpdateProfileImageModal";
import dateFns from "date-fns";
import { useSelector } from "react-redux";

function ClosedDealsDetailsProfileFormDisplay({ onClickEdit }) {
  const [values, setValues] = useState({
    dealsName: "Deal Name",
    dealsAccountNameSelectedOption: "",
    leadNameSelectedOption: "",
    salesPersonName: "",
    worthValueOfDeal: "",
    dealType: "",
    startDate: "",
    endDate: "",
    frequencySelectedOptionDropdown: "",
    nextPaymentOn: "",
    city: "",
    shippingAddress: "",
  });

  const singleDealData = useSelector((state) => state.deals.singleDealData);
  const allFieldsValue = useSelector(
    (state) => state.commandCenter.allFieldsValue
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        dealType: singleDealData.type,
        startDate: dateFns.format(singleDealData.startDate, "DD/MM/YYYY"),
        endDate: dateFns.format(singleDealData.endDate, "DD/MM/YYYY"),
        frequencySelectedOptionDropdown: singleDealData.frequency,
        closingDate: dateFns.format(singleDealData.closingDate, "DD/MM/YYYY"),
      });
    }
  }, [singleDealData]);

  /*==========================================
          renderTitleAndDescription
  ===========================================*/
  const renderTitleAndDescription = (imgPath, title, desc) => {
    return (
      <div className="accounts-profile-display-fields-outer-block">
        <h3 className="add-lead-label font-21-regular">
          <img src={imgPath} alt="" />
          {title}
        </h3>
        <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
          {!isEmpty(desc) ? desc : "-----"}
        </p>
      </div>
    );
  };

  /*==========================================
          renderContent
  ===========================================*/
  const renderContent = () => {
    // const { allFieldsValue } = this.props;
    return (
      <>
        <div className="row mx-0">
          <div className="col-6 px-0">
            {/* account name */}
            {renderTitleAndDescription(
              require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-account.svg"),
              "Account Name",
              values.dealsAccountNameSelectedOption
            )}
          </div>
          <div className="col-6 px-0">
            {/* lead name */}
            {renderTitleAndDescription(
              require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-lead.svg"),
              "Lead Name",
              values.leadNameSelectedOption
            )}
          </div>
        </div>

        <div className="row mx-0">
          <div className="col-6 px-0">
            {/* Salesperson */}
            {renderTitleAndDescription(
              require("../../../../src/assets/img/leads-new/profile/circle-email.svg"),
              "Salesperson",
              values.salesPersonName
            )}
          </div>
          <div className="col-6 px-0">
            {/* worth amount */}
            {renderTitleAndDescription(
              require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-amount.svg"),
              "Worth Amount($)",
              values.worthValueOfDeal
            )}
          </div>
        </div>

        <div className="row mx-0">
          <div className="col-3 px-0">
            {/* deal type */}
            {renderTitleAndDescription(
              require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-type.svg"),
              "Deal Type",
              values.dealType
            )}
          </div>
          {values.dealType === "RECURRING" && (
            <div className="col-3 px-0">
              {/* frequency */}
              {renderTitleAndDescription(
                require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-frequency.svg"),
                "Frequency",
                values.frequencySelectedOptionDropdown
              )}
            </div>
          )}

          {values.dealType === "RECURRING" && (
            <>
              {" "}
              <div className="col-3 px-0">
                {/* start date */}
                {renderTitleAndDescription(
                  require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-start-date.svg"),
                  "Start Date",
                  values.startDate
                )}
              </div>
              <div className="col-3 px-0">
                {/* end date */}
                {renderTitleAndDescription(
                  require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-end-date.svg"),
                  "End Date",
                  values.endDate
                )}
              </div>
            </>
          )}
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

        {/* next payment on */}
        {/* <div className="col-4 pl-0">
            {this.renderTitleAndDescription(
              require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-payment.svg"),
              "Next Payment on",
              this.state.nextPaymentOn
            )}
          </div> */}

        {/* city */}
        {/* {this.renderTitleAndDescription(
          require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-city.svg"),
          "City",
          this.state.city
        )} */}

        {/* shipping address */}
        {/* {this.renderTitleAndDescription(
          require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-shipping-address.svg"),
          "Shipping Address",
          this.state.shippingAddress
        )} */}
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
              // src={require("./../../../assets/img/icons/profile-edit-icon.svg")}
              src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
              alt=""
            />
            Edit
          </button>
        </div>

        {/* main row */}
        <div className="row mx-0 flex-nowrap account-profile-display-main-row">
          {/* img colm */}
          <div className="flex-shrink-0 account-profile-img-colm">
            {/* <img
                src={require("../../../assets/img/accounts/profile.svg")}
                alt="deal"
                className="account-profile-img-colm__account"
              /> */}
            <DealsUpdateProfileImageModal />
          </div>
          {/* content colm */}
          <div className="col-10 pl-0 account-profile-content-colm">
            <h2 className="accounts-profile-display-title">
              {values.dealsName}
              <br />
              <p className="font-24-semibold deal-closed-on-text">
                Closed on : {values.closingDate}
              </p>
            </h2>

            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}

export default ClosedDealsDetailsProfileFormDisplay;
