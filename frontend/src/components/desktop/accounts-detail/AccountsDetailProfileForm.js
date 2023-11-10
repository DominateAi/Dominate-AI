import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";
import AccountsTextarea from "../common/AccountsTextarea";
import AccountUpdateProfileImageModal from "./AccountUpdateProfileImageModal";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector } from "react-redux";

function AccountsDetailProfileForm({
  errors,
  handleOnClickCancelButton,
  handleOnClickSaveButton,
}) {
  const [values, setValues] = useState({
    accountsName: "",
    selectOption: "",
    displayListSelected: [],
    options: [],
    accountsLocation: "",
    accountsShippingAddress: "",
    accountsBillingAddress: "",
    aboutAccount: "",
  });

  const singleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isEmpty(singleAccountData)) {
      setValues({
        ...values,
        singleAccountData: singleAccountData,
        accountsName: singleAccountData.accountname,
        accountsLocation: singleAccountData.location,
        accountsShippingAddress: singleAccountData.addresses.shipping_line_one,
        accountsBillingAddress: singleAccountData.addresses.billing_line_one,
        aboutAccount: singleAccountData.description,
      });
    }
  }, [singleAccountData]);

  /*==============================
      Form Events Handlers
  ================================*/
  const handleChange = (e) => {
    setValues({
      ...values,
      errors: {},
      apiErrors: {},
      success: false,
      hasSetErrors: false,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeSelectClient = (selectedOption) => {
    setValues({
      ...values,
      selectOption: selectedOption,
      errors: { displayListSelected: "" },
    });

    // add option to list if it's not present in list
    let newList = values.displayListSelected;
    if (newList.indexOf(selectedOption) === -1) {
      newList.push(selectedOption);
      setValues({
        ...values,
        displayListSelected: newList,
      });
    }
  };

  const handleRemoveMember = (index) => (e) => {
    let newList = values.displayListSelected;
    newList.splice(index, 1);
    setValues({
      ...values,
      selectOption: "",
      displayListSelected: newList,
    });
  };

  /*==============================
      renderForm
  ================================*/
  const renderForm = () => {
    // const { errors } = this.props;
    const { singleAccountData } = values;
    return (
      <div className="leads-new-details-profile-form pt-0">
        <div className="add-lead-form-field-block new-edit-lead-form-row__emp-block new-edit-lead-form-row__emp-block--accounts pl-0 mt-20">
          {/* accounts name */}
          <div className="leads-new-circle-block">
            <img
              src={require("../../../../src/assets/img/accounts/acc-circle-name.svg")}
              alt=""
              className="leads-new-circle-block__circle"
            />
            <AddEmployeesFormFields
              checkboxClass="edit-account-form-row pb-16"
              type="text"
              htmlFor={"accountsName"}
              labelName={"Account's name"}
              id={"accountsName"}
              name={"accountsName"}
              placeholder={"Eg. name"}
              onChange={handleChange}
              value={values.accountsName}
              maxLength={maxLengths.char30}
              error={errors.accountsName}
            />
          </div>

          {/* select leads */}

          {/* <div className="leads-new-circle-block account-view-leads-selected">
            <img
              src={require("../../../../src/assets/img/accounts/acc-circle-leads.svg")}
              alt=""
              className="leads-new-circle-block__circle"
            />
            <AddMemberSelectAndDisplayList
              selectedOptionValue={this.state.selectOption}
              handleChangeSelectClient={this.handleChangeSelectClient}
              options={this.state.options}
              displayListSelected={this.state.displayListSelected}
              handleRemoveMember={this.handleRemoveMember}
              error={errors.displayListSelected}
            />
          </div> */}

          {/* billing address */}
          <div className="leads-new-circle-block">
            <img
              src={require("../../../../src/assets/img/accounts/acc-circle-billing.svg")}
              alt=""
              className="leads-new-circle-block__circle"
            />
            <AccountsTextarea
              checkboxClass="edit-account-form-row"
              htmlFor="accountsBillingAddress"
              labelName="Billing Address"
              value={values.accountsBillingAddress}
              onChange={handleChange}
              error={errors.accountsBillingAddress}
            />
          </div>

          {/* shipping address */}
          <div className="leads-new-circle-block">
            <img
              src={require("../../../../src/assets/img/accounts/acc-circle-shipping.svg")}
              alt=""
              className="leads-new-circle-block__circle"
            />
            <AccountsTextarea
              checkboxClass="edit-account-form-row"
              htmlFor="accountsShippingAddress"
              labelName="Shipping Address"
              value={values.accountsShippingAddress}
              onChange={handleChange}
              error={errors.accountsShippingAddress}
            />
          </div>

          {/* location */}
          <div className="leads-new-circle-block">
            <img
              src={require("../../../../src/assets/img/accounts/acc-circle-location.svg")}
              alt=""
              className="leads-new-circle-block__circle"
            />
            <AddEmployeesFormFields
              checkboxClass="edit-account-form-row"
              type="text"
              htmlFor={"accountsLocation"}
              labelName={"Location"}
              id={"accountsLocation"}
              name={"accountsLocation"}
              placeholder={""}
              onChange={handleChange}
              value={values.accountsLocation}
              maxLength={maxLengths.char30}
              error={errors.accountsLocation}
            />
          </div>

          <div className="leads-new-circle-block">
            <img
              src={require("../../../../src/assets/img/accounts/acc-circle-location.svg")}
              alt=""
              className="leads-new-circle-block__circle"
            />
            <AccountsTextarea
              htmlFor="aboutAccount"
              labelName="About account"
              value={values.aboutAccount}
              maxLength={maxLengths.char200}
              onChange={handleChange}
              error={errors.aboutAccount}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* main row */}
      <div className="row mx-0 flex-nowrap account-profile-display-main-row">
        {/* img colm */}
        <div className="account-profile-img-colm mt-20">
          <img
            src={require("../../../assets/img/accounts/profile.svg")}
            alt="account"
            className="account-profile-img-colm__account"
          />
          <AccountUpdateProfileImageModal />
        </div>
        {/* content colm */}
        <div className="col-12 px-0">{renderForm()}</div>
      </div>
      <div className="text-right leads-new-details-profile-btns-row">
        <button
          className="leads-new-details-profile-cancel-btn"
          onClick={handleOnClickCancelButton}
        >
          Cancel
        </button>
        <button
          className="leads-new-details-profile-save-btn"
          onClick={handleOnClickSaveButton(values)}
        >
          Save Changes
        </button>
      </div>
    </>
  );
}

export default AccountsDetailProfileForm;
