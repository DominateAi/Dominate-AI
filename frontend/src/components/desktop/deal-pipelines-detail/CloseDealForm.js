import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import { validateCloseDealForm } from "../../../store/validations/dealPipelinesValidation/closeDealFormValidation";
// import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
import ToggleSwitch from "../common/ToggleSwitch";

import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
// import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AccountsTextarea from "../common/AccountsTextarea";

const totalFormSlides = 0;

const frequencyOptions = [
  { value: "Yearly", label: "Yearly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
];

class CloseDealForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      prevNextIndex: 0,
      // form
      dealType: true,
      startDate: new Date(),
      endDate: new Date(),
      frequencySelectedOptionDropdown: frequencyOptions[0],
      city: "",
      shippingAddress: "",
      errors: {},
      apiErrors: {},
      success: false,
    };
  }

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
    return null;
  }

  // componentDidUpdate() {
  // console.log("component did upadate", this.state.apiErrors);
  // if (
  //   this.props.apiStatus &&
  //   this.state.success &&
  //   !this.state.hasClosedModal
  // ) {
  //   this.onCloseModal();
  //   this.setState({ hasClosedModal: true });
  // }
  // if (
  //   !isEmpty(this.state.apiErrors) &&
  //   this.state.apiErrors.statusCode === 400 &&
  //   !this.state.hasSetErrors &&
  //   isEmpty(this.state.errors)
  // ) {
  //   this.setState({
  //     prevNextIndex: 1,
  //     hasSetErrors: true,
  //   });
  // }
  // }

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

  onOpenModal = () => {
    this.setState({ open: true, hasClosedModal: false, success: false });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      prevNextIndex: 0,
      // form
      dealType: true,
      startDate: new Date(),
      endDate: new Date(),
      frequencySelectedOptionDropdown: frequencyOptions[0],
      city: "",
      shippingAddress: "",
      errors: {},
      apiErrors: {},
      success: false,
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

  toggleFunction = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
      hasActive: false,
    });
  };

  onSelectDropdownSelect = (e) => {
    this.setState({
      frequencySelectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  handleChangeStart = (date) => {
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

  handleChangeEnd = (date) => {
    if (date === null) {
      this.setState({
        endDate: new Date(),
      });
    } else {
      this.setState({
        endDate: date,
      });
    }
  };

  // handleSubmitOnKeyDown = (e) => {
  //   let keyCode = e.keyCode || e.which;
  //   if (keyCode === 13) {
  //     e.preventDefault();
  //     this.handleSubmitFunctionMain();
  //   }
  // };

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.handleSubmitFunctionMain();
  // };

  // handleSubmitFunctionMain = () => {
  //   console.log(this.state);
  //   const { errors, isValid } = validateCloseDealForm(this.state);
  //   if (!isValid) {
  //     this.setState({
  //       errors,
  //     });
  //   }
  //   if (isValid) {
  //     this.onCloseModal();
  //     // this.setState({
  //     //   success: true,
  //     // });
  //   }
  // };

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
    if (keyCode === 13 && this.state.prevNextIndex !== 0) {
      e.preventDefault();
      this.handleNext();
    }
  };

  handleNext = () => {
    const { errors } = validateCloseDealForm(this.state);
    this.setState({
      success: false,
      apiErrors: {},
      hasSetErrors: false,
    });
    if (this.state.prevNextIndex === 1) {
      if (errors.city) {
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
          this.state.prevNextIndex < totalFormSlides
            ? this.state.prevNextIndex + 1
            : this.state.prevNextIndex,
        errors: {},
      });
    }
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*============================
    render form
  =============================*/

  renderForm = () => {
    const { open, prevNextIndex, errors } = this.state;

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
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Close Deal</h1>

          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <img
                  src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
                  alt="previous"
                  className="add-lead-prev-icon"
                  onClick={this.handlePrev}
                />
              )}

              {prevNextIndex >= totalFormSlides ? (
                ""
              ) : (
                <img
                  src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
                  alt="previous"
                  className="add-lead-next-icon"
                  onClick={this.handleNext}
                />
              )}
            </div>
            {/* form */}
            <form
              noValidate
              // onSubmit={this.handleSubmit}
              onKeyDown={this.onFormKeyDown}
            >
              {prevNextIndex === 0 && (
                <div className="close-deal-form-screen-1 deals-toggle-color-change">
                  <h3 className="add-lead-label font-24-semibold">Deal Type</h3>
                  <ToggleSwitch
                    name="dealType"
                    currentState={this.state.dealType}
                    type={"checkbox"}
                    spantext1={"Reccurring"}
                    spantext2={"One Time"}
                    toggleclass={"toggle toggle--new-dashboard"}
                    toggleinputclass={
                      "toggle__switch toggle__switch--new-dashboard mx-3"
                    }
                    onChange={this.toggleFunction}
                    defaultChecked={true}
                  />

                  {this.state.dealType && (
                    <div>
                      <div>
                        <h3 className="add-lead-label font-24-semibold">
                          Frequency
                        </h3>

                        <Select
                          className="react-select-follow-up-form-container"
                          classNamePrefix="react-select-follow-up-form"
                          isSearchable={false}
                          options={frequencyOptions}
                          value={this.state.frequencySelectedOptionDropdown}
                          onChange={this.onSelectDropdownSelect}
                          placeholder="Select"
                        />
                      </div>
                      {/* datepicker */}
                      <div className="leads-title-block-container__date-picker mr-0">
                        {/* datepicker */}
                        <div>
                          <h3 className="add-lead-label font-24-semibold">
                            Start Date
                          </h3>
                          <DatePicker
                            selected={this.state.startDate}
                            selectsStart
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeStart}
                            placeholderText="mm/dd/yyyy"
                            onChangeRaw={this.handleDateChangeRaw}
                          />
                        </div>
                        <div>
                          <h3 className="add-lead-label font-24-semibold">
                            End Date
                          </h3>
                          <DatePicker
                            selected={this.state.endDate}
                            selectsEnd
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeEnd}
                            minDate={this.state.startDate}
                            placeholderText="mm/dd/yyyy"
                            onChangeRaw={this.handleDateChangeRaw}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* city */}
              {prevNextIndex === 1 && (
                <AddEmployeesFormFields
                  type="text"
                  htmlFor={"city"}
                  labelName={"City"}
                  id={"city"}
                  name={"city"}
                  placeholder={""}
                  onChange={this.handleChange}
                  value={this.state.city}
                  error={errors.city}
                />
              )}

              {/* shipping address */}
              {prevNextIndex === 2 && (
                <AccountsTextarea
                  checkboxClass="edit-account-form-row"
                  htmlFor="shippingAddress"
                  labelName="Shipping Address"
                  value={this.state.shippingAddress}
                  onChange={this.handleChange}
                  error={errors.shippingAddress}
                />
              )}

              {prevNextIndex === totalFormSlides && (
                <div className="pt-25 text-right">
                  <button
                    // type="submit"
                    onClick={this.props.handleSubmit(this.state)}
                    onKeyDown={this.props.handleSubmitOnKeyDown(this.state)}
                    className="new-save-btn-blue"
                  >
                    Save
                  </button>
                </div>
              )}

              {/* <AddLeadBlueProgressbar
                percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
                skipButtonFrom={2}
                prevNextIndex={prevNextIndex}
              /> */}
            </form>
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    return (
      <Fragment>
        {/* <button
          className="leads-title-block-btn-red-bg mr-30 ml-30"
          onClick={this.onOpenModal}
        >
          &#43; Close Deal
        </button> */}

        {this.renderForm()}
      </Fragment>
    );
  }
}

export default CloseDealForm;
