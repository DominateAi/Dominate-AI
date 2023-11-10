import React, { useState } from "react";
//import { validateAddAccount } from "../../../store/validations/accountsValidation/addAccountValidation";
import { validateEditAccount } from "../../../store/validations/accountsValidation/editAccountValidation";
import AccountsDetailNewProfileForm from "../accounts-detail-new/AccountsDetailNewProfileForm";
import AccountsDetailNewProfileFormDisplay from "../accounts-detail-new/AccountsDetailNewProfileFormDisplay";
import AccountDetailsNewLeadsCard from "./AccountDetailsNewLeadsCard";
import AccountDetailsNewProfileColumn2Card from "./AccountDetailsNewProfileColumn2Card";
import AccountDetailsNewUpcomingScheduleCard from "./AccountDetailsNewUpcomingScheduleCard";
import isEmpty from "../../../store/validations/is-empty";
import { updateAccountById } from "./../../../store/actions/accountsAction";

import { useSelector, useDispatch } from "react-redux";

let countData = [
  { count: "NN", name: "Leads" },
  { count: "NN", name: "Opportunity Leads" },
  { count: "NN", name: "Closed Leads" },
  { count: "NN", name: "Deals" },
  { count: "NN", name: "Closed-Deals" },
  { count: "NN", name: "Emails sent" },
  { count: "NN", name: "Follow Ups done" },
  { count: "NN", name: "Members allocated" },
];

function AccountDetailsNewProfileTabPanel() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    isProfileFormDoubleClicked: false,
  });

  const [errors, setErrors] = useState({});

  const singleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );

  /*===========================================
            handlers
  =============================================*/

  const handleOnDoubleClickProfileForm = () => {
    setValues({
      isProfileFormDoubleClicked: !values.isProfileFormDoubleClicked,
      // errors: {},
    });
    setErrors({});
  };

  const callBackUpdateAccount = (status) => {
    if (status === 200) {
      setValues({
        isProfileFormDoubleClicked: !values.isProfileFormDoubleClicked,
        // errors: {},
      });
      setErrors({});
    }
  };

  const handleOnClickSaveButton = (data) => (e) => {
    e.preventDefault();
    const {
      customTextboxfieldData,
      customeDropdownFieldData,
      accountCustomFields,
    } = data;

    const { errors, isValid } = validateEditAccount(data);
    console.log(errors);
    if (!isValid) {
      // this.setState({
      //   errors: errors,
      // });
      setErrors(errors);
    }
    if (isValid) {
      let formData = singleAccountData;
      formData.accountname = data.accountsName;
      formData.location = data.accountsLocation;
      formData.addresses.billing_line_one = data.accountsBillingAddress;
      formData.addresses.shipping_line_one = data.accountsShippingAddress;
      formData.credibility = data.accountCredibility;
      formData.description = data.accountAbout;
      formData.tags = data.tagsArray;
      formData.accountstatus = data.statusType === true ? "ACTIVE" : "INACTIVE";
      dispatch(
        updateAccountById(
          formData._id,
          formData,
          customTextboxfieldData,
          customeDropdownFieldData,
          accountCustomFields,
          callBackUpdateAccount
        )
      );
    }
  };

  if (!isEmpty(singleAccountData)) {
    countData = [
      { count: singleAccountData.overViewData.leadsCount, name: "Leads" },
      {
        count: singleAccountData.overViewData.opportunityLeads,
        name: "Opportunity Leads",
      },
      {
        count: singleAccountData.overViewData.convertedLeads,
        name: "Closed Leads",
      },
      { count: singleAccountData.overViewData.dealsCount, name: "Deals" },
      {
        count: singleAccountData.overViewData.closedDealsCount,
        name: "Closed-Deals",
      },
      {
        count: singleAccountData.overViewData.emailsCount,
        name: "Emails sent",
      },
      {
        count: singleAccountData.overViewData.followupsDoneCount,
        name: "Follow Ups done",
      },
      {
        count: singleAccountData.overViewData.usersCount,
        name: "Members allocated",
      },
    ];
  }

  return (
    <div className="row mx-0 align-items-start flex-nowrap">
      <div className="accounts-view-detail-new-colm1 flex-shrink-0 pb-16">
        <div className="accounts-detail-new-count-card row mx-0 align-items-start">
          {countData.map((data, index) => (
            <div key={index} className="accounts-detail-new-count-card__block">
              <h3 className="accounts-detail-new-count-card__blue-text">
                {data.count}
              </h3>
              <p className="accounts-detail-new-count-card__gray-text">
                {data.name}
              </p>
            </div>
          ))}
        </div>
        <div className="row mx-0">
          {/*<div onDoubleClick={this.handleOnDoubleClickProfileForm}>*/}
          <div>
            {values.isProfileFormDoubleClicked ? (
              <AccountsDetailNewProfileForm
                handleOnClickCancelButton={handleOnDoubleClickProfileForm}
                handleOnClickSaveButton={handleOnClickSaveButton}
                errors={errors}
              />
            ) : (
              <AccountsDetailNewProfileFormDisplay
                onClickEdit={handleOnDoubleClickProfileForm}
              />
            )}
          </div>
          <div>
            <AccountDetailsNewUpcomingScheduleCard />
            <AccountDetailsNewLeadsCard />
          </div>
        </div>
      </div>
      <AccountDetailsNewProfileColumn2Card />
    </div>
  );
}

export default AccountDetailsNewProfileTabPanel;
