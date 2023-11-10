import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
//import { validateAddAccount } from "../../../store/validations/accountsValidation/addAccountValidation";
import { validateEditAccount } from "../../../store/validations/accountsValidation/editAccountValidation";

import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
// import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";
import AccountsTextarea from "../common/AccountsTextarea";
import { connect } from "react-redux";
import { updateAccountById } from "./../../../store/actions/accountsAction";
import ToggleSwitch from "../common/ToggleSwitch";
import Select from "react-select";
import AddLeadsFormField from "./../leads/AddLeadsFormField";
import AddLeadFormSelectFewTags from "./../leads/AddLeadFormSelectFewTags";

const dummyData = [1, 2];
class AccountEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      // account
      accountsName: "",
      selectOption: "",
      displayListSelected: [],
      options: [
        { value: "John", label: "John" },
        { value: "Anna", label: "Anna" },
        { value: "Paul", label: "Paul" },
      ],
      accountsLocation: "",
      accountsShippingAddress: "",
      accountsBillingAddress: "",
      errors: {},
      accountCredibility: "",
      accountAbout: "",
      addTagInputValue: "",
      statusType: true,
      hasSet: false,
      customTextboxfieldData: {},
      customeDropdownFieldData: {
        // Dropdown: { value: "Facebook", label: "Facebook" },
      },
      tagsArray: [],
      tagsInputValue: "",
    };
  }
  /*===============================
        Lifecycle Methods
  =================================*/

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.cardData) &&
      nextProps.cardData !== nextState.cardData &&
      !nextState.hasSet
    ) {
      // console.log(nextProps.cardData);
      return {
        accountsName: nextProps.cardData.accountname,
        accountsLocation: nextProps.cardData.location,
        accountsBillingAddress: nextProps.cardData.addresses.billing_line_one,
        accountsShippingAddress: nextProps.cardData.addresses.shipping_line_one,
        accountCredibility: nextProps.cardData.credibility,
        accountAbout: nextProps.cardData.description,
        addTagInputValue: nextProps.cardData.tags,
        statusType:
          nextProps.cardData.accountstatus === "ACTIVE" ? true : false,
        tagsArray: nextProps.cardData.tags,
        hasSet: true,
      };
    }
    return null;
  }

  componentWillUnmount() {
    store.dispatch({
      type: SET_EMPTY_ERRORS,
    });
  }

  /*===============================
      Model Open Handlers
  =================================*/

  onOpenModal = () => {
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
    this.setState({
      hasSet: false,
      open: true,
      hasClosedModal: false,
      success: false,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      errors: {},
      apiErrors: {},
      success: false,
      hasSet: false,
    });
  };

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

  handleSubmit = (e) => {
    e.preventDefault();
    this.handleSubmitFunctionMain();
  };

  callBackUpdateAccount = (status) => {
    if (status === 200) {
      this.onCloseModal();
    }
  };

  handleSubmitFunctionMain = () => {
    console.log(this.state);
    const {
      customTextboxfieldData,
      customeDropdownFieldData,
      accountCustomFields,
    } = this.state;
    const { errors, isValid } = validateEditAccount(this.state);
    // console.log(errors);
    if (!isValid) {
      this.setState({
        errors: errors,
      });
    }
    if (isValid) {
      const { cardData } = this.props;

      let formData = cardData;
      formData.accountname = this.state.accountsName;
      formData.location = this.state.accountsLocation;
      formData.addresses.billing_line_one = this.state.accountsBillingAddress;
      formData.addresses.shipping_line_one = this.state.accountsShippingAddress;
      formData.credibility = this.state.accountCredibility;
      formData.description = this.state.accountAbout;
      formData.accountstatus =
        this.state.statusType === true ? "ACTIVE" : "INACTIVE";

      formData.tags = this.state.tagsArray;

      this.props.updateAccountById(
        formData._id,
        formData,
        customTextboxfieldData,
        customeDropdownFieldData,
        accountCustomFields,
        this.callBackUpdateAccount
      );
    }
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
      <AddLeadsFormField
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
  /*============================
    render form
  =============================*/

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
    const { open, errors, accountCustomFields } = this.state;
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
          modal:
            "customModal customModal--addLead customModal--addLead--edit-account",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Edit Account</h1>

          <div className="add-lead-form-field-block pl-0">
            {/* form */}
            <form noValidate onSubmit={this.handleSubmit}>
              <div className="row mx-0 edit-account-content-row">
                <div className="col-6 px-0">
                  <AddEmployeesFormFields
                    checkboxClass="edit-account-form-row edit-account-form-row--edit-account"
                    type="text"
                    htmlFor={"accountsName"}
                    labelName={"Account's name"}
                    id={"accountsName"}
                    name={"accountsName"}
                    placeholder={"Eg. name"}
                    onChange={this.handleChange}
                    value={this.state.accountsName}
                    maxLength={maxLengths.char500}
                    error={errors.accountsName}
                  />
                  <div className="account-credibility-div">
                    <h3 className="accounts-new-credibility-title font-24-semibold">
                      Account Credibility
                    </h3>
                    <div className="set_level_and_status_of_lead set_level_and_status_of_lead--edit-account">
                      <button
                        onClick={this.onClickAccountCreadibilitySelect(
                          "Verified"
                        )}
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
                        onClick={this.onClickAccountCreadibilitySelect(
                          "Invalid"
                        )}
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
                  <AccountsTextarea
                    checkboxClass="edit-account-form-row edit-account-form-row--edit-account"
                    htmlFor="accountAbout"
                    labelName="About Account"
                    value={this.state.accountAbout}
                    onChange={this.handleChange}
                    maxLength={maxLengths.char200}
                    error={errors.accountAbout}
                  />
                  {/* shipping address */}
                  <AccountsTextarea
                    checkboxClass="edit-account-form-row edit-account-form-row--edit-account"
                    htmlFor="accountsShippingAddress"
                    labelName="Shipping Address"
                    value={this.state.accountsShippingAddress}
                    onChange={this.handleChange}
                    error={errors.accountsShippingAddress}
                    maxLength={maxLengths.char200}
                  />

                  {/* <AddMemberSelectAndDisplayList
                    selectedOptionValue={this.state.selectOption}
                    handleChangeSelectClient={this.handleChangeSelectClient}
                    options={this.state.options}
                    displayListSelected={this.state.displayListSelected}
                    handleRemoveMember={this.handleRemoveMember}
                    error={errors.displayListSelected}
                  /> */}
                </div>
                <div className="col-6 px-0">
                  <div className="add-account-location-details">
                    {/*<h3 className="add-account-location-details__title font-24-semibold">
                      Location details
                </h3>*/}
                    {/* location */}
                    <AddEmployeesFormFields
                      checkboxClass="edit-account-form-row edit-account-form-row--edit-account"
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
                    {/* Add tags */}
                    <div className="edit-account-add-tag-div--edit">
                      {/*<AddEmployeesFormFields
                        checkboxClass="edit-account-form-row edit-account-form-row--edit-account"
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
                          <div
                            className="edit-account-added-tag-name-div"
                            key={key}
                          >
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
                    {/* billing address */}
                    <AccountsTextarea
                      checkboxClass="edit-account-form-row edit-account-form-row--edit-account"
                      htmlFor="accountsBillingAddress"
                      labelName="Billing Address"
                      value={this.state.accountsBillingAddress}
                      onChange={this.handleChange}
                      maxLength={maxLengths.char200}
                      error={errors.accountsBillingAddress}
                    />
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
                        toggleinputclass={
                          "toggle__switch toggle__switch--edit-account"
                        }
                        onChange={this.toggleFunction}
                        defaultChecked={this.state.statusType}
                      />
                    </div>
                    {/* CUSTOM FIELDS SETCION */}
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
              <div className="pt-25 edit-account-save-btn-div text-right">
                <button
                  // type="submit"
                  onClick={this.handleSubmit}
                  className="new-save-btn-blue"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    // console.log(this.state.statusType);
    return (
      <Fragment>
        {/* <button
          className="accounts-card-list-btn accounts-card-list-btn--edit"
          onClick={this.onOpenModal}
        >
          Edit
        </button> */}
        {/*<button
          className="accounts-new-pinned-card-edit-button"
          onClick={this.onOpenModal}
        >
          <img
            src={require("../../../assets/img/accounts-new/edit-light-circle-icon.svg")}
            alt="edit"
          />
        </button>*/}
        {/* <button
          className={this.props.buttonClassName}
          onClick={this.onOpenModal}
        >
          {this.props.isImage ? (
            <img
              src={require("../../../assets/img/accounts-new/edit-light-circle-icon.svg")}
              alt="edit"
            />
          ) : (
            <>{this.props.title}</>
          )}
        </button> */}

        <div className="lead-new-detail-edit-button-div">
          <button
            className="lead-new-detail-edit-button"
            onClick={this.onOpenModal}
          >
            <img
              src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
              alt=""
            />
            Edit
          </button>
        </div>

        {this.renderForm()}
      </Fragment>
    );
  }
}

AccountEditModal.defaultProps = {
  buttonClassName: "rc-button-edit-account",
};

const mapStateToProps = (state) => ({
  allFieldsValue: state.commandCenter.allFieldsValue,
});

export default connect(mapStateToProps, { updateAccountById })(
  AccountEditModal
);
