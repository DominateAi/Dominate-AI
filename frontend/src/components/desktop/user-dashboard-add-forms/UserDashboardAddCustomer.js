import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import AddLeadsFormField from "./../leads/AddLeadsFormField";
import AddLeadFormMediaAccount from "./../leads/AddLeadFormMediaAccount";
import EditLeadSocialMediaAccount from "../leads/EditLeadSocialMediaAccount";
import AddLeadFormShippingDetails from "./../leads/AddLeadFormShippingDetails";
// import AddLeadFormAssignRepresentative from "./../leads/AddLeadFormAssignRepresentative";
// import AddLeadFormSelectFewTags from "./../leads/AddLeadFormSelectFewTags";
import { connect } from "react-redux";
import {
  addCustomerAction,
  getAllCustomers,
  filterAllCustomerByLevelAction,
  getMyCustomers,
} from "./../../../store/actions/customerAction";
import { statusEmpty } from "./../../../store/actions/authAction";
import { getAllEmployeesWithAdmin } from "./../../../store/actions/employeeAction";
import { validateAddCustomer } from "./../../../store/validations/customerValidation/customerValidation";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_FILTER_NAME, SET_EMPTY_ERRORS } from "./../../../store/types";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

// phone flags country code
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const allCustomersOptions = [
  // "My Customers",
  "All Customers",
  "Archived Customers",
];

// starts from 0
const totalFormSlides = 3;

class UserDashboardAddCustomer extends Component {
  state = {
    open: false,
    addMoreInfoPopup: false,
    prevNextIndex: 0,
    leadsName: "",
    leadsemail: "",
    leadsAddress: "",
    leadsWorkInCompanyName: "",
    leadsPhoneCountryNumber: "+1",
    leadsPhoneNumber: "",
    leadsAbout: "",
    leadMediaEmailCheckbox: "",
    leadMediaEmailInput: "",
    leadMediaLinkedInCheckbox: false,
    leadMediaLinkedInInput: "",
    leadMediaFacebookCheckbox: false,
    leadMediaFacebookInput: "",
    leadMediaInstagramCheckbox: false,
    leadMediaInstagramInput: "",
    leadMediaOthersCheckbox: false,
    leadMediaOthersInput: "",
    leadsShippingAddress: "",
    leadsShippingBilling: "",
    leadsShippingCheckbox: "",
    leadsShippingState: "",
    leadsShippingCity: "",
    leadsShippingPinCode: "",
    leadsShippingWebsite: "",
    errors: [],
    allCustomerDefaultOption: allCustomersOptions[0],
    allEmployees: [],
    activeEmployee: [],
    success: false,
    validationError: {},
  };

  /*===================================
          Lifecycle Method
  ====================================*/
  componentDidMount() {
    this.props.getAllEmployeesWithAdmin();
    store.dispatch({
      type: SET_FILTER_NAME,
      payload: this.state.allCustomerDefaultOption,
    });
    // handle prev and next screen by keyboard
    document.addEventListener("keydown", this.handleMainDivKeyDown);
    this.setState({
      prevNextIndex: 0,
    });
  }

  componentWillUnmount() {
    // handle prev and next screen by keyboard
    document.removeEventListener("keydown", this.handleMainDivKeyDown);
    store.dispatch({
      type: SET_EMPTY_ERRORS,
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

    return null;
  }

  componentDidUpdate() {
    if (
      this.props.apiStatus &&
      this.state.success &&
      !this.state.hassubmitted
    ) {
      this.onCloseModal();
      this.setState({
        hassubmitted: true,
      });
    }
    if (
      !isEmpty(this.state.validationError) &&
      this.state.validationError.statusCode === 400 &&
      !this.state.hasSetErrors &&
      isEmpty(this.state.errors)
    ) {
      const errors = {
        leadsemail:
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

  /*============================ 
      Model Handler
===============================*/
  onOpenModal = () => {
    const { allEmployees } = this.state;
    let defaultAssign = allEmployees.filter(function (allEmployees) {
      return allEmployees.role.name === "Administrator";
    });
    // console.log(defaultAssign);
    this.props.statusEmpty();
    this.setState({
      open: true,
      addMoreInfoPopup: false,
      success: false,
      hassubmitted: false,
      leadAssignRepresentative: defaultAssign[0].name,
      leadAssignRepresentativeId: defaultAssign[0]._id,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      addMoreInfoPopup: false,
      prevNextIndex: 0,
      leadsName: "",
      leadsAddress: "",
      leadsWorkInCompanyName: "",
      leadsPhoneCountryNumber: "+1",
      leadsPhoneNumber: "",
      leadsAbout: "",
      leadsemail: "",
      // leadMediaEmailCheckbox: "",
      // leadMediaEmailInput: "",
      leadMediaLinkedInCheckbox: false,
      leadMediaLinkedInInput: "",
      leadMediaFacebookCheckbox: false,
      leadMediaFacebookInput: "",
      leadMediaInstagramCheckbox: false,
      leadMediaInstagramInput: "",
      leadMediaOthersCheckbox: false,
      leadMediaOthersInput: "",
      leadsShippingAddress: "",
      leadsShippingBilling: "",
      leadsShippingCheckbox: "",
      leadsShippingState: "",
      leadsShippingCity: "",
      leadsShippingPinCode: "",
      leadsShippingWebsite: "",
      leadAssignRepresentative: "",
      tagsInputValue: [],
      errors: {},
    });
  };

  /*===============================
      Customer Form events Handlers
  =================================*/
  handleChange = (e) => {
    if (
      [e.target.name].toString() === "leadsPhoneNumber" ||
      [e.target.name].toString() === "leadsShippingPinCode"
    ) {
      this.setState({
        [e.target.name]: e.target.validity.valid ? e.target.value : "",
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
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
        open: false,
        addMoreInfoPopup: true,
      });
    } else {
      this.handleSubmitFunctionMain();
    }
  };

  handleSubmitFunctionMain = () => {
    const { errors, isValid } = validateAddCustomer(this.state);
    if (!isValid) {
      this.setState({
        errors,
        // prevNextIndex: 0
      });
    }

    console.log(errors);

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

      this.props.addCustomerAction(
        {
          name: this.state.leadsName,
          company: this.state.leadsWorkInCompanyName,
          email: this.state.leadsemail,
          phone: "+" + newleadsPhoneCountryNumber + this.state.leadsPhoneNumber,
          // assigned: this.state.leadAssignRepresentativeId,
          shippingAddress: {
            state: this.state.leadsShippingState,
            city: this.state.leadsShippingCity,
            pincode: this.state.leadsShippingPinCode,
            website: this.state.leadsShippingWebsite,
            countryCode: this.state.leadsPhoneCountryNumber,
            livingAddress: this.state.leadsAddress,
          },
          billingAddress: this.state.leadsShippingBilling,
          status: "ACTIVE",
          media: {
            facebook: this.state.leadMediaFacebookInput,

            linkedIn: this.state.leadMediaLinkedInInput,

            instagram: this.state.leadMediaInstagramInput,

            other: this.state.leadMediaOthersInput,
          },
          tags: this.state.tagsArray,
          profileImage: "https://xyz.com",
          about: this.state.leadsAbout,
        },
        this.props.customerFilterName
      );

      this.setState({
        success: true,
      });
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
    if (keyCode === 13) {
      e.preventDefault();
      this.handleNext();
    }
  };

  handleNext = () => {
    const { errors, isValid } = validateAddCustomer(this.state);
    if (this.state.prevNextIndex === 0) {
      if (errors.leadsName) {
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
    } else if (this.state.prevNextIndex === 1) {
      if (errors.leadsemail) {
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
    } else if (this.state.prevNextIndex === 2) {
      if (errors.leadsPhoneCountryNumber || errors.leadsPhoneNumber) {
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
    } else if (this.state.prevNextIndex === 4) {
      if (errors.leadsAddress) {
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
    } else if (this.state.prevNextIndex === 3) {
      if (errors.leadsWorkInCompanyName) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex:
            this.state.prevNextIndex < totalFormSlides
              ? this.state.prevNextIndex + 1
              : this.state.prevNextIndex,
          errors: {},
        });
      }
    } else if (this.state.prevNextIndex === 5) {
      if (
        errors.leadMediaLinkedInInput ||
        errors.leadMediaFacebookInput ||
        errors.leadMediaInstagramInput ||
        errors.leadMediaOthersInput
      ) {
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
    } else if (this.state.prevNextIndex === 6) {
      if (errors.leadsAbout) {
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
      if (!isValid) {
        this.setState({
          errors,
          prevNextIndex:
            this.state.prevNextIndex < totalFormSlides
              ? this.state.prevNextIndex + 1
              : this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex:
            this.state.prevNextIndex < totalFormSlides
              ? this.state.prevNextIndex + 1
              : this.state.prevNextIndex,
          errors: {},
        });
      }
    }
  };

  /*=============================
        Render customer filter
  ===============================*/
  onAllCustomerDropdownSelect = (e) => {
    // console.log("Selected: " + e.value);
    this.setState({
      allCustomerDefaultOption: e.value,
    });
    store.dispatch({
      type: SET_FILTER_NAME,
      payload: e.value,
    });
    if (e.value === "All Customers") {
      const allCustomerQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {},
      };
      this.props.getAllCustomers(allCustomerQuery);
    } else if (e.value === "Archived Customers") {
      const filterCustomer = {
        query: {
          status: "ARCHIVE",
        },
      };
      this.props.filterAllCustomerByLevelAction(filterCustomer);
    } else {
      // this.props.getMyCustomers(this.props.userId);s
    }
  };

  renderCustomerFilter = () => {
    return (
      <>
        <Dropdown
          className="lead-status-dropDown lead-status-dropDown--importExport lead-status-dropDown--importExport--all-lead"
          options={allCustomersOptions}
          value={this.state.allCustomerDefaultOption}
          onChange={this.onAllCustomerDropdownSelect}
        />
      </>
    );
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
      <div className="mb-30 pb-16">
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
        {errors.leadsAbout && (
          <div style={{ paddingLeft: "40px" }} className="is-invalid">
            {errors.leadsAbout}
          </div>
        )}
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
          <img
            src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
            alt="previous"
            className="add-lead-prev-icon"
            onClick={this.prevToAddMoreButton}
          />
        </>
        <h1 className="font-30-bold mb-61">New Customer</h1>
        <div
          className="add_more_infor_lead_container"
          style={{ display: "flex" }}
        >
          <div className="add_more_info_left_section">
            <div>
              <AddLeadsFormField
                htmlFor={"leadsAddress"}
                type={"text"}
                labelName={`Where does ${this.state.leadsName} live?`}
                id={"leadsAddress"}
                name={"leadsAddress"}
                placeholder={"Eg. India"}
                onChange={this.handleChange}
                value={this.state.leadsAddress}
                error={errors.leadsAddress}
              />
            </div>
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
            {aboutInputField}
          </div>
          <div className="add_more_info_right_section">
            <AddLeadFormShippingDetails
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
            />
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
    // const { allEmployees } = this.state;
    // phone input field
    const phoneInputField = (
      <div className="mb-30">
        <label
          htmlFor="leadsPhoneCountryNumber"
          className="add-lead-label font-24-semibold"
        >
          {this.state.leadsName}'s phone number?
        </label>
        <br />
        <div className="d-flex align-items-baseline">
          <div className="add-lead-input-field--countryCode">
            <div className="countryCode-fixed-plus-input-container">
              {/* <span className="font-18-regular countryCode-fixed-plus">+</span>
              <input
                type="text"
                id="leadsPhoneCountryNumber"
                name="leadsPhoneCountryNumber"
                className="add-lead-input-field font-18-regular ml-0"
                placeholder="----"
                value={this.state.leadsPhoneCountryNumber}
                onChange={this.handleChange}
                maxLength="4"
                autoFocus={true}
              /> */}
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
                onChange={this.handleChange}
                maxLength="10"
              />
            </div>
            {errors.leadsPhoneNumber && (
              <div className="is-invalid">{errors.leadsPhoneNumber}</div>
            )}
          </div>{" "}
        </div>
      </div>
    );

    // about field
    const aboutInputField = (
      <div className="mb-30 pb-16">
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
        {errors.leadsAbout && (
          <div style={{ paddingLeft: "40px" }} className="is-invalid">
            {errors.leadsAbout}
          </div>
        )}
      </div>
    );

    const { prevNextIndex } = this.state;
    return (
      <Fragment>
        <div className="add-lead-modal-container container-fluid pr-0 lead_page_component">
          <h1 className="font-30-bold mb-61">New Customer</h1>

          <AddLeadBlueProgressbar
            percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
            skipButtonFrom={5}
            prevNextIndex={prevNextIndex}
          />

          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
                  alt="previous"
                  className="add-lead-prev-icon"
                  onClick={this.handlePrev}
                />*/}
                  <div className="add-lead-prev-icon" onClick={this.handlePrev}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                      alt="previous"
                    />
                  </div>
                </>
              )}

              {prevNextIndex >= totalFormSlides ? (
                ""
              ) : (
                <>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
                  alt="next"
                  className="add-lead-next-icon"
                  onClick={this.handleNext}
                />*/}
                  <div className="add-lead-next-icon" onClick={this.handleNext}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
                      alt="next"
                    />
                  </div>
                </>
              )}
            </div>

            {/* form */}
            <form
              noValidate
              // onSubmit={this.handleSubmit}
              onKeyDown={this.onFormKeyDown}
            >
              {/* name */}
              {prevNextIndex === 0 ? (
                <AddLeadsFormField
                  htmlFor={"leadsName"}
                  type={"text"}
                  labelName={"What is your new customer's name?"}
                  id={"leadsName"}
                  name={"leadsName"}
                  placeholder={"Eg. Ian McKEllen"}
                  onChange={this.handleChange}
                  value={this.state.leadsName}
                  maxLength={maxLengths.char30}
                  error={errors.leadsName}
                />
              ) : (
                ""
              )}

              {/* email */}
              {prevNextIndex === 1 ? (
                <AddLeadsFormField
                  htmlFor={"leadsemail"}
                  type={"email"}
                  labelName={`${this.state.leadsName}'s email address?`}
                  id={"leadsemail"}
                  name={"leadsemail"}
                  placeholder={"Eg. ianmckellen@hobbit.com"}
                  onChange={this.handleChange}
                  value={this.state.leadsemail}
                  error={errors.leadsemail}
                />
              ) : (
                ""
              )}

              {/* phone number */}
              {prevNextIndex === 2 ? <>{phoneInputField}</> : ""}

              {/* address */}
              {prevNextIndex === 4 ? (
                <div>
                  <AddLeadsFormField
                    htmlFor={"leadsAddress"}
                    type={"text"}
                    labelName={`Where does ${this.state.leadsName} live?`}
                    id={"leadsAddress"}
                    name={"leadsAddress"}
                    placeholder={"Eg. India"}
                    onChange={this.handleChange}
                    value={this.state.leadsAddress}
                    error={errors.leadsAddress}
                  />
                </div>
              ) : (
                ""
              )}

              {/* company name */}
              {prevNextIndex === 3 ? (
                <div>
                  <AddLeadsFormField
                    htmlFor={"leadsWorkInCompanyName"}
                    type={"text"}
                    labelName={`Which company does ${this.state.leadsName} work for?`}
                    id={"leadsWorkInCompanyName"}
                    name={"leadsWorkInCompanyName"}
                    placeholder={"Eg. Marvel Studios"}
                    onChange={this.handleChange}
                    value={this.state.leadsWorkInCompanyName}
                    error={errors.leadsWorkInCompanyName}
                  />
                  <div className="pt-25 text-right mb-3">
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
                </div>
              ) : (
                ""
              )}

              {/* media accounts */}
              {prevNextIndex === 5 ? (
                <div>
                  <div className="mb-30">
                    <div className="mb-10">
                      <label
                        htmlFor="leadMediaEmailCheckbox"
                        className="add-lead-label font-24-semibold"
                      >
                        Add other media accounts
                      </label>
                      <br />
                    </div>
                    <div className="all-checkbox-block">
                      {/* email */}
                      {/* <AddLeadFormMediaAccount
                        checkboxId="leadMediaEmailCheckbox"
                        checkboxLabelName="Email"
                        handleCheckboxChange={this.handleCheckboxChange}
                        inputId="leadMediaEmailInput"
                        inputPlaceholder="mikeross@gmail.com"
                        inputOnChange={this.handleChange}
                        inputValue={this.state.leadMediaEmailInput}
                        checkboxState={this.state.leadMediaEmailCheckbox}
                      /> */}

                      {/* linked In */}
                      <AddLeadFormMediaAccount
                        checkboxId="leadMediaLinkedInCheckbox"
                        checkboxLabelName="LinkedIn"
                        handleCheckboxChange={this.handleCheckboxChange}
                        inputId="leadMediaLinkedInInput"
                        inputPlaceholder="mikeross@gmail.com"
                        inputOnChange={this.handleChange}
                        inputValue={this.state.leadMediaLinkedInInput}
                        checkboxState={this.state.leadMediaLinkedInCheckbox}
                        error={errors.leadMediaLinkedInInput}
                      />

                      {/* facebook */}
                      <AddLeadFormMediaAccount
                        checkboxId="leadMediaFacebookCheckbox"
                        checkboxLabelName="Facebook"
                        handleCheckboxChange={this.handleCheckboxChange}
                        inputId="leadMediaFacebookInput"
                        inputPlaceholder="mikeross@gmail.com"
                        inputOnChange={this.handleChange}
                        inputValue={this.state.leadMediaFacebookInput}
                        checkboxState={this.state.leadMediaFacebookCheckbox}
                        error={errors.leadMediaFacebookInput}
                      />

                      {/* instagram */}
                      <AddLeadFormMediaAccount
                        checkboxId="leadMediaInstagramCheckbox"
                        checkboxLabelName="Instagram"
                        handleCheckboxChange={this.handleCheckboxChange}
                        inputId="leadMediaInstagramInput"
                        inputPlaceholder="mikeross@gmail.com"
                        inputOnChange={this.handleChange}
                        inputValue={this.state.leadMediaInstagramInput}
                        checkboxState={this.state.leadMediaInstagramCheckbox}
                        error={errors.leadMediaInstagramInput}
                      />

                      {/* other */}
                      <AddLeadFormMediaAccount
                        checkboxId="leadMediaOthersCheckbox"
                        checkboxLabelName="Others"
                        handleCheckboxChange={this.handleCheckboxChange}
                        inputId="leadMediaOthersInput"
                        inputPlaceholder="mikeross@gmail.com"
                        inputOnChange={this.handleChange}
                        inputValue={this.state.leadMediaOthersInput}
                        checkboxState={this.state.leadMediaOthersCheckbox}
                        error={errors.leadMediaOthersInput}
                      />
                    </div>
                  </div>

                  {/* skip */}
                  {this.state.leadMediaLinkedInCheckbox === false &&
                    this.state.leadMediaFacebookCheckbox === false &&
                    this.state.leadMediaInstagramCheckbox === false &&
                    this.state.leadMediaOthersCheckbox === false && (
                      <div className="text-right">
                        <button
                          className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                          onClick={this.handleNext}
                        >
                          Skip
                        </button>
                      </div>
                    )}
                </div>
              ) : (
                ""
              )}

              {/* about */}
              {prevNextIndex === 6 ? <div>{aboutInputField}</div> : ""}

              {/* shipping address */}
              {prevNextIndex === 7 ? (
                <div>
                  <AddLeadFormShippingDetails
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
                  />
                  {/* buttons */}
                  <div className="pt-25 text-right">
                    {/* <button
                        className="btn-funnel-view btn-funnel-view--add-lead-save-btn mr-30"
                        onClick={this.handleSaveAboutLead}
                      >
                        Skip
                      </button> */}
                    <button
                      // type="submit"
                      onClick={this.handleSubmit}
                      onKeyDown={this.handleSubmitOnKeyDown}
                      className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </form>
          </div>
        </div>
      </Fragment>
    );
  };

  render() {
    // console.log(this.props.customerFilterName);
    // const { userRole } = this.props;
    const { open } = this.state;
    // const classNameInMobile = this.props.isActive
    //   ? "font-24-bold floating-btn-options-block__link"
    //   : "resp-font-12-regular floating-btn-options-block__link";

    return (
      <Fragment>
        {/* <h2 className="font-24-semibold">All Customers</h2> */}
        {/* render all customers filter */}
        {/* {this.renderCustomerFilter()} */}
        {/* {userRole === "Administrator" && ( */}
        <div className="new-dashboard-rc-option" onClick={this.onOpenModal}>
          Customer
        </div>
        {/* )} */}

        {/* render add more info model */}
        {this.renderAddMoreInfoModel()}
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
          {this.renderAddLeadFields()}
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  allEmployees: state.employee.allEmployees,
  apiStatus: state.auth.status,
  customerFilterName: state.filterName.filterName,
  userRole: state.auth.user.role.name,
  validationError: state.errors.errors,
});

export default connect(mapStateToProps, {
  addCustomerAction,
  getAllCustomers,
  filterAllCustomerByLevelAction,
  getAllEmployeesWithAdmin,
  statusEmpty,
  getMyCustomers,
})(UserDashboardAddCustomer);
