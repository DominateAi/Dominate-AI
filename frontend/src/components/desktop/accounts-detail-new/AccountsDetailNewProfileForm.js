import React, { Component } from "react";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import AccountsTextarea from "../common/AccountsTextarea";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import ToggleSwitch from "../common/ToggleSwitch";
import Select from "react-select";
import AddLeadsFormField from "./../leads/AddLeadsFormField";
import AddLeadFormSelectFewTags from "./../leads/AddLeadFormSelectFewTags";

const dummyData = [1, 2];
export class AccountsDetailNewProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountsName: "",
      selectOption: "",
      displayListSelected: [],
      options: [],
      accountsLocation: "",
      accountsShippingAddress: "",
      accountsBillingAddress: "",
      accountCredibility: "Verified",
      accountAbout: "",
      addTagInputValue: "",
      statusType: true,
      customTextboxfieldData: {},
      customeDropdownFieldData: {
        // Dropdown: { value: "Facebook", label: "Facebook" },
      },
      tagsArray: [],
      tagsInputValue: "",
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.singleAccountData) &&
      nextProps.singleAccountData !== nextState.singleAccountData
    ) {
      return {
        singleAccountData: nextProps.singleAccountData,
        accountsName: nextProps.singleAccountData.accountname,
        accountsLocation: nextProps.singleAccountData.location,
        accountsShippingAddress:
          nextProps.singleAccountData.addresses.shipping_line_one,
        accountsBillingAddress:
          nextProps.singleAccountData.addresses.billing_line_one,
        accountCredibility: nextProps.singleAccountData.credibility,
        accountAbout: nextProps.singleAccountData.description,
        tagsArray: nextProps.singleAccountData.tags,
        statusType:
          nextProps.singleAccountData.accountstatus === "ACTIVE" ? true : false,
      };
    }
    return null;
  }

  /*====================================
            Lifecycle Method
  ======================================*/
  componentDidMount() {
    const { allFieldsValue } = this.props;
    if (!isEmpty(allFieldsValue)) {
      let textDataFinalObject = {};
      let dropdownDataFinalObject = {};
      allFieldsValue.forEach((ele) => {
        console.log(ele);
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

      this.setState({
        accountCustomFields: allFieldsValue,
        customTextboxfieldData: textDataFinalObject,
        customeDropdownFieldData: dropdownDataFinalObject,
      });
    }
    window.scrollTo(0, 0);
  }

  /*==============================
      Form Events Handlers
  ================================*/
  handleChange = (e) => {
    this.setState({
      errors: {},
      apiErrors: {},
      success: false,
      hasSetErrors: false,
      [e.target.name]: e.target.value,
    });
  };

  handleChangeSelectClient = (selectedOption) => {
    this.setState({
      selectOption: selectedOption,
      errors: { displayListSelected: "" },
    });

    // add option to list if it's not present in list
    let newList = this.state.displayListSelected;
    if (newList.indexOf(selectedOption) === -1) {
      newList.push(selectedOption);
      this.setState({
        displayListSelected: newList,
      });
    }
  };

  handleRemoveMember = (index) => (e) => {
    let newList = this.state.displayListSelected;
    newList.splice(index, 1);
    this.setState({
      selectOption: "",
      displayListSelected: newList,
    });
  };

  onClickAccountCreadibilitySelect = (account) => (e) => {
    e.preventDefault();
    // console.log(level);
    this.setState({
      accountCredibility: account,
    });
  };

  //handleAddTag = () => {
  //  console.log("Tag Added");
  //};

  //handleTagRemove = () => {
  //  console.log("Tag Removed");
  //};

  toggleFunction = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };

  /*==================================================
            CUSTOM FIELD SECTION START
  ====================================================*/

  // CUSTOM TEXTBOX SECTION

  handleChangeCustomTextBox = (name) => (e) => {
    let prevFieldData = this.state.customTextboxfieldData;
    prevFieldData[name] = e.target.value;
    this.setState({
      customTextboxfieldData: prevFieldData,
    });
  };

  renderCustomTextbox = (fieldData) => {
    // console.log(fieldData);
    let name = fieldData.fieldData.name.split(" ").join("");
    return (
      <div className="leads-new-circle-block">
        <img
          src={require("../../../../src/assets/img/accounts-new/form-circle-icon-4.svg")}
          alt=""
          className="leads-new-circle-block__circle"
        />
        <AddLeadsFormField
          checkboxClass={
            "edit-account-form-row edit-account-form-row--new-profile pb-16"
          }
          htmlFor={`${fieldData.fieldData.name}`}
          type={"text"}
          labelName={`${fieldData.fieldData.name}`}
          id={`${fieldData.fieldData.name}`}
          name={`${fieldData.fieldData.name}`}
          placeholder={"Eg. India"}
          onChange={this.handleChangeCustomTextBox(name)}
          value={this.state.customTextboxfieldData[name]}
        />
      </div>
    );
  };

  // CUSTOM DROPDOWN SECTION

  onCustomDropdownChange = (name) => (e) => {
    let prevFieldData = this.state.customeDropdownFieldData;
    prevFieldData[name] = { value: e.value, label: e.value };
    this.setState({
      customeDropdownFieldData: prevFieldData,
    });
    // console.log("Selected: " + e.value, name);
  };

  renderCustomDropdown = (fieldData) => {
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
            value={this.state.customeDropdownFieldData[name]}
            onChange={this.onCustomDropdownChange(name)}
            placeholder="Select"
          />
        </div>
      </div>
    );
  };

  /*==================================================
            CUSTOM FIELD SECTION END
  ====================================================*/

  /*==============================
      renderForm
  ================================*/

  // start select tags handlers
  handleSelectTagsOnChange = (e) => {
    this.setState({
      tagsInputValue: [e.target.value],
    });
  };

  handleSelectTagsOnKeyPress = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      this.setState({
        prevNextIndex: this.state.prevNextIndex - 1,
      });
      // split the str and remove the empty values
      console.log(this.state.tagsInputValue, "before trim");
      //let tagsInputValue = this.state.tagsInputValue.toString().split(",");
      let tagArray = this.state.tagsInputValue.toString().split(",");
      let tagsInputValue = tagArray.map((string) => string.trim());
      console.log(tagsInputValue, "after trim");
      let len = tagsInputValue.length;
      let i = 0;
      while (len > i) {
        while (tagsInputValue[i] === "") {
          tagsInputValue.splice(i, 1);
        }
        i++;
      }

      //array length
      let tagLength = this.state.tagsArray.length;
      console.log(tagLength);

      if (tagLength >= 5) {
        window.alert("Tags limit reached.");
      } else {
        if (tagsInputValue.length !== 0) {
          this.setState({
            tagsArray: [...this.state.tagsArray, ...tagsInputValue],
            tagsInputValue: [],
          });
        }
        // console.log(this.state.tagsArray, this.state.tagsInputValue);
      }
    }
  };

  handleSelectFewTagsOnClick = (e) => {
    //array length
    let tagLength = this.state.tagsArray.length;
    console.log(tagLength);

    if (tagLength >= 5) {
      window.alert("Tags limit reached.");
    } else {
      this.setState({
        tagsArray: [...this.state.tagsArray, e.target.innerHTML],
      });
    }
  };

  handleRemoveTag = (val) => {
    var tags = [...this.state.tagsArray];
    var i = tags.indexOf(val);
    if (i !== -1) {
      tags.splice(i, 1);
      this.setState({
        tagsArray: tags,
      });
    }
  };

  // end select tags handlers
  renderForm = () => {
    const { errors } = this.props;
    const { singleAccountData, accountCustomFields } = this.state;
    return (
      <div className="leads-new-details-profile-form pt-0">
        <div className="add-lead-form-field-block new-edit-lead-form-row__emp-block pl-0 mt-20">
          <div className="add-lead-form-field-block--height">
            {/* accounts name */}
            <div className="leads-new-circle-block">
              <img
                src={require("../../../../src/assets/img/accounts-new/form-circle-icon-1.svg")}
                alt=""
                className="leads-new-circle-block__circle"
              />
              <AddEmployeesFormFields
                checkboxClass="edit-account-form-row edit-account-form-row--new-profile pb-16"
                type="text"
                htmlFor={"accountsName"}
                labelName={"Account's name"}
                id={"accountsName"}
                name={"accountsName"}
                placeholder={"Eg. name"}
                onChange={this.handleChange}
                value={this.state.accountsName}
                maxLength={maxLengths.char30}
                error={errors.accountsName}
              />
            </div>

            {/* select leads */}

            {/* billing address */}
            <div className="leads-new-circle-block">
              <img
                src={require("../../../../src/assets/img/accounts-new/form-circle-icon-3.svg")}
                alt=""
                className="leads-new-circle-block__circle"
              />
              <AccountsTextarea
                checkboxClass="edit-account-form-row edit-account-form-row--new-profile"
                htmlFor="accountsBillingAddress"
                labelName="Billing Address"
                value={this.state.accountsBillingAddress}
                onChange={this.handleChange}
                error={errors.accountsBillingAddress}
              />
            </div>

            {/* shipping address */}
            <div className="leads-new-circle-block">
              <img
                src={require("../../../../src/assets/img/accounts-new/form-circle-icon-4.svg")}
                alt=""
                className="leads-new-circle-block__circle"
              />
              <AccountsTextarea
                checkboxClass="edit-account-form-row edit-account-form-row--new-profile"
                htmlFor="accountsShippingAddress"
                labelName="Shipping Address"
                value={this.state.accountsShippingAddress}
                onChange={this.handleChange}
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
                checkboxClass="edit-account-form-row edit-account-form-row--new-profile"
                type="text"
                htmlFor={"accountsLocation"}
                labelName={"Location"}
                id={"accountsLocation"}
                name={"accountsLocation"}
                placeholder={""}
                onChange={this.handleChange}
                value={this.state.accountsLocation}
                maxLength={maxLengths.char30}
                error={errors.accountsLocation}
              />
            </div>
            {/* Account Credibility */}
            <div className="account-credibility-div">
              <h3 className="accounts-new-credibility-title font-24-semibold">
                Account Credibility
              </h3>
              <div className="set_level_and_status_of_lead set_level_and_status_of_lead--edit-account">
                <button
                  onClick={this.onClickAccountCreadibilitySelect("Verified")}
                  className={
                    this.state.accountCredibility === "Verified"
                      ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                      : "select-lead-followup-by-btn"
                  }
                >
                  {/*<span>☀️</span>*/} <span>Verified</span>
                </button>
                <button
                  onClick={this.onClickAccountCreadibilitySelect(
                    "Questionable"
                  )}
                  className={
                    this.state.accountCredibility === "Questionable"
                      ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                      : "select-lead-followup-by-btn"
                  }
                >
                  <span>Questionable</span>
                </button>
                <button
                  onClick={this.onClickAccountCreadibilitySelect("Invalid")}
                  className={
                    this.state.accountCredibility === "Invalid"
                      ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                      : "select-lead-followup-by-btn"
                  }
                >
                  <span>Invalid</span>
                </button>
              </div>
            </div>
            {/* About Account */}
            <div className="leads-new-circle-block">
              <img
                src={require("../../../../src/assets/img/accounts-new/form-circle-icon-1.svg")}
                alt=""
                className="leads-new-circle-block__circle"
              />

              <AccountsTextarea
                checkboxClass="edit-account-form-row edit-account-form-row--new-profile edit-account-form-row--new-profile--about"
                htmlFor="accountAbout"
                labelName="About Account"
                value={this.state.accountAbout}
                onChange={this.handleChange}
                error={errors.accountAbout}
              />
            </div>
            {/* Add tags */}
            <div className="edit-account-add-tag-div">
              <div className="leads-new-circle-block">
                <img
                  src={require("../../../../src/assets/img/accounts-new/form-circle-icon-3.svg")}
                  alt=""
                  className="leads-new-circle-block__circle"
                />{" "}
                {/*<AddEmployeesFormFields
                  checkboxClass="edit-account-form-row "
                  type="text"
                  htmlFor={"addTagInputValue"}
                  labelName={"Add tags"}
                  id={"addTagInputValue"}
                  name={"add"}
                  placeholder={""}
                  onChange={this.handleChange}
                  value={this.state.addTagInputValue}
                  maxLength={maxLengths.char30}
                  //error={errors.addTagInputValue}
                />
              </div>
              <div className=" add-tag-img-div px-0">
                <img
                  src={require("../../../assets/img/accounts-new/edit-account-add-tag-icon.svg")}
                  alt="edit add tag"
                  onClick={this.handleAddTag}
                />
              </div>
            </div>
            <div className="edit-account-added-tag-div">
              <h4 className="edit-account-font-24-medium-italic">
                {" "}
                Added tags
              </h4>
              <div className="row mx-0 align-items-start edit-account-added-tag-name-outer-div">
                {dummyData.map((data, key) => (
                  <div className="edit-account-added-tag-name-div" key={key}>
                    <span>Tag1</span>
                    <button onClick={this.handleTagRemove}>
                      <i className="fa fa-close" />
                    </button>
                  </div>
                ))}
              </div>*/}
                {/* select tags by input type text field */}
                <AddLeadFormSelectFewTags
                  id="tagsInputValue"
                  name="tagsInputValue"
                  onChange={this.handleSelectTagsOnChange}
                  onClick={this.handleSelectFewTagsOnClick}
                  onKeyDown={this.handleSelectTagsOnKeyPress}
                  value={this.state.tagsInputValue}
                  maxLength={maxLengths.char20}
                />
                {!isEmpty(this.state.tagsArray) && (
                  <span className="add-lead-label font-24-semibold pt-20">
                    Added tags
                  </span>
                )}
                <div className="leads-tags-in-input-field leads-tags-in-input-field--addLeadFormSelectTags">
                  <div className="representative-recent-img-text-block leads-tags-in-input-field__block pt-0 mb-30">
                    {this.state.tagsArray.map((tag, index) => (
                      <h6
                        key={index}
                        className="font-18-regular tag-border-block leads-tags-in-input-field__tags"
                      >
                        {tag}
                        <span
                          className="font-18-regular"
                          onClick={() => this.handleRemoveTag(tag)}
                        >
                          &nbsp; &times;
                        </span>
                      </h6>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* status */}
            <div className="account-credibility-div">
              <h3 className="accounts-new-credibility-title font-24-semibold">
                Status
              </h3>
              <ToggleSwitch
                name="statusType"
                currentState={this.state.statusType}
                type={"checkbox"}
                spantext1={"Active"}
                spantext2={"Inactive"}
                toggleclass={"toggle toggle--edit-account"}
                toggleinputclass={"toggle__switch toggle__switch--edit-account"}
                onChange={this.toggleFunction}
                defaultChecked={this.state.statusType}
              />
            </div>
            {/* CUSTOM FIELDS SETCION */}
            {!isEmpty(accountCustomFields) ? (
              <h2 className="mb-25 pt-40 font-16-semibold">Custom Fields</h2>
            ) : (
              ""
            )}
            {!isEmpty(accountCustomFields) &&
              accountCustomFields.map((data, index) => {
                if (data.fieldData.type === "TEXTBOX") {
                  return (
                    <div key={index} className="mt-5">
                      {this.renderCustomTextbox(data)}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="mt-5">
                      {this.renderCustomDropdown(data)}
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    );
  };

  /*==============================
      main
  ================================*/
  render() {
    return (
      <>
        {/* main row */}
        <div className="accounts-detail-new-profile-form-div">
          <h3 className="accounts-new-details-us-title">
            <img
              src={require("../../../../src/assets/img/accounts-new/office-icon.svg")}
              alt="office"
              className="accounts-new-details-profile-calendar-icon"
            />
            About Company
          </h3>
          <div className="row mx-0 flex-nowrap account-profile-display-main-row account-details-new-form-card-block">
            {/* content colm */}
            <div className="col-12 px-0">{this.renderForm()}</div>
          </div>
          <div className="row mx-0 leads-new-details-profile-btns-row pr-0 pb-0">
            <button
              className="leads-new-details-profile-cancel-btn leads-new-details-profile-cancel-btn--account-new-profile"
              onClick={this.props.handleOnClickCancelButton}
            >
              Cancel
            </button>
            <button
              className="leads-new-details-profile-save-btn leads-new-details-profile-save-btn--account-new-profile"
              onClick={this.props.handleOnClickSaveButton(this.state)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  singleAccountData: state.account.singleAccountData,
  allFieldsValue: state.commandCenter.allFieldsValue,
});

export default connect(mapStateToProps, {})(AccountsDetailNewProfileForm);
