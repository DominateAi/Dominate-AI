import React, { Fragment, useState, useEffect } from "react";
import "../common/CustomModalStyle.css";
import Select from "react-select";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import AddLeadsFormField from "./../leads/AddLeadsFormField";

import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import DealsUpdateProfileImageModal from "./DealsUpdateProfileImageModal";
import isEmpty from "./../../../store/validations/is-empty";
import { useSelector } from "react-redux";

const frequencyOptions = [
  { value: "Yearly", label: "Yearly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
];

function DealsDetailsProfileForm({
  errors,
  handleOnClickCancelButton,
  handleOnClickSaveButton,
}) {
  const [values, setValues] = useState({
    dealsName: "",
    dealsAccountNameSelectedOption: {},
    dealsAccountNameOptions: [],
    leadNameOptions: [],
    leadNameSelectedOption: {},
    worthValueOfDeal: "",
    // customTextboxfieldData: {},
    customeDropdownFieldData: {
      // Dropdown: { value: "Facebook", label: "Facebook" },
    },
  });

  const [dealsCustomFields, setDealsCustomFields] = useState([]);
  const [newCustomFieldValues, setNewCustomFieldValues] = useState({
    customTextboxfieldData: {},
    customeDropdownFieldData: {
      // Dropdown: { value: "Facebook", label: "Facebook" },
    },
  });

  const allFieldsValue = useSelector(
    (state) => state.commandCenter.allFieldsValue
  );
  const allAccounts = useSelector((state) => state.account.allAccounts);
  const activeLeads = useSelector((state) => state.leads.activeLeads);
  const singleDealData = useSelector((state) => state.deals.singleDealData);

  useEffect(() => {
    console.log(allFieldsValue);
    if (!isEmpty(allFieldsValue)) {
      let textDataFinalObject = {};
      let dropdownDataFinalObject = {};
      allFieldsValue.forEach((ele) => {
        if (ele.fieldData.type === "TEXTBOX") {
          ele.fieldData.name = ele.fieldData.name.split(" ").join("");
          textDataFinalObject[ele.fieldData.name] = ele.value;
        } else {
          ele.fieldData.name = ele.fieldData.name.split(" ").join("");
          dropdownDataFinalObject[ele.fieldData.name] = {
            value: ele.value,
            label: ele.value,
          };
        }
      });
      // console.log(dropdownDataFinalObject);

      // setValues({
      //   ...values,
      //   // dealsCustomFields: allFieldsValue,
      //   // customTextboxfieldData: textDataFinalObject,
      //   customeDropdownFieldData: dropdownDataFinalObject,
      // });
      setDealsCustomFields(allFieldsValue);
      setNewCustomFieldValues({
        ...newCustomFieldValues,
        customTextboxfieldData: textDataFinalObject,
        customeDropdownFieldData: dropdownDataFinalObject,
      });
    }

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (
      !isEmpty(allAccounts) &&
      !isEmpty(activeLeads) &&
      !isEmpty(singleDealData)
    ) {
      let newArray =
        !isEmpty(allAccounts) &&
        allAccounts.map((account) => ({
          value: account._id,
          label: account.accountname,
        }));

      let leadsNewArray =
        !isEmpty(activeLeads) &&
        activeLeads.map((lead) => ({
          value: lead._id,
          label: lead.name,
        }));

      let selectedAccount =
        !isEmpty(allAccounts) &&
        allAccounts.filter(
          (account) => account._id === singleDealData.account._id
        );

      let selectedLead = {};
      selectedLead =
        !isEmpty(activeLeads) &&
        singleDealData.lead !== undefined &&
        activeLeads.filter((lead) => lead._id === singleDealData.lead._id);

      setValues({
        ...values,
        singleDealData: singleDealData,
        allAccounts: allAccounts,
        dealsName: singleDealData.dealname,
        worthValueOfDeal: singleDealData.value,
        dealsAccountNameOptions: newArray,
        dealsAccountNameSelectedOption: {
          value: !isEmpty(selectedAccount) ? selectedAccount[0]._id : "",
          label: !isEmpty(selectedAccount)
            ? selectedAccount[0].accountname
            : "",
        },
        leadNameOptions: leadsNewArray,
        leadNameSelectedOption: {
          value:
            !isEmpty(selectedLead) && selectedLead !== false
              ? selectedLead[0]._id
              : "",
          label:
            !isEmpty(selectedLead) && selectedLead !== false
              ? selectedLead[0].name
              : "",
        },
      });
    }
  }, [allAccounts, activeLeads, singleDealData]);

  /*==============================
      Form Events Handlers
  ================================*/

  const handleChange = (e) => {
    setValues({
      ...values,
      errors: {},
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  const onSelectDealsAccountName = (e) => {
    console.log(e);
    setValues({
      ...values,
      dealsAccountNameSelectedOption: e,
    });
    console.log("Selected: " + e.value);
  };

  const onSelectDealsLeadName = (e) => {
    setValues({
      ...values,
      leadNameSelectedOption: e,
    });
    console.log("Selected: " + e.value);
  };

  const toggleFunction = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
      hasActive: false,
    });
  };

  /*==================================================
            CUSTOM FIELD SECTION START
  ====================================================*/

  // CUSTOM TEXTBOX SECTION

  const handleChangeCustomTextBox = (name) => (e) => {
    let prevFieldData = newCustomFieldValues.customTextboxfieldData;
    prevFieldData[name] = e.target.value;
    // setValues({
    //   ...values,
    //   customTextboxfieldData: prevFieldData,
    // });
    setNewCustomFieldValues({
      ...newCustomFieldValues,
      customTextboxfieldData: prevFieldData,
    });
  };

  const renderCustomTextbox = (fieldData) => {
    // console.log(fieldData);
    let name = fieldData.fieldData.name.split(" ").join("");
    return (
      <div className="leads-new-circle-block">
        <img
          src={require("../../../../src/assets/img/accounts/acc-circle-name.svg")}
          alt=""
          className="leads-new-circle-block__circle"
        />
        <AddLeadsFormField
          htmlFor={`${fieldData.fieldData.name}`}
          type={"text"}
          labelName={`${fieldData.fieldData.name}`}
          id={`${fieldData.fieldData.name}`}
          name={`${fieldData.fieldData.name}`}
          placeholder={"Eg. India"}
          onChange={handleChangeCustomTextBox(name)}
          value={newCustomFieldValues.customTextboxfieldData[name]}
          maxLength={maxLengths.char200}
        />
      </div>
    );
  };

  // CUSTOM DROPDOWN SECTION

  const onCustomDropdownChange = (name) => (e) => {
    let prevFieldData = values.customeDropdownFieldData;
    prevFieldData[name] = { value: e.value, label: e.value };
    // setValues({
    //   ...values,
    //   customeDropdownFieldData: prevFieldData,
    // });
    setNewCustomFieldValues({
      ...newCustomFieldValues,

      customeDropdownFieldData: prevFieldData,
    });
    // console.log("Selected: " + e.value, name);
  };

  const renderCustomDropdown = (fieldData) => {
    // console.log(fieldData);
    let name = fieldData.fieldData.name.split(" ").join("");
    let dropdownOption = [];
    fieldData.fieldData.options.forEach((element) => {
      let obj = { value: element, label: element };
      dropdownOption.push(obj);
    });
    return (
      <div className="mb-30">
        <label
          htmlFor="leadsSource"
          className="add-lead-label font-24-semibold"
        >
          {fieldData.fieldData.name}
        </label>
        <div className="add-lead-input-field border-0">
          <Select
            className="react-select-add-lead-form-container"
            classNamePrefix="react-select-add-lead-form"
            isSearchable={false}
            options={dropdownOption}
            value={newCustomFieldValues.customeDropdownFieldData[name]}
            onChange={onCustomDropdownChange(name)}
            placeholder="Select"
          />
        </div>
      </div>
    );
  };

  /*==================================================
            CUSTOM FIELD SECTION END
  ====================================================*/

  /*============================
    render form
  =============================*/
  const renderForm = () => {
    // const { dealsCustomFields } = values;
    // const { errors } = this.props;
    // console.log(errors);
    return (
      <div className="leads-new-details-profile-form pt-0">
        <div className="add-lead-form-field-block new-edit-lead-form-row__emp-block pl-0 mt-20">
          {/* name */}
          <div className="leads-new-circle-block">
            <img
              src={require("../../../../src/assets/img/accounts/acc-circle-name.svg")}
              alt=""
              className="leads-new-circle-block__circle"
            />
            <AddEmployeesFormFields
              type="text"
              htmlFor={"dealsName"}
              labelName={"Deal name"}
              id={"dealsName"}
              name={"dealsName"}
              placeholder={"Eg. name"}
              onChange={handleChange}
              value={values.dealsName}
              maxLength={maxLengths.char30}
              error={errors.dealsName}
            />
          </div>

          <div className="add-new-deal-account-name-block-displayForm">
            <h3 className="add-lead-label font-24-semibold">
              <img
                src={require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-account.svg")}
                alt=""
              />
              Select Account
            </h3>
            <div className="col-6 pr-0 ml-30">
              <Select
                className="react-select-container mb-20"
                classNamePrefix="react-select-elements"
                value={values.dealsAccountNameSelectedOption}
                onChange={onSelectDealsAccountName}
                options={values.dealsAccountNameOptions}
                placeholder="Select"
                isSearchable={false}
              />
            </div>
          </div>

          <div className="add-new-deal-account-name-block-displayForm">
            <h3 className="add-lead-label font-24-semibold">
              <img
                src={require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-lead.svg")}
                alt=""
              />
              Select Lead
            </h3>
            <div className="col-6 pr-0 ml-30">
              <Select
                className="react-select-container mb-20"
                classNamePrefix="react-select-elements"
                value={values.leadNameSelectedOption}
                onChange={onSelectDealsLeadName}
                options={values.leadNameOptions}
                placeholder="Select"
                isSearchable={false}
              />
            </div>
          </div>

          <div className="mb-30">
            <label
              htmlFor="worthValueOfDeal"
              className="add-lead-label font-24-semibold"
            >
              <img
                src={require("../../../../src/assets/img/deal-pipelines/deal-circle-icon-amount.svg")}
                alt=""
              />
              Worth Amount($)
            </label>
            <div className="mb-30">
              <input
                type="text"
                pattern="[0-9]*"
                id="worthValueOfDeal"
                name="worthValueOfDeal"
                className="add-lead-input-field font-18-regular"
                placeholder="Eg. 1500"
                value={values.worthValueOfDeal}
                onChange={handleChangeNumber}
                autoFocus
                maxLength={10}
              />
              {errors.worthValueOfDeal && (
                <div className="is-invalid add-lead-form-field-errors">
                  {errors.worthValueOfDeal}
                </div>
              )}
            </div>
          </div>
          {/* CUSTOM FIELDS SETCION */}
          {!isEmpty(dealsCustomFields) ? (
            <h5 className="font-24-semibold deals-details-profile-from-display-custom-fields-title deals-details-profile-from-display-custom-fields-title--closed">
              Custom Fields
            </h5>
          ) : (
            ""
          )}
          <div className="deals-details-profile-custom-fields-div">
            {!isEmpty(dealsCustomFields) &&
              dealsCustomFields.map((data, index) => {
                if (data.fieldData.type === "TEXTBOX") {
                  return (
                    <div key={index} className="mt-5">
                      {renderCustomTextbox(data)}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="mt-5">
                      {renderCustomDropdown(data)}
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <>
        {/* main row */}
        <div className="row mx-0 flex-nowrap account-profile-display-main-row">
          {/* img colm */}
          <div className="account-profile-img-colm mt-20">
            {/* <img
                 src={require("../../../assets/img/accounts/profile.svg")}
                 alt="deal"
                 className="account-profile-img-colm__account"
               /> */}
            <DealsUpdateProfileImageModal />
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
            onClick={handleOnClickSaveButton(
              values,
              dealsCustomFields,
              newCustomFieldValues,
              values.singleDealData
            )}
          >
            Save Changes
          </button>
        </div>
      </>
    </Fragment>
  );
}

export default DealsDetailsProfileForm;
