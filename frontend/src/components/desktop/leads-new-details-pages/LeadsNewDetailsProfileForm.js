import React, { Component } from "react";
// phone flags country code
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import isEmpty from "./../../../store/validations/is-empty";
import ActivitySummaryViewProfileModalInputField from "../activity/ActivitySummaryViewProfileModalInputField";
import EditLeadSocialMediaAccount from "../leads/EditLeadSocialMediaAccount";
import AddLeadFormSelectFewTags from "../leads/AddLeadFormSelectFewTags";
import AddLeadsFormField from "../leads/AddLeadsFormField";
import LeadsNewDetailsShipping from "./LeadsNewDetailsShipping";
import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";
import AddAccount from "../accounts/AddAccount";
import { connect } from "react-redux";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { updateLeadAction } from "./../../../store/actions/leadAction";

const defaultTagsValues = [];

const selectStatusDropdownOptions = [
  { value: "New Lead", label: "New Lead" },
  { value: "Contacted Lead", label: "Contacted Lead" },
  { value: "Qualified Lead", label: "Qualified Lead" },
  { value: "On Hold Lead", label: "On Hold Lead" },
  { value: "Opportunity Lead", label: "Opportunity Lead" },
  { value: "Converted Lead", label: "Converted Lead" },
];

const leadsSourceOptions = [
  { value: "Facebook", label: "Facebook" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Instagram", label: "Instagram" },
  { value: "Others", label: "Others" },
];

const accountNameOptions = [
  { value: "lorem", label: "lorem" },
  { value: "ipsum", label: "ipsum" },
];

const selectDropdownOptions = [
  { value: "Make a Call", label: "Make a Call" },
  { value: "Email", label: "Email" },
  { value: "Meeting", label: "Meeting" },
];

export class LeadsNewDetailsProfileForm extends Component {
  constructor() {
    super();
    this.state = {
      openEditModal: false,
      // edit modal basic
      leadsName: "",
      leadsemail: "",
      countryCode: "",
      phoneNumber: "",
      company: "",
      accountOptions: [],
      selectedAccountOption: {},
      displayListSelected: [],
      leadsWorthAmount: "",
      // selectedLeadsSourceDropdownOption: leadsSourceOptions[0],
      selectedLeadsSourceDropdownOption: null,
      tagsArray: defaultTagsValues,
      tagsInputValue: [],
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
      leadData: {},
      success: false,
      hasSet: false,
      hasAccountSet: false,
      customTextboxfieldData: {},
      customeDropdownFieldData: {
        // Dropdown: { value: "Facebook", label: "Facebook" },
      },
    };
  }

  /*====================================
            Lifecycle Method
  ======================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.leadActivityData) &&
      nextProps.leadActivityData !== nextState.leadActivityData &&
      !nextState.hasSet
    ) {
      let phoneNo = nextProps.leadActivityData.phone;
      let leadCountryCode = nextProps.leadActivityData.phoneCode;
      let finalLeadPhoneNumber = phoneNo.split(leadCountryCode)[1];
      return {
        leadsName: nextProps.leadActivityData.name,
        leadsemail: nextProps.leadActivityData.email,
        company: nextProps.leadActivityData.company,
        phoneNumber: finalLeadPhoneNumber,
        countryCode: nextProps.leadActivityData.phoneCode,
        leadsWorthAmount:
          nextProps.leadActivityData.worth === null
            ? ""
            : nextProps.leadActivityData.worth,
        leadsAbout: nextProps.leadActivityData.about,
        leadMediaInstagramInput: nextProps.leadActivityData.media.instagram,
        leadMediaLinkedInInput: nextProps.leadActivityData.media.linkedIn,
        leadMediaFacebookInput: nextProps.leadActivityData.media.facebook,
        leadMediaOthersInput: nextProps.leadActivityData.media.other,
        leadsSkypeAddress: nextProps.leadActivityData.media.skype,
        tagsArray: nextProps.leadActivityData.tags,
        selectedLeadsSourceDropdownOption: isEmpty(
          nextProps.leadActivityData.source
        )
          ? null
          : {
              value: nextProps.leadActivityData.source,
              label: nextProps.leadActivityData.source,
            },
        selectedAccountOption: {
          value: nextProps.leadActivityData.accountData._id,
          label: nextProps.leadActivityData.accountData.accountname,
        },
        leadData: nextProps.leadActivityData,
        hasSet: true,
      };
    }

    return null;
  }

  componentDidMount() {
    const { allFieldsValue, allAccounts } = this.props;
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
        leadsCustomFields: allFieldsValue,
        customTextboxfieldData: textDataFinalObject,
        customeDropdownFieldData: dropdownDataFinalObject,
      });
    }

    if (!isEmpty(allAccounts)) {
      console.log(allAccounts);
      let option = [];
      allAccounts.forEach((element) => {
        console.log(element);
        option.push({ value: element._id, label: element.accountname });
      });
      this.setState({
        accountOptions: option,
      });
    }

    window.scrollTo(0, 0);
  }

  /*==========================================
        handlers
  ===========================================*/

  handleChangeCountryCode = (countryCode) => {
    console.log(countryCode);
    this.setState({
      countryCode: countryCode,
    });
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  onSourceDropdownSelect = (e) => {
    this.setState({
      selectedLeadsSourceDropdownOption: e,
      leadsSourceDropdownOption: e.value,
    });
    console.log("Selected: " + e.value);
  };

  /*===============================================
      select account
  ===============================================*/

  handleRemoveMember = (index) => (e) => {
    let newList = this.state.displayListSelected;
    newList.splice(index, 1);
    this.setState({
      selectOption: "",
      displayListSelected: newList,
    });
  };

  // start select tags handlers
  handleSelectTagsOnChange = (e) => {
    this.setState({
      tagsInputValue: [e.target.value],
    });
  };

  handleSelectTagsOnKeyPress = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
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
          // update the states
          // condition to accept only 4 tags
          // this.setState({
          //   tagsArray:
          //     [...this.state.tagsArray, ...tagsInputValue].length > 4
          //       ? [...this.state.tagsArray, ...tagsInputValue].slice(0, 4)
          //       : [...this.state.tagsArray, ...tagsInputValue],
          //   tagsInputValue: []
          // });
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
    // condition to accept only 4 tags
    // this.setState({
    //   tagsArray:
    //     [...this.state.tagsArray, e.target.innerHTML].length > 4
    //       ? [...this.state.tagsArray, e.target.innerHTML].slice(0, 4)
    //       : [...this.state.tagsArray, e.target.innerHTML]
    // });

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

  /*==========================================
          renderName
  ===========================================*/
  renderName = () => {
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
          <ActivitySummaryViewProfileModalInputField
            name="leadsName"
            value={this.state.leadsName}
            handleChange={this.handleChange}
            maxLength={maxLengths.char30}
            error={this.props.errors.leadsName}
          />
        </div>
      </>
    );
  };

  /*==========================================
          renderEmail
  ===========================================*/
  renderEmail = () => {
    return (
      <>
        {/* email */}
        <div className="leads-new-details-col-1 mb-30">
          <label
            htmlFor="leadsemail"
            className="add-lead-label font-21-regular"
          >
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-email.svg")}
              alt=""
            />
            Email Address
          </label>
          <br />
          <ActivitySummaryViewProfileModalInputField
            name="leadsemail"
            value={this.state.leadsemail}
            handleChange={this.handleChange}
            error={this.props.errors.leadsemail}
          />
        </div>
      </>
    );
  };

  /*==========================================
          renderPhoneNumberblock
  ===========================================*/
  renderPhoneNumberblock = () => {
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
        <div className="container-fluid add-lead-modal-container d-flex pb-10">
          <div className="add-lead-input-field--countryCode ml-0">
            <div className="countryCode-fixed-plus-input-container phone-form-control-block__lead-profile">
              <PhoneInput
                country={"us"}
                value={this.state.countryCode}
                onChange={(leadsPhoneCountryNumber) =>
                  this.handleChangeCountryCode(leadsPhoneCountryNumber)
                }
              />
            </div>
            {this.props.errors.leadsPhoneCountryNumber && (
              <div className="is-invalid">
                {this.props.errors.leadsPhoneCountryNumber}
              </div>
            )}
          </div>

          <div className="add-lead-input-field--phoneNumber">
            <div>
              <input
                type="text"
                pattern="[0-9]*"
                id="phoneNumber"
                name="phoneNumber"
                className="add-lead-input-field font-18-regular ml-0 w-100"
                placeholder=""
                value={this.state.phoneNumber}
                onChange={this.handleChange}
                maxLength="10"
              />
            </div>
            {this.props.errors.phoneNumber && (
              <div className="is-invalid">{this.props.errors.phoneNumber}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /*==========================================
          renderWorthAmount
  ===========================================*/
  renderWorthAmount = () => {
    return (
      <>
        {/* worth amount */}
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
          <div>
            <input
              type="text"
              pattern="[0-9]*"
              id="leadsWorthAmount"
              name="leadsWorthAmount"
              className="add-lead-input-field font-18-regular"
              placeholder="Eg. 300000"
              value={this.state.leadsWorthAmount}
              onChange={this.handleChangeNumber}
              autoFocus
              maxLength={10}
            />
            {this.props.errors.leadsWorthAmount && (
              <div className="is-invalid add-lead-form-field-errors">
                {this.props.errors.leadsWorthAmount}
              </div>
            )}
          </div>
        </div>
      </>
    );
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
      <div className="col-8 px-0">
        <AddLeadsFormField
          checkboxClass={"leads-new-details-profile-form-custom-input"}
          htmlFor={`${fieldData.fieldData.name}`}
          type={"text"}
          labelName={`${fieldData.fieldData.name}`}
          id={`${fieldData.fieldData.name}`}
          name={`${fieldData.fieldData.name}`}
          placeholder={"Eg. India"}
          onChange={this.handleChangeCustomTextBox(name)}
          value={this.state.customTextboxfieldData[name]}
          maxLength={maxLengths.char200}
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

  /*==========================================
          renderAddMoreInfoModel
  ===========================================*/
  renderAddMoreInfoModel = () => {
    const { leadsCustomFields } = this.state;
    // console.log(leadsCustomFields);
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
        <textarea
          rows="6"
          id="leadsAbout"
          name="leadsAbout"
          className="add-lead-input-field font-18-regular"
          placeholder=""
          value={this.state.leadsAbout}
          onChange={this.handleChange}
          autoFocus={true}
          maxLength={maxLengths.char200}
        />
        {this.props.errors && (
          <p className="is-invalid add-lead-form-field-errors">
            {this.props.errors.leadsAbout}
          </p>
        )}
      </div>
    );

    // Select tags

    const selectFewTags = (
      <div className="col-8 px-0">
        {!isEmpty(this.state.tagsArray) && (
          <span className="add-lead-label font-24-semibold pt-20">
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-tags.svg")}
              alt=""
            />
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

          {/* select tags by input type text field */}
          <div className="leads-new-circle-block">
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-tags.svg")}
              alt=""
              className="leads-new-circle-block__circle"
            />
            <AddLeadFormSelectFewTags
              id="tagsInputValue"
              name="tagsInputValue"
              onChange={this.handleSelectTagsOnChange}
              onClick={this.handleSelectFewTagsOnClick}
              onKeyDown={this.handleSelectTagsOnKeyPress}
              value={this.state.tagsInputValue}
              maxLength={maxLengths.char20}
            />
          </div>
        </div>
      </div>
    );

    // Add Location

    const leadAddLocation = (
      <div className="leads-new-details-col-1 leads-new-circle-block">
        <img
          src={require("../../../../src/assets/img/leads-new/profile/circle-location.svg")}
          alt=""
          className="leads-new-circle-block__circle"
        />
        <AddLeadsFormField
          htmlFor={"location"}
          type={"text"}
          labelName={`Location`}
          id={"location"}
          name={"location"}
          placeholder={"Eg. India"}
          onChange={this.handleChange}
          value={this.state.location}
        />
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
        <div className="add-lead-input-field border-0">
          <Select
            className="react-select-add-lead-form-container"
            classNamePrefix="react-select-add-lead-form"
            isSearchable={false}
            options={leadsSourceOptions}
            value={this.state.selectedLeadsSourceDropdownOption}
            onChange={(e) => this.onSourceDropdownSelect(e)}
            placeholder="Select"
          />
        </div>
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
            {/* instagram */}
            <div className="col-5 mb-30">
              <EditLeadSocialMediaAccount
                img={require("../../../assets/img/icons/Dominate-Icon_instagram.png")}
                name="leadMediaInstagramInput"
                placeholder="https://www.instagram.com/"
                onChange={this.handleChange}
                value={this.state.leadMediaInstagramInput}
                error={this.props.errors.leadMediaInstagramInput}
                maxLength={maxLengths.char200}
              />
            </div>
            {/* linkedIn */}
            <div className="col-5 mb-30">
              <EditLeadSocialMediaAccount
                img={require("../../../assets/img/icons/Dominate-Icon_linkedin.svg")}
                name="leadMediaLinkedInInput"
                placeholder="https://www.linkedIn.com/"
                onChange={this.handleChange}
                value={this.state.leadMediaLinkedInInput}
                error={this.props.errors.leadMediaLinkedInInput}
                maxLength={maxLengths.char200}
              />
            </div>
            {/* other */}
            <div className="col-5 mb-30">
              <EditLeadSocialMediaAccount
                img={require("../../../assets/img/icons/Dominate-Icon_others.svg")}
                name="leadMediaOthersInput"
                placeholder="any other url"
                onChange={this.handleChange}
                value={this.state.leadMediaOthersInput}
                error={this.props.errors.leadMediaOthersInput}
                maxLength={maxLengths.char200}
              />
            </div>
            {/* facebook */}
            <div className="col-5 mb-30">
              <EditLeadSocialMediaAccount
                img={require("../../../assets/img/icons/Dominate-Icon_facebook.png")}
                name="leadMediaFacebookInput"
                placeholder="https://www.facebook.com/"
                onChange={this.handleChange}
                value={this.state.leadMediaFacebookInput}
                error={this.props.errors.leadMediaFacebookInput}
                maxLength={maxLengths.char200}
              />
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
          <EditLeadSocialMediaAccount
            img={require("../../../assets/img/icons/icon-skype.svg")}
            name="leadsSkypeAddress"
            placeholder=""
            onChange={this.handleChange}
            value={this.state.leadsSkypeAddress}
            error={this.props.errors.leadsSkypeAddress}
            maxLength={maxLengths.char200}
          />
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

        {/* CUSTOM FIELDS SETCION */}
        {!isEmpty(leadsCustomFields) ? (
          <h5 className="font-21-medium leads-new-details-custom-fields-title">
            Custom Fields
          </h5>
        ) : (
          ""
        )}
        {!isEmpty(leadsCustomFields) &&
          leadsCustomFields.map((data, index) => {
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

        {/* <LeadsNewDetailsShipping
          state={this.state.leadsShippingState}
          city={this.state.leadsShippingCity}
          pincode={this.state.leadsShippingPinCode}
          website={this.state.leadsShippingWebsite}
          billingValue={this.state.leadsShippingBilling}
          handleChange={this.handleChange}
          handleChangeNumber={this.handleChangeNumber}
          error={this.props.errors}
        /> */}
      </>
    );
  };

  accountOptionChanges = (e) => {
    const { leadActivityData } = this.props;
    let leadAllData = leadActivityData;
    leadAllData.account_id = e.value;

    this.props.updateLeadAction(
      leadActivityData._id,
      leadAllData,
      "",
      "",
      this.props.callBackHandleSave
      // this.props.userId,
      // this.props.leadFilterName
    );
  };

  render() {
    return (
      <>
        <div className="leads-new-details-profile-form">
          {this.renderName()}
          <div className="row mx-0">
            <div className="col-6 px-0">{this.renderEmail()}</div>
            <div className="col-6 px-0">{this.renderPhoneNumberblock()}</div>
          </div>

          <div className="row mx-0">
            <div className="col-6 px-0">
              {/* Account Name */}

              <div className="leads-new-details-col-1 mb-10">
                <label
                  htmlFor="leadsSource"
                  className="add-lead-label font-24-semibold"
                >
                  <img
                    src={require("../../../../src/assets/img/leads-new/profile/circle-source.svg")}
                    alt=""
                  />
                  Account
                </label>
                <div className="add-lead-input-field border-0">
                  <Select
                    className="react-select-add-lead-form-container"
                    classNamePrefix="react-select-add-lead-form"
                    isSearchable={false}
                    options={this.state.accountOptions}
                    value={this.state.selectedAccountOption}
                    onChange={(e) => this.accountOptionChanges(e)}
                    placeholder="Select"
                  />
                </div>
              </div>
            </div>
            <div className="col-6 px-0">{this.renderWorthAmount()}</div>
          </div>

          {this.renderAddMoreInfoModel()}

          <div className="text-right leads-new-details-profile-btns-row">
            <button
              className="leads-new-details-profile-cancel-btn"
              onClick={this.props.handleOnClickCancelButton}
            >
              Cancel
            </button>
            <button
              className="leads-new-details-profile-save-btn"
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
  allAccounts: state.account.allAccounts,
  allFieldsValue: state.commandCenter.allFieldsValue,
});

export default connect(mapStateToProps, { updateLeadAction })(
  LeadsNewDetailsProfileForm
);
