import React, { Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import Select from "react-select";
// import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import AddLeadsFormField from "../leads/AddLeadsFormField";
// import AddLeadFormMediaAccount from "../leads/AddLeadFormMediaAccount";
import EditLeadSocialMediaAccount from "../leads/EditLeadSocialMediaAccount";
// import AddLeadFormShippingDetails from "../leads/AddLeadFormShippingDetails";
import AddLeadFormAssignRepresentative from "../leads/AddLeadFormAssignRepresentative";
import AddLeadFormSelectFewTags from "../leads/AddLeadFormSelectFewTags";
import { validateAddLead } from "../../../store/validations/leadsValidation/addLeadValidation";
import { validateAddMeeting } from "../../../store/validations/meetingValidation/meetingValidation";
import { connect } from "react-redux";
import { statusEmpty } from "./../../../store/actions/authAction";
import { addLeadAction } from "./../../../store/actions/leadAction";
import {
  addFollowUpLead,
  addLeadMeetingsAction,
} from "../../../store/actions/calenderAction";
import {
  getAllEmployees,
  getAllEmployeesWithAdmin,
} from "./../../../store/actions/employeeAction";

//leads follow up pkgess
import DatePicker from "react-datepicker";
// import CustomEditDropdown from "../common/CustomEditDropdown";
import isEmpty from "./../../../store/validations/is-empty";
// import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS } from "./../../../store/types";

// phone flags country code
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";

const defaultTagsValues = [];

// FETCH THE LIST FROM THE BACKEND
// const list = ["Make a Call", "Email", "Meeting"];
const selectDropdownOptions = [
  { value: "Make a Call", label: "Make a Call" },
  { value: "Email", label: "Email" },
  { value: "Meeting", label: "Meeting" },
];

const selectStatusDropdownOptions = [
  { value: "New Lead", label: "New Lead" },
  { value: "Contacted Lead", label: "Contacted Lead" },
  { value: "Qualified Lead", label: "Qualified Lead" },
  { value: "On Hold Lead", label: "On Hold Lead" },
  { value: "Opportunity Lead", label: "Opportunity Lead" },
  { value: "Converted Lead", label: "Converted Lead" },
];
// const leadsSourceOptions = ["Facebook", "LinkedIn", "Instagram", "Others"];

const leadsSourceOptions = [
  { value: "Facebook", label: "Facebook" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Instagram", label: "Instagram" },
  { value: "Others", label: "Others" },
];

// started from 0
const totalFormSlides = 4;

class AddNewFormModal extends React.Component {
  state = {
    open: false,
    prevNextIndex: 0,
    options: [],
    selectOption: "",
    displayListSelected: [],
    leadsName: "",
    leadsEmail: "",
    leadsAddress: "",
    leadsWorkInCompanyName: "",
    leadsPhoneCountryNumber: "+1",
    leadsPhoneNumber: "",
    leadsWorthAmount: "",
    // selectedLeadsSourceDropdownOption: leadsSourceOptions[0],
    // leadsSourceDropdownOption: leadsSourceOptions[0].value,
    selectedLeadsSourceDropdownOption: null,
    leadsSourceDropdownOption: "",
    addMoreInfoPopup: false,
    // leadsSourceDropdownOption: null,
    leadsAbout: "",
    // leadMediaEmailCheckbox: false,
    // leadMediaEmailInput: "",
    leadMediaLinkedInCheckbox: false,
    leadMediaLinkedInInput: "",
    leadMediaFacebookCheckbox: false,
    leadMediaFacebookInput: "",
    leadMediaInstagramCheckbox: false,
    leadMediaInstagramInput: "",
    leadMediaOthersCheckbox: false,
    leadMediaOthersInput: "",
    leadsSkypeAddress: "",
    leadsShippingAddress: "",
    leadsShippingBilling: "",
    leadsShippingCheckbox: "",
    leadsShippingState: "",
    leadsShippingCity: "",
    leadsShippingPinCode: "",
    leadsShippingWebsite: "",
    leadAssignRepresentative: "",
    tagsArray: defaultTagsValues,
    tagsInputValue: [],
    selectedStatusOptionDropdown: selectStatusDropdownOptions[0],
    leadLevel: "COLD",
    leadStatus: selectStatusDropdownOptions[0].value,
    /*===========================
      Follow up form Fields
    =============================*/
    selectedOptionDropdown: selectDropdownOptions[0],
    selectedOption: selectDropdownOptions[0].value,
    // dropdown: false,
    // suggestionList: list,
    startDate: new Date(),
    startTime: new Date(),
    followUpLocation: "",
    addFollowUpForm: false,
    errors: {},
    allEmployees: [],
    leadAssignRepresentativeId: [],
    success: false,
    activeEmployee: [],
    currentFollowUp: [],
    followUpSucess: false,
    validationError: {},
  };

  /*===============================
        Lifecycle Methods
  ================================*/
  /*===============================
    Lead Follow Up Popup dropdown
  ================================*/
  componentDidMount() {
    // this.props.getAllEmployeesWithAdmin();
    // this.props.getAllEmployees();
    document.addEventListener("click", this.onDropdownClick);
    document.addEventListener("keypress", this.onDropdownKeyPress);
    // handle prev and next screen by keyboard
    document.addEventListener("keydown", this.handleMainDivKeyDown);
    this.setState({
      prevNextIndex: 0,
    });
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.validationError) &&
      nextProps.validationError !== nextState.validationError
    ) {
      return {
        validationError: nextProps.validationError,
      };
    }
    if (
      !isEmpty(nextProps.followUpData) &&
      nextProps.followUpData !== nextState.currentFollowUp
    ) {
      return {
        currentFollowUp: nextProps.followUpData,
      };
    }

    if (
      !isEmpty(nextProps.allEmployees) &&
      nextProps.allEmployees !== nextState.allEmployees
    ) {
      let filterEmp = nextProps.allEmployees.filter(function (allEmployees) {
        return allEmployees.status === "ACTIVE";
      });
      return {
        allEmployees: filterEmp,
      };
    }

    if (!isEmpty(nextProps.allAccounts)) {
      console.log(nextProps.allAccounts);
    }

    return null;
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onDropdownClick);
    document.removeEventListener("keypress", this.onDropdownKeyPress);
    // handle prev and next screen by keyboard
    document.removeEventListener("keydown", this.handleMainDivKeyDown);
    store.dispatch({
      type: SET_EMPTY_ERRORS,
    });
  }

  componentDidUpdate() {
    if (
      this.props.apiStatus &&
      this.state.success &&
      !this.state.hasClosedModal
    ) {
      // this.onCloseModal();
      this.setState({
        addFollowUpForm: true,
        open: true,
        addMoreInfoPopup: false,
      });
      this.setState({ hasClosedModal: true });
      this.props.statusEmpty();
    }

    if (
      this.props.apiStatus &&
      this.state.followUpSucess &&
      !this.state.hasFollowUpClosed
    ) {
      this.onCloseModal();
      this.setState({
        open: false,
        addFollowUpForm: false,
        hasFollowUpClosed: true,
      });
    }

    if (
      !isEmpty(this.state.validationError) &&
      this.state.validationError.statusCode === 400 &&
      !this.state.hasSetErrors &&
      isEmpty(this.state.errors)
    ) {
      const errors = {
        leadsEmail:
          !isEmpty(this.props.validationError) &&
          this.props.validationError.message,
        // employeesEmailId: this.state.apiErrors.message
      };
      this.setState({
        prevNextIndex: 1,
        errors: errors,
        hasSetErrors: true,
      });
      console.log(errors);
    }
  }

  onSelectDropdownSelect = (e) => {
    this.setState({
      selectedOption: e.value,
      selectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  updateinitialStatusDropDownOption = (index) => {
    console.log(index);
    this.setState({
      selectedStatusOptionDropdown: selectStatusDropdownOptions[index],
      leadStatus: selectStatusDropdownOptions[index].value,
    });
  };

  onSelectStatusDropdownSelect = (e) => {
    this.setState({
      selectedStatusOptionDropdown: e,
      leadStatus: e.value,
    });
  };

  /*===============================
    Lead Follow Up Popup Actions
  ================================*/

  handleChangeTime = (time) => {
    if (time === null) {
      this.setState({
        startTime: new Date(),
      });
    } else {
      this.setState({
        startTime: time,
      });
    }
  };

  handleChangeDate = (date) => {
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      this.setState({
        startDate: date,
      });
    }
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  callBackAddFollowUp = (status) => {
    if (status === 200) {
      this.onCloseModal();
      this.setState({
        open: false,
        addFollowUpForm: false,
        hasFollowUpClosed: true,
      });
    }
  };

  handleSaveFollowUp = (e) => {
    e.preventDefault();
    const { currentFollowUp } = this.state;
    if (this.state.selectedOption === "Meeting") {
      const { errors, isValid } = validateAddMeeting(this.state);
      if (errors.followUpLocation) {
        this.setState({
          errors,
        });
      }
      const newMeeting = {
        subject: this.state.selectedOption,
        meetingDate: this.state.startDate,
        meetingTime: this.state.startTime,
        location: this.state.followUpLocation,
        assigned: currentFollowUp._id,
        assignedPipelead: currentFollowUp._id,
      };
      // console.log(errors);
      if (isValid) {
        this.props.addLeadMeetingsAction(newMeeting);
      }
    } else {
      const newFollowUp = {
        name: this.state.selectedOption,
        entityType: "LEAD",
        entityId: currentFollowUp._id,
        followupAtDate: this.state.startDate,
        followupAtTime: this.state.startTime,
        assigned: currentFollowUp._id,
        assignedPipelead: currentFollowUp._id,
        notification: true,
        status: "NEW",
      };

      this.props.addFollowUpLead(newFollowUp, this.callBackAddFollowUp);
    }
    this.setState({
      followUpSucess: true,
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

  onOpenModal = () => {
    const { allEmployees } = this.state;
    const { allAccounts } = this.props;

    this.updateinitialStatusDropDownOption(
      this.props.initialStatusDropDownOption
    );

    let defaultAssign = allEmployees.filter(function (allEmployees) {
      return allEmployees.role.name === "Administrator";
    });

    if (!isEmpty(allAccounts)) {
      console.log(allAccounts);
      let newArray =
        !isEmpty(allAccounts) &&
        allAccounts.map((account) => ({
          value: account._id,
          label: account.accountname,
        }));
      this.setState({
        options: newArray,
      });
    }
    // console.log(defaultAssign);

    this.props.statusEmpty();
    this.setState({
      open: true,
      leadAssignRepresentativeId: defaultAssign[0]._id,
      leadAssignRepresentative: defaultAssign[0].name,
      hasClosedModal: false,
      success: false,
      followUpSucess: false,
      hasFollowUpClosed: false,
    });
  };

  onCloseModal = () => {
    this.setState({
      addMoreInfoPopup: false,
      open: false,
      options: [
        { value: "John", label: "John" },
        { value: "Anna", label: "Anna" },
        { value: "Paul", label: "Paul" },
      ],
      selectOption: "",
      displayListSelected: [],
      leadsName: "",
      leadsEmail: "",
      leadsAddress: "",
      leadsWorkInCompanyName: "",
      leadsPhoneCountryNumber: "+1",
      leadsPhoneNumber: "",
      leadsWorthAmount: "",
      // selectedLeadsSourceDropdownOption: leadsSourceOptions[0],
      // leadsSourceDropdownOption: leadsSourceOptions[0].value,
      selectedLeadsSourceDropdownOption: null,
      leadsSourceDropdownOption: "",
      leadsAbout: "",
      // leadMediaEmailCheckbox: false,
      // leadMediaEmailInput: "",
      leadMediaLinkedInCheckbox: false,
      leadMediaLinkedInInput: "",
      leadMediaFacebookCheckbox: false,
      leadMediaFacebookInput: "",
      leadMediaInstagramCheckbox: false,
      leadMediaInstagramInput: "",
      leadMediaOthersCheckbox: false,
      leadMediaOthersInput: "",
      leadsSkypeAddress: "",
      leadsShippingAddress: "",
      leadsShippingBilling: "",
      leadsShippingCheckbox: "",
      leadsShippingState: "",
      leadsShippingCity: "",
      leadsShippingPinCode: "",
      leadsShippingWebsite: "",
      leadAssignRepresentative: "",
      tagsArray: defaultTagsValues,
      tagsInputValue: [],
      leadAssignRepresentativeId: "",
      activeEmployee: [],
      selectedStatusOptionDropdown: selectStatusDropdownOptions[0],
      leadLevel: "COLD",
      leadStatus: selectStatusDropdownOptions[0].value,
      /*===========================
        Follow up form Fields
      =============================*/
      selectedOptionDropdown: selectDropdownOptions[0],
      selectedOption: selectDropdownOptions[0].value,
      // dropdown: false,
      // suggestionList: list,
      startDate: new Date(),
      startTime: new Date(),
      followUpLocation: "",
      addFollowUpForm: false,
      errors: {},
    });
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  handleChange = (e) => {
    if ([e.target.name].toString() === "leadsShippingPinCode") {
      this.setState({
        [e.target.name]: e.target.validity.valid ? e.target.value : "",
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  /*===============================================
      select account
  ===============================================*/

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

  /*===============================================
      select account end
  ===============================================*/

  handleSaveAboutLead = () => {
    // alert(this.state.leadsAbout);
  };

  handleCheckboxChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    this.setState({
      [e.target.id]: value,
    });

    if (e.target.id === "leadsShippingCheckbox" && e.target.checked === true) {
      this.setState({
        leadsShippingBilling: this.state.leadsShippingAddress,
      });
    } else {
      this.setState({
        leadsShippingBilling: "",
      });
    }

    // console.log("Checkbox checked:", e.target.checked, e.target.id, value);
  };

  handleRepresentativeOnClick = (employee) => (e) => {
    // console.log(employee);
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      leadAssignRepresentative: employee.name,
      leadAssignRepresentativeId: employee._id,
      activeEmployee: employee._id,
    });
  };

  callBackAddLead = (status) => {
    if (status === 200) {
      this.setState({
        addFollowUpForm: true,
        open: true,
        addMoreInfoPopup: false,
      });
    }
  };

  handleSubmitOnKeyDown = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      this.handleSubmitFunctionMain();
    }
  };

  handleSubmit = (label) => (e) => {
    e.preventDefault();
    if (label === "addMoreFields") {
      this.setState({
        addMoreInfoPopup: true,
        open: false,
      });
    } else {
      this.handleSubmitFunctionMain();
    }
  };

  handleSubmitFunctionMain = () => {
    const { errors, isValid } = validateAddLead(this.state);
    // console.log(this.state);
    if (!isValid) {
      this.setState({
        errors,
      });
    }

    if (isValid) {
      const { leadsPhoneCountryNumber } = this.state;
      let newleadsPhoneCountryNumber = [];
      if (leadsPhoneCountryNumber.slice(0, 1) === "+") {
        newleadsPhoneCountryNumber = leadsPhoneCountryNumber.split("+");
        newleadsPhoneCountryNumber = newleadsPhoneCountryNumber[1];
        // console.log(newleadsPhoneCountryNumber);
      } else {
        newleadsPhoneCountryNumber = leadsPhoneCountryNumber;
        // console.log(newleadsPhoneCountryNumber);
      }

      let leadStatus = this.state.leadStatus;
      if (leadStatus === "New Lead") {
        leadStatus = "NEW_LEAD";
      } else if (leadStatus === "Contacted Lead") {
        leadStatus = "CONTACTED_LEADS";
      } else if (leadStatus === "Qualified Lead") {
        leadStatus = "QUALIFIED_LEADS";
      } else if (leadStatus === "On Hold Lead") {
        leadStatus = "ON_HOLD";
      } else if (leadStatus === "Opportunity Lead") {
        leadStatus = "OPPORTUNITIES";
      } else if (leadStatus === "Converted Lead") {
        leadStatus = "CONVERTED";
      }

      this.props.addLeadAction(
        {
          name: this.state.leadsName,
          company: this.state.leadsWorkInCompanyName,
          email: this.state.leadsEmail,
          phone: "+" + newleadsPhoneCountryNumber + this.state.leadsPhoneNumber,
          account_id: this.state.selectOption.value,
          entityType: "ACCOUNT",
          entityId: this.state.selectOption.value,
          status: leadStatus,
          tags: this.state.tagsArray,
          assigned: this.state.leadAssignRepresentativeId,
          additionalInfo: "{'sdsd':'sdsd'}",
          profileImage: "https://xyz.com",
          about: this.state.leadsAbout,
          degree: this.state.leadLevel,
          media: {
            facebook: this.state.leadMediaFacebookInput,

            linkedIn: this.state.leadMediaLinkedInInput,

            instagram: this.state.leadMediaInstagramInput,

            other: this.state.leadMediaOthersInput,
          },
          worth: this.state.leadsWorthAmount,
          source: this.state.leadsSourceDropdownOption,
          isKanban: false,
          isHidden: false,
        },
        this.props.leadFilterName,
        this.props.userId,
        "",
        "",
        "",
        this.callBackAddLead
      );
    }
  };

  /*===================================
     leads source dropdown
  ====================================*/

  onSourceDropdownSelect = (e) => {
    this.setState({
      selectedLeadsSourceDropdownOption: e,
      leadsSourceDropdownOption: e.value,
    });
    console.log("Selected: " + e.value);
  };

  handleMainDivKeyDown = (e) => {
    e.stopPropagation();
    // let keyCode = e.keyCode || e.which;
    // for react-select dropdown preventDefault on enter
  };

  // handle next on key enter
  onFormKeyDown = (e) => {
    e.stopPropagation();
    // let keyCode = e.keyCode || e.which;
  };

  /*=================================
    Level select On click Handler
  ==================================*/
  onClickLevelButton = (level) => (e) => {
    e.preventDefault();
    // console.log(level);
    this.setState({
      leadLevel: level,
    });
  };

  /*=================================
      Render Add More Info Lead
  ===================================*/

  prevToAddMoreButton = () => {
    this.setState({
      addMoreInfoPopup: false,
      open: true,
      prevNextIndex: totalFormSlides,
    });
  };

  renderAddMoreInfoModel = () => {
    const { addMoreInfoPopup, errors } = this.state;

    // about field
    const aboutInputField = (
      <div className="mb-30">
        <label htmlFor="leadsAbout" className="add-lead-label font-24-semibold">
          About {this.state.leadsName}
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
        />
        {errors && (
          <p className="is-invalid add-lead-form-field-errors pl-0 ml-0">
            {errors.leadsAbout}
          </p>
        )}
      </div>
    );

    // Select tags

    const selectFewTags = (
      <div>
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

    // lead add company
    // const addLeadCompany = (
    //   <AddLeadsFormField
    //     htmlFor={"leadsWorkInCompanyName"}
    //     type={"text"}
    //     labelName={`Account`}
    //     id={"leadsWorkInCompanyName"}
    //     name={"leadsWorkInCompanyName"}
    //     placeholder={"Eg. Marvel Studios"}
    //     onChange={this.handleChange}
    //     value={this.state.leadsWorkInCompanyName}
    //   />
    // );

    // Add Location

    // const leadAddLocation = (
    //   <AddLeadsFormField
    //     htmlFor={"leadsAddress"}
    //     type={"text"}
    //     labelName={`Location`}
    //     id={"leadsAddress"}
    //     name={"leadsAddress"}
    //     placeholder={"Eg. India"}
    //     onChange={this.handleChange}
    //     value={this.state.leadsAddress}
    //   />
    // );

    // Lead Source dropdown

    const leadSourceDropdown = (
      <div className="mb-30">
        <label
          htmlFor="leadsSource"
          className="add-lead-label font-24-semibold"
        >
          {this.state.leadsName} source
        </label>
        <div className="add-lead-input-field border-0">
          {/* <Dropdown
            className="lead-status-dropDown lead-status-dropDown--importExport lead-status-dropDown--importExport--all-lead"
            options={leadsSourceOptions}
            value={this.state.leadsSourceDropdownOption}
            onChange={this.onSourceDropdownSelect}
          /> */}

          {/* {console.log(leadsSourceOptions)} */}
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
        <div className="row mx-0 mb-30">
          <label
            htmlFor="leadMediaEmailCheckbox"
            className="add-lead-label font-24-semibold mt-20"
          >
            Add other media accounts
          </label>
          {/* linkedIn */}
          <EditLeadSocialMediaAccount
            img={require("../../../assets/img/icons/Dominate-Icon_linkedin.svg")}
            name="leadMediaLinkedInInput"
            placeholder="https://www.linkedIn.com/"
            onChange={this.handleChange}
            value={this.state.leadMediaLinkedInInput}
            error={errors.leadMediaLinkedInInput}
          />

          {/* facebook */}
          <EditLeadSocialMediaAccount
            img={require("../../../assets/img/icons/Dominate-Icon_facebook.png")}
            name="leadMediaFacebookInput"
            placeholder="https://www.facebook.com/"
            onChange={this.handleChange}
            value={this.state.leadMediaFacebookInput}
            error={errors.leadMediaFacebookInput}
          />
          {/* instagram */}
          <EditLeadSocialMediaAccount
            img={require("../../../assets/img/icons/Dominate-Icon_instagram.png")}
            name="leadMediaInstagramInput"
            placeholder="https://www.instagram.com/"
            onChange={this.handleChange}
            value={this.state.leadMediaInstagramInput}
            error={errors.leadMediaInstagramInput}
          />

          {/* other */}
          <EditLeadSocialMediaAccount
            img={require("../../../assets/img/icons/Dominate-Icon_others.svg")}
            name="leadMediaOthersInput"
            placeholder="any other url"
            onChange={this.handleChange}
            value={this.state.leadMediaOthersInput}
            error={errors.leadMediaOthersInput}
          />
        </div>
      </>
    );

    // skype address
    const leadAddSkypeAddress = (
      <div>
        <label
          htmlFor="leadMediaEmailCheckbox"
          className="add-lead-label font-24-semibold mt-20 mb-0"
        >
          Skype address
        </label>
        <div className="all-checkbox-block ml-0">
          <EditLeadSocialMediaAccount
            img={require("../../../assets/img/icons/icon-skype.svg")}
            name="leadsSkypeAddress"
            placeholder=""
            onChange={this.handleChange}
            value={this.state.leadsSkypeAddress}
            error={errors.leadsSkypeAddress}
          />
        </div>
      </div>
    );

    return (
      <Modal
        open={addMoreInfoPopup}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customModal lead_add_more_info_model",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />

        {/* logo */}
        <>
          {/*<img
            src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
            alt="previous"
            className="add-lead-prev-icon"
            onClick={this.prevToAddMoreButton}
          />*/}
          <div
            className="add-lead-prev-icon"
            onClick={this.prevToAddMoreButton}
          >
            <img
              src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
              alt="previous"
            />
          </div>
        </>
        <h1 className="font-30-bold mb-61">
          Add New{" "}
          {
            selectStatusDropdownOptions[this.props.initialStatusDropDownOption]
              .value
          }{" "}
        </h1>
        <div
          className="add_more_infor_lead_container"
          style={{ display: "flex" }}
        >
          <div className="add_more_info_left_section">
            {/* <div>{leadAddLocation}</div> */}
            <div>{leadSourceDropdown}</div>
            <div>{selectFewTags}</div>
            <div>{leadAddSkypeAddress}</div>
          </div>
          <div className="add_more_info_right_section">
            {/* <div>{addLeadCompany}</div> */}
            <div>{aboutInputField}</div>
            <div>{leadAddMedia}</div>
            {/* <AddLeadFormShippingDetails
              // checkboxId="leadsShippingCheckbox"
              state={this.state.leadsShippingState}
              city={this.state.leadsShippingCity}
              pincode={this.state.leadsShippingPinCode}
              website={this.state.leadsShippingWebsite}
              billingValue={this.state.leadsShippingBilling}
              checkboxState={this.state.leadsShippingCheckbox}
              handleChange={this.handleChange}
              // handleCheckboxChange={this.handleCheckboxChange}
              error={errors}
            /> */}
          </div>
        </div>
        <button
          // type="submit"
          onClick={this.handleSubmit("saveLead")}
          onKeyDown={this.handleSubmitOnKeyDown}
          className="save_new_lead_button"
        >
          Save
        </button>
      </Modal>
    );
  };

  /*===============================
     Render Add Lead Form 
  ================================*/

  renderAddLeadFields = () => {
    let errors = this.state.errors;
    let { allEmployees } = this.state;

    // phone input field
    const phoneInputField = (
      <div className="mb-30">
        <label
          htmlFor="leadsPhoneCountryNumber"
          className="add-lead-label font-24-semibold"
        >
          Phone number
        </label>
        <br />
        <div className="d-flex align-items-baseline mb-30">
          <div className="add-lead-input-field--countryCode ml-0">
            <div className="countryCode-fixed-plus-input-container">
              <PhoneInput
                country={"us"}
                value={this.state.leadsPhoneCountryNumber}
                onChange={(leadsPhoneCountryNumber) =>
                  this.setState({ leadsPhoneCountryNumber })
                }
              />
            </div>
            {errors.leadsPhoneCountryNumber && (
              <div className="is-invalid">{errors.leadsPhoneCountryNumber}</div>
            )}
          </div>

          <div className="add-lead-input-field--phoneNumber">
            <div>
              <input
                type="text"
                pattern="[0-9]*"
                id="leadsPhoneNumber"
                name="leadsPhoneNumber"
                className="add-lead-input-field font-18-regular ml-0 w-100"
                placeholder=""
                value={this.state.leadsPhoneNumber}
                onChange={this.handleChangeNumber}
                maxLength="10"
              />
            </div>
            {errors.leadsPhoneNumber && (
              <div className="is-invalid">{errors.leadsPhoneNumber}</div>
            )}
          </div>
        </div>
      </div>
    );

    // const sourceDropdown = (
    //   <div className="mb-30">
    //     <label
    //       htmlFor="leadsSource"
    //       className="add-lead-label font-24-semibold"
    //     >
    //       Leads source
    //     </label>
    //     <div className="add-lead-input-field border-0">
    //       {/* <Dropdown
    //         className="lead-status-dropDown lead-status-dropDown--importExport lead-status-dropDown--importExport--all-lead"
    //         options={leadsSourceOptions}
    //         value={this.state.leadsSourceDropdownOption}
    //         onChange={this.onSourceDropdownSelect}
    //       /> */}

    //       {/* {console.log(leadsSourceOptions)} */}
    //       <Select
    //         className="react-select-add-lead-form-container"
    //         classNamePrefix="react-select-add-lead-form"
    //         isSearchable={false}
    //         options={leadsSourceOptions}
    //         value={this.state.selectedLeadsSourceDropdownOption}
    //         onChange={(e) => this.onSourceDropdownSelect(e)}
    //         placeholder="Select"
    //       />
    //     </div>
    //   </div>
    // );

    // about field
    // const aboutInputField = (
    //   <div className="mb-30">
    //     <label htmlFor="leadsAbout" className="add-lead-label font-24-semibold">
    //       About {this.state.leadsName}
    //     </label>
    //     <br />
    //     <textarea
    //       rows="6"
    //       id="leadsAbout"
    //       name="leadsAbout"
    //       className="add-lead-input-field font-18-regular"
    //       placeholder=""
    //       value={this.state.leadsAbout}
    //       onChange={this.handleChange}
    //       autoFocus={true}
    //     />
    //   </div>
    // );

    // status and level fields
    const setStatusAndLevel = (
      <div className="mb-30">
        <label htmlFor="leadsAbout" className="add-lead-label font-24-semibold">
          Set Level &amp; Status
        </label>
        <br />
        <div className="set_level_and_status_of_lead">
          <p>Level</p>
          <button
            onClick={this.onClickLevelButton("SUPER_HOT")}
            className={
              this.state.leadLevel === "SUPER_HOT"
                ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                : "select-lead-followup-by-btn"
            }
          >
            <span>🌋 </span>
            Super Hot
          </button>
          <button
            onClick={this.onClickLevelButton("HOT")}
            className={
              this.state.leadLevel === "HOT"
                ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                : "select-lead-followup-by-btn"
            }
          >
            <span>☀️ </span> Hot
          </button>
          <button
            onClick={this.onClickLevelButton("WARM")}
            className={
              this.state.leadLevel === "WARM"
                ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                : "select-lead-followup-by-btn"
            }
          >
            <span>☕ </span> Warm
          </button>
          <button
            onClick={this.onClickLevelButton("COLD")}
            className={
              this.state.leadLevel === "COLD"
                ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                : "select-lead-followup-by-btn"
            }
          >
            <span>❄️ </span> Cold
          </button>
        </div>
        <div className="set_level_and_status_of_lead">
          <p>Status</p>
          <Select
            className="react-select-follow-up-form-container"
            classNamePrefix="react-select-follow-up-form"
            isSearchable={false}
            options={selectStatusDropdownOptions}
            value={this.state.selectedStatusOptionDropdown}
            onChange={(e) => this.onSelectStatusDropdownSelect(e)}
            placeholder="Select"
          />
        </div>
      </div>
    );

    // worth amount
    const worthAmountInputField = (
      <div className="mb-30">
        <label
          htmlFor="leadsWorthAmount"
          className="add-lead-label font-24-semibold"
        >
          Worth amount
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
          {errors.leadsWorthAmount && (
            <div className="is-invalid add-lead-form-field-errors">
              {errors.leadsWorthAmount}
            </div>
          )}
        </div>
      </div>
    );

    return (
      <Fragment>
        <div className="add-lead-modal-container container-fluid p-0 lead_page_component">
          {/* <h1 className="font-30-bold mb-61">New Lead</h1> */}
          <h1 className="font-30-bold mb-61">
            Add New{" "}
            {
              selectStatusDropdownOptions[
                this.props.initialStatusDropDownOption
              ].value
            }
          </h1>
          <div className="add-lead-form-field-block p-0">
            {/* form */}
            <form
              noValidate
              // onSubmit={this.handleSubmit}
              onKeyDown={this.onFormKeyDown}
            >
              <div className="add_more_infor_lead_container">
                <div className="row mx-0 flex-nowrap">
                  <div className="add_more_info_left_section">
                    {/* name */}
                    <AddLeadsFormField
                      htmlFor={"leadsName"}
                      type={"text"}
                      labelName={"Name"}
                      id={"leadsName"}
                      name={"leadsName"}
                      placeholder={"Eg. Ian McKEllen"}
                      onChange={this.handleChange}
                      value={this.state.leadsName}
                      maxLength={maxLengths.char30}
                      error={errors.leadsName}
                    />
                    <AddLeadsFormField
                      htmlFor={"leadsEmail"}
                      type={"email"}
                      labelName={`Email address`}
                      id={"leadsEmail"}
                      name={"leadsEmail"}
                      placeholder={"Eg. ianmckellen@hobbit.com"}
                      onChange={this.handleChange}
                      value={this.state.leadsEmail}
                      error={errors.leadsEmail}
                    />
                    {/* phone number */}
                    {phoneInputField}
                  </div>
                  <div className="add_more_info_right_section">
                    {/* representative */}
                    <AddLeadFormAssignRepresentative
                      id="leadAssignRepresentative"
                      name="leadAssignRepresentative"
                      fieldHeading={`Assign a representative`}
                      onChange={this.handleChange}
                      onClick={this.handleRepresentativeOnClick}
                      value={this.state.leadAssignRepresentative}
                      error={errors.leadAssignRepresentative}
                      allEmployees={!isEmpty(allEmployees) && allEmployees}
                      activeEmployee={this.state.activeEmployee}
                    />
                  </div>
                </div>

                <div className="kanban-select-accounts">
                  <AddMemberSelectAndDisplayList
                    selectedOptionValue={this.state.selectOption}
                    handleChangeSelectClient={this.handleChangeSelectClient}
                    options={this.state.options}
                    displayListSelected={this.state.displayListSelected}
                    handleRemoveMember={this.handleRemoveMember}
                    error={errors.displayListSelected}
                  />
                </div>
                {/* Set lead level and status */}
                <div>
                  {setStatusAndLevel}
                  {worthAmountInputField}
                </div>
              </div>
              <div className="text-right mb-3">
                <button
                  className="add_more_info_lead_button"
                  onClick={this.handleSubmit("addMoreFields")}
                >
                  Add more info
                </button>
                <button
                  // type="submit"
                  onClick={this.handleSubmit("saveLead")}
                  onKeyDown={this.handleSubmitOnKeyDown}
                  className="save_new_lead_button"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Fragment>
    );
  };

  /*===============================
     Render Follow up form 
  ================================*/

  renderFolloupFields = () => {
    const { selectedOption, currentFollowUp } = this.state;
    let errors = this.state.errors;
    // console.log(this.state.selectedOption);
    return (
      <Fragment>
        <div className="add-lead-modal-container add-lead-modal-container--followUp">
          <h1 className="font-21-bold mb-30">
            Add Follow up for {currentFollowUp && currentFollowUp.name}
          </h1>
          <form noValidate onSubmit={this.handleSaveFollowUp}>
            <div className="add-lead-form-field-block add-follow-up-main-container">
              <div className="follow-up-select mb-30">
                <input readOnly className="invisible d-none" autoFocus />

                {/* <CustomEditDropdown
                  id="selectedOption"
                  name="selectedOption"
                  value={this.state.selectedOption}
                  readOnly={true}
                  onInputChangeHandler={this.onDropdownChange}
                  dropDownToggler={this.dropDownToggler}
                  dropDown={this.state.dropdown}
                  suggestionList={this.state.suggestionList}
                  dropDownSelect={this.dropDownSelect}
                  placeholder={"Select"}
                /> */}

                <Select
                  className="react-select-follow-up-form-container"
                  classNamePrefix="react-select-follow-up-form"
                  isSearchable={false}
                  options={selectDropdownOptions}
                  value={this.state.selectedOptionDropdown}
                  onChange={(e) => this.onSelectDropdownSelect(e)}
                  placeholder="Select"
                />
              </div>

              <div className="follow-up-date-time-section mb-30">
                <div className="follow-up-date leads-title-block-container__date-picker">
                  <label htmlFor="date" className="font-21-medium">
                    Date for scheduling
                  </label>
                  <div className="d-flex align-items-center justify-content-end leads-title-block-container__date-picker mb-10 mx-0">
                    <span
                      className="font-24-semibold mr-30"
                      role="img"
                      aria-labelledby="Tear-Off Calendar"
                    >
                      {/* calendar */}
                      {/* &#x1F4C6; */}
                    </span>
                    {/* datepicker */}
                    <DatePicker
                      minDate={new Date()}
                      selected={this.state.startDate}
                      onChange={this.handleChangeDate}
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </div>
                </div>
                <div className="follow-up-time leads-title-block-container__date-picker">
                  <label htmlFor="date" className="font-21-medium">
                    Time for scheduling
                  </label>
                  <div className="d-flex align-items-center justify-content-end leads-title-block-container__date-picker mb-10 mx-0">
                    <span
                      className="font-24-semibold mr-30"
                      role="img"
                      aria-labelledby="clock"
                    >
                      {/* clock */}
                      {/* &#x1F552; */}
                    </span>
                    {/* datepicker */}
                    <DatePicker
                      selected={this.state.startTime}
                      onChange={this.handleChangeTime}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      dateFormat="h:mm aa"
                      timeCaption="Time"
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </div>
                </div>
              </div>
              {selectedOption === "Meeting" && (
                <div className="mb-30">
                  <label
                    htmlFor="followUpLocation"
                    className="add-lead-label font-21-medium ml-0 pb-16"
                  >
                    Enter Your Location
                  </label>
                  <br />
                  <input
                    htmlFor={"followUpLocation"}
                    id={"followUpLocation"}
                    name={"followUpLocation"}
                    placeholder={"Eg. India"}
                    onChange={this.handleChange}
                    value={this.state.followUpLocation}
                    maxLength={maxLengths.char30}
                    className="add-lead-input-field font-18-regular m-0 w-100"
                  />
                  {errors.followUpLocation && (
                    <div className="is-invalid">{errors.followUpLocation}</div>
                  )}
                </div>
              )}
            </div>
            {/* buttons */}
            <div className="pt-25 text-right">
              <button
                type="submit"
                className="btn-funnel-view btn-funnel-view--files m-0"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Fragment>
    );
  };

  render() {
    // console.log(this.state.leadStatus);
    const { open } = this.state;
    const classNameInMobile = this.props.isActive
      ? "font-24-bold floating-btn-options-block__link"
      : "resp-font-12-regular floating-btn-options-block__link";

    return (
      <>
        <div className="add-new-btn-kanban-board-block">
          <button
            className="add-new-btn-kanban-board"
            onClick={this.onOpenModal}
          >
            &#43; New
          </button>
        </div>
        {/* render add more info model */}
        {this.renderAddMoreInfoModel()}
        {this.state.addFollowUpForm ? (
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
            {this.renderFolloupFields()}
          </Modal>
        ) : (
          <Modal
            open={open}
            onClose={this.onCloseModal}
            closeOnEsc={true}
            closeOnOverlayClick={false}
            center
            classNames={{
              overlay: "customOverlay customOverlay--warning_before_five_days",
              modal: "customModal lead_add_more_info_model",
              closeButton: "customCloseButton",
            }}
          >
            <span className="closeIconInModal" onClick={this.onCloseModal} />
            {this.renderAddLeadFields()}
          </Modal>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allEmployees: state.employee.allEmployees,
  apiStatus: state.auth.status,
  followUpData: state.leads.currentLeadAdded,
  leadFilterName: state.filterName.filterName,
  userId: state.auth.user.id,
  validationError: state.errors.errors,
  allAccounts: state.account.allAccounts,
});

export default connect(mapStateToProps, {
  addLeadAction,
  addFollowUpLead,
  addLeadMeetingsAction,
  getAllEmployees,
  getAllEmployeesWithAdmin,
  statusEmpty,
})(AddNewFormModal);
