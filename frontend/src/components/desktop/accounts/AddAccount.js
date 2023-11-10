import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import { validateAddAccount } from "../../../store/validations/accountsValidation/addAccountValidation";
import Select from "react-select";
import AddLeadsFormField from "./../../desktop/leads/AddLeadsFormField";
import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AccountsTextarea from "../common/AccountsTextarea";
import {
  createAccount,
  checkIfAccountExistOrNot,
} from "./../../../store/actions/accountsAction";
import { connect } from "react-redux";
import AddLeadFormSelectFewTags from "./../leads/AddLeadFormSelectFewTags";
import { Checkbox } from "@material-ui/core";

const totalFormSlides = 4;

const accountCredebilityOption = [
  { value: "Verified", label: "Verified" },
  { value: "Questionable", label: "Questionable" },
  { value: "Invalid", label: "Invalid" },
];

const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

class AddAccount extends Component {
  state = {
    open: false,
    prevNextIndex: 0,
    // account
    accountsName: "",
    accountsLocation: "",
    accountsShippingAddress: "",
    accountsBillingAddress: "",
    aboutAccount: "",
    errors: {},
    apiErrors: {},
    success: false,
    selectedCredibilityDropdownOption: accountCredebilityOption[0],
    tagsArray: [],
    tagsInputValue: [],
    // tagsInputValue: "",
    customTextboxfieldData: {},
    accountCredibilityNew: "Verified",
    customeDropdownFieldData: {
      // Dropdown: { value: "Facebook", label: "Facebook" },
    },
    checkBox: false,
    totalFormSlides: 4,
  };

  /*===============================
        Lifecycle Methods
  =================================*/

  componentDidMount() {
    // handle prev and next screen by keyboard
    document.addEventListener("keydown", this.handleMainDivKeyDown);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.apiError) &&
      nextProps.apiError !== nextState.apiErrors
    ) {
      return {
        apiErrors: nextProps.apiError,
      };
    }
    if (
      !isEmpty(nextProps.accountCustomFields) &&
      nextProps.accountCustomFields !== nextState.accountCustomFields
    ) {
      let textBoxData = nextProps.accountCustomFields.filter(
        (element) => element.type === "TEXTBOX"
      );

      let dropDownData = nextProps.accountCustomFields.filter(
        (element) => element.type === "DROPDOWN"
      );

      let textDataFinalObject = {};
      if (!isEmpty(textBoxData)) {
        textBoxData.forEach((ele) => {
          ele.name = ele.name.split(" ").join("");
          textDataFinalObject[ele.name] = "";
        });
      }

      return {
        accountCustomFields: nextProps.accountCustomFields,
        customTextboxfieldData: textDataFinalObject,
        totalFormSlides: !isEmpty(nextProps.accountCustomFields) ? 5 : 4,
        // customeDropdownFieldData: dropDownData,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.accountCustomFields !== this.state.accountCustomFields) {
      this.setState({
        accountCustomFields: this.props.accountCustomFields,
      });
    }
  }

  componentWillUnmount() {
    // handle prev and next screen by keyboard
    document.removeEventListener("keydown", this.handleMainDivKeyDown);
    store.dispatch({
      type: SET_EMPTY_ERRORS,
    });
  }

  /*===============================
      Model Open Handlers
  =================================*/

  onOpenModal = (e) => {
    e.preventDefault();
    this.setState({ open: true, hasClosedModal: false, success: false });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      prevNextIndex: 0,
      // account
      accountsName: "",
      accountsLocation: "",
      accountsShippingAddress: "",
      accountsBillingAddress: "",
      aboutAccount: "",
      errors: {},
      apiErrors: {},
      success: false,
      selectedCredibilityDropdownOption: accountCredebilityOption[0],
      tagsArray: [],
      tagsInputValue: [],
      customTextboxfieldData: {},
      accountCredibilityNew: "Verified",
      customeDropdownFieldData: {
        // Dropdown: { value: "Facebook", label: "Facebook" },
      },
      checkBox: false,
    });
  };

  /*==============================
      Form Events Handlers
  ================================*/

  callbackAccountExist = (exist) => {
    let errors = {};

    if (exist === true) {
      errors.accountsName = "Account already exist";
    } else {
      errors.accountsName = "";
    }
    this.setState({
      errors: errors,
    });
  };

  handleChange = (e) => {
    if (e.target.name === "accountsName") {
      if (!isEmpty(e.target.value)) {
        this.debounceLog(e.target.value);
      }
    }

    if (
      e.target.name === "accountsBillingAddress" &&
      this.state.checkBox === true
    ) {
      this.setState({
        accountsBillingAddress: e.target.value,
        accountsShippingAddress: e.target.value,
      });
    }
    this.setState({
      errors: {},
      apiErrors: {},
      success: false,
      hasSetErrors: false,
      [e.target.name]: e.target.value,
    });
  };

  debounceLog = debounce(
    (text) =>
      this.props.checkIfAccountExistOrNot(
        {
          query: {
            accountname: text,
          },
        },
        this.callbackAccountExist
      ),
    1000
  );

  handleSubmitOnKeyDown = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      this.handleSubmitFunctionMain();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.handleSubmitFunctionMain();
  };

  callBackAddAccount = (status) => {
    if (status === 200) {
      this.onCloseModal();
    }
  };

  handleSubmitFunctionMain = () => {
    const {
      accountCustomFields,
      customTextboxfieldData,
      customeDropdownFieldData,
    } = this.state;
    const { errors, isValid } = validateAddAccount(this.state);
    // console.log(errors);
    if (!isValid) {
      this.setState({
        errors: errors,
      });
    }
    if (isValid) {
      const formData = {
        accountname: this.state.accountsName,
        description: this.state.aboutAccount,
        primaryContactPerson: {},
        secondaryContactPerson: [],
        onBoardingDate: new Date().toISOString(),
        coverImg:
          "https://res.cloudinary.com/myrltech/image/upload/v1610605921/profile.svg",
        defaultEmail: "",
        location: this.state.accountsLocation,
        website: "",
        addresses: {
          billing_line_one: this.state.accountsBillingAddress,
          billing_line_two: "",
          billing_line_three: "",
          shipping_line_one: this.state.accountsShippingAddress,
          shipping_line_two: "",
          shipping_line_three: "",
        },
        documents: [{}],
        accountstatus: "ACTIVE",
        // credibility: this.state.selectedCredibilityDropdownOption.value,
        credibility: this.state.accountCredibilityNew,
        tags: this.state.tagsArray,
      };

      this.props.createAccount(
        formData,
        accountCustomFields,
        customTextboxfieldData,
        customeDropdownFieldData,
        this.callBackAddAccount
      );
    }
  };

  handleMainDivKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    // Shift + ArrowLeft
    if (e.ctrlKey && keyCode === 37) {
      this.handlePrev();
    }
    // Shift + ArrowRight
    if (e.ctrlKey && keyCode === 39) {
      this.handleNext();
    }
  };

  handlePrev = () => {
    this.setState({
      success: false,
      apiErrors: {},
      hasSetErrors: false,
      prevNextIndex:
        this.state.prevNextIndex > 0
          ? this.state.prevNextIndex - 1
          : this.state.prevNextIndex,
    });
  };

  // handle next on key enter
  onFormKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13 && this.state.prevNextIndex !== 1) {
      e.preventDefault();
      this.handleNext();
    }
    // for tag screen (on enter tag screen not go to next screen)
    if (this.state.prevNextIndex === 3) {
      if (e.keyCode === 13 || this.state.tagsInputValue != null) {
        this.setState({
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
        });
      }
    }
    if (keyCode === 13 && this.state.prevNextIndex === 3) {
      e.preventDefault();
    }
  };

  handleNext = () => {
    const { errors, isValid } = validateAddAccount(this.state);
    this.setState({
      success: false,
      apiErrors: {},
      hasSetErrors: false,
    });
    if (this.state.prevNextIndex === 0) {
      if (errors.accountsName) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else if (this.state.errors.accountsName) {
        this.setState({
          errors: this.state.errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (this.state.prevNextIndex === 2) {
      if (errors.aboutAccount) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    } else {
      this.setState({
        prevNextIndex:
          this.state.prevNextIndex < this.state.totalFormSlides
            ? this.state.prevNextIndex + 1
            : this.state.prevNextIndex,
        errors: {},
      });
    }
  };

  onClickAccountCreadibilitySelect = (account) => (e) => {
    e.preventDefault();
    console.log(account);
    this.setState({
      accountCredibilityNew: account,
    });
  };

  /*============================
    render form
  =============================*/

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
    let name = fieldData.name.split(" ").join("");
    return (
      <AddLeadsFormField
        checkboxClass={"add-account-custom-fileds-input"}
        htmlFor={`${fieldData.name}`}
        type={"text"}
        labelName={`${fieldData.name}`}
        id={`${fieldData.name}`}
        name={`${fieldData.name}`}
        placeholder={"Eg. India"}
        onChange={this.handleChangeCustomTextBox(name)}
        value={this.state.customTextboxfieldData[name]}
        maxLength={maxLengths.char200}
      />
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
    console.log(fieldData);
    let name = fieldData.name.split(" ").join("");
    let dropdownOption = [];
    fieldData.options.forEach((element) => {
      let obj = { value: element, label: element };
      dropdownOption.push(obj);
    });
    return (
      <div className="mb-30">
        <label
          htmlFor="leadsSource"
          className="add-lead-label font-24-semibold"
        >
          {fieldData.name}
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

  onaccountCredebilityDropdownSelect = (e) => {
    this.setState({
      selectedCredibilityDropdownOption: e,
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
      this.setState({
        //prevNextIndex: this.state.prevNextIndex - 1,
        prevNextIndex: this.state.prevNextIndex,
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

  handleChangeCheckBox = (e) => {
    this.setState({
      checkBox: e.target.checked,
    });
    if (e.target.checked === true) {
      let accountsBillingAddress = this.state.accountsBillingAddress;
      this.setState({
        accountsShippingAddress: accountsBillingAddress,
      });
    } else {
      this.setState({
        accountsShippingAddress: "",
      });
    }
  };

  renderForm = () => {
    const { open, prevNextIndex, errors, accountCustomFields } = this.state;

    // Select tags

    const selectFewTags = (
      <div>
        {!isEmpty(this.state.tagsArray) && (
          <span className="add-lead-label font-24-semibold pt-20">
            Added tags
          </span>
        )}

        <div className="leads-tags-in-input-field leads-tags-in-input-field--addLeadFormSelectTags">
          <div className="representative-recent-img-text-block leads-tags-in-input-field__block pt-0">
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
    );
    // console.log(errors);
    return (
      <Modal
        open={open}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />
        <div className="add-lead-modal-container container-fluid pr-0 lead_page_component">
          <h1 className="font-30-bold mb-61">New Account</h1>
          <AddLeadBlueProgressbar
            percentage={
              (100 / this.state.totalFormSlides) * (prevNextIndex + 0.5)
            }
            //skipButtonFrom={this.state.totalFormSlides}
            skipButtonFrom={this.state.totalFormSlides + 1}
            prevNextIndex={prevNextIndex}
          />
          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <div className="add-lead-prev-icon" onClick={this.handlePrev}>
                  <img
                    src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                    alt="previous"
                  />
                </div>
              )}

              {prevNextIndex >= this.state.totalFormSlides ? (
                ""
              ) : this.state.accountCustomFields && prevNextIndex === 4 ? (
                ""
              ) : (
                <div className="add-lead-next-icon" onClick={this.handleNext}>
                  <img
                    src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
                    alt="next"
                  />
                </div>
              )}
            </div>
            {/* form */}
            <form
              noValidate
              // onSubmit={this.handleSubmit}
              onKeyDown={this.onFormKeyDown}
            >
              {/*  name */}
              {prevNextIndex === 0 && (
                <>
                  <AddEmployeesFormFields
                    type="text"
                    htmlFor={"accountsName"}
                    labelName={"What is the account's name?"}
                    id={"accountsName"}
                    name={"accountsName"}
                    placeholder={"Eg. name"}
                    onChange={this.handleChange}
                    value={this.state.accountsName}
                    maxLength={maxLengths.char500}
                    error={errors.accountsName}
                  />
                </>
              )}

              {prevNextIndex === 1 && (
                <>
                  {/*About */}
                  <div className="mb-30">
                    <label
                      htmlFor="leadsSource"
                      className="add-lead-label font-24-semibold"
                    >
                      Account credibility
                    </label>
                    {/*<div className="add-lead-input-field border-0">
                      <Select
                        // className="react-select-add-lead-form-container"
                        classNamePrefix="react-select-add-lead-form"
                        isSearchable={false}
                        options={accountCredebilityOption}
                        value={this.state.selectedCredibilityDropdownOption}
                        onChange={(e) =>
                          this.onaccountCredebilityDropdownSelect(e)
                        }
                        placeholder="Select"
                      />
                      </div>*/}
                    <div className="set_level_and_status_of_lead set_level_and_status_of_lead--edit-account set_level_and_status_of_lead--edit-account--add">
                      <button
                        onClick={this.onClickAccountCreadibilitySelect(
                          "Verified"
                        )}
                        className={
                          this.state.accountCredibilityNew === "Verified"
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
                          this.state.accountCredibilityNew === "Questionable"
                            ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                            : "select-lead-followup-by-btn"
                        }
                      >
                        <span>Questionable</span>
                      </button>
                      <button
                        onClick={this.onClickAccountCreadibilitySelect(
                          "Invalid"
                        )}
                        className={
                          this.state.accountCredibilityNew === "Invalid"
                            ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                            : "select-lead-followup-by-btn"
                        }
                      >
                        <span>Invalid</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {prevNextIndex === 2 && (
                <>
                  {/*About */}
                  <AccountsTextarea
                    htmlFor="aboutAccount"
                    labelName="About account"
                    value={this.state.aboutAccount}
                    maxLength={maxLengths.char200}
                    onChange={this.handleChange}
                    error={errors.aboutAccount}
                  />
                </>
              )}

              {/*  name */}
              {prevNextIndex === 3 && <>{selectFewTags}</>}

              {prevNextIndex === 4 && (
                <div className="add-account-location-details">
                  <h3 className="add-account-location-details__title font-24-semibold">
                    Account name's location details
                  </h3>
                  {/* location */}
                  <AddEmployeesFormFields
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
                    checkboxClass={"add-account-custom-fileds-input"}
                  />
                  {/* billing address */}
                  <AccountsTextarea
                    htmlFor="accountsBillingAddress"
                    labelName="Billing Address"
                    value={this.state.accountsBillingAddress}
                    onChange={this.handleChange}
                    maxLength={maxLengths.char200}
                    error={errors.accountsBillingAddress}
                    checkboxClass={"add-account-custom-fileds-input"}
                  />
                  <div className="add-account-toggle toggle row mx-0 align-items-center">
                    <label className="font-18-medium">
                      Shipping Address same as Billing Address?
                    </label>
                    <div className="toggle-chk-circle">
                      <input
                        type={"checkbox"}
                        name="checkBox"
                        // className={`${toggleinputclass}`}
                        value={this.state.checkBox}
                        onChange={this.handleChangeCheckBox}
                        defaultChecked={this.state.checkBox}
                        id="add-account-toggle"
                      />
                      <span className="toggle__switch toggle__switch--add-account"></span>
                    </div>
                  </div>
                  {/* shipping address */}
                  <AccountsTextarea
                    htmlFor="accountsShippingAddress"
                    labelName="Shipping Address"
                    value={this.state.accountsShippingAddress}
                    onChange={this.handleChange}
                    maxLength={maxLengths.char200}
                    error={errors.accountsShippingAddress}
                    checkboxClass={"add-account-custom-fileds-input"}
                  />
                  {/*<Checkbox
                    checked={this.state.checkBox}
                    onChange={this.handleChangeCheckBox}
                  />
                  Same as billing address*/}
                </div>
              )}

              {prevNextIndex === 5 && (
                <>
                  <h1 className="font-24-semibold add-lead-label mb-61">
                    Custom Fields
                  </h1>
                  {/* CUSTOM FIELDS SETCION */}
                  {!isEmpty(accountCustomFields) &&
                    accountCustomFields.map((data, index) => {
                      if (data.type === "TEXTBOX") {
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
                </>
              )}
              {/** Custom filed */}
              {!isEmpty(accountCustomFields) && prevNextIndex === 4 ? (
                <div className="pt-25 text-right">
                  <button
                    className="add_more_info_lead_button"
                    onClick={this.handleNext}
                  >
                    Add more info
                  </button>
                  <button
                    // type="submit"
                    onClick={this.handleSubmit}
                    onKeyDown={this.handleSubmitOnKeyDown}
                    className="new-save-btn-blue"
                  >
                    Save
                  </button>
                </div>
              ) : (
                ""
              )}
              {prevNextIndex === this.state.totalFormSlides && (
                <div className="pt-25 text-right">
                  <button
                    // type="submit"
                    onClick={this.handleSubmit}
                    onKeyDown={this.handleSubmitOnKeyDown}
                    className="new-save-btn-blue"
                  >
                    Save
                  </button>
                </div>
              )}
            </form>

            {/*<AddLeadBlueProgressbar
              percentage={
                (100 / this.state.totalFormSlides) * (prevNextIndex + 0.5)
              }
              skipButtonFrom={this.state.totalFormSlides}
              prevNextIndex={prevNextIndex}
            />*/}
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    return (
      <Fragment>
        <button
          className="leads-title-block-btn-red-bg mr-30 ml-30"
          onClick={this.onOpenModal}
        >
          &#43; New Account
        </button>

        {this.renderForm()}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  accountCustomFields: state.commandCenter.accountCustomFields,
});

export default connect(mapStateToProps, {
  createAccount,
  checkIfAccountExistOrNot,
})(AddAccount);
