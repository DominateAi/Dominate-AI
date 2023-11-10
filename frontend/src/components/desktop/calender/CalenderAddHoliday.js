import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import CustomEditDropdown from "../common/CustomEditDropdown";
import { connect } from "react-redux";
import { addLeavesAction } from "./../../../store/actions/calenderAction";
import { validateAddHoliday } from "../../../store/validations/holidayValidation/holidayValidation";
import dateFns from "date-fns";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
import AddLeadsFormField from "../leads/AddLeadsFormField";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
// import Select from "react-select";

// started from 0
const totalFormSlides = 1;

class CalenderAddHoliday extends Component {
  state = {
    open: false,
    prevNextIndex: 0,
    holidayDate: new Date(),
    holiday: "",
    success: false,
    errors: {},
  };

  /*=================================
        Lifecycle Methods
  ==================================*/
  componentDidMount() {
    // handle prev and next screen by keyboard
    document.addEventListener("keydown", this.handleMainDivKeyDown);
    this.setState({
      prevNextIndex: 0,
    });
  }

  componentWillUnmount() {
    // handle prev and next screen by keyboard
    document.removeEventListener("keydown", this.handleMainDivKeyDown);
  }

  callBackAddLeave = (status) => {
    if (status === 200) {
      this.onCloseModal();
    }
  };

  /*===============================
          onchange handler
  ================================*/

  handleChangeHolidayDate = (date) => {
    if (date === null) {
      this.setState({
        holidayDate: new Date(),
      });
    } else {
      this.setState({
        holidayDate: date,
      });
    }
  };

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*============================
        Model Event Handlers
    ===============================*/

  onOpenModal = () => {
    this.setState({ open: true, success: false, hasmodalclose: false });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      prevNextIndex: 0,
      holidayDate: new Date(),
      success: false,
      hasmodalclose: false,
      holiday: "",
      errors: {},
    });
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
    const { errors } = validateAddHoliday(this.state);
    console.log(errors);
    if (this.state.prevNextIndex === 0) {
      if (errors.holiday) {
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
    }
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  /*================================
          form events
    =================================*/
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

  handleSubmitFunctionMain = (e) => {
    const { isValid, errors } = validateAddHoliday(this.state);

    if (!isValid) {
      this.setState({ errors });
    } else {
      // let newFromDate = this.state.fromDate.toISOString();
      let newtoDate = this.state.holidayDate.toISOString();

      const newLeave = {
        leaveType: "HOLIDAY",
        leaveStatus: "APPROVED",
        fromDate: newtoDate,
        toDate: newtoDate,
        reason: this.state.holiday,
        hidden: false,
      };
      console.log(newLeave);
      this.props.addLeavesAction(
        newLeave,
        "Holiday Added",
        this.callBackAddLeave
      );
    }
    this.setState({
      success: true,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*=================================
      Render Add Leaves Model
  ===================================*/

  renderAddLeavesFields = () => {
    let { errors, prevNextIndex } = this.state;
    return (
      <Fragment>
        <div className="add-lead-modal-container container-fluid pr-0 lead_page_component">
          <h1 className="font-30-bold mb-61">New Holiday</h1>
          <AddLeadBlueProgressbar
            percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
            skipButtonFrom={2}
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
                <Fragment>
                  {/*<label
                    htmlFor="selectedOption"
                    className="add-lead-label font-24-semibold"
                  >
                    Name of Holiday
                  </label>
                  <br />*/}
                  <div className="type-of-leave-select1 mb-30">
                    {/* <Select
                                        value={selectedOption.value}
                                        onChange={this.handleChangeSelect}
                                        options={options}
                                        placeholder="Select"
                                    /> */}

                    {/* <input readOnly className="invisible d-none" autoFocus /> */}

                    {/*<input
                      className="holiday_input"
                      placeholder="e.g. National Holiday"
                      type="text"
                      name="holiday"
                      id="holiday"
                      value={this.state.holiday}
                      onChange={this.onChangeHandler}
                      maxLength={maxLengths.char30}
                      autoFocus={true}
                    />
                    {errors.holiday && (
                      <div className="is-invalid add-lead-form-field-errors ml-4">
                        {errors.holiday}
                      </div>
                    )}*/}
                    <AddLeadsFormField
                      placeholder="e.g. National Holiday"
                      type="text"
                      name="holiday"
                      id="holiday"
                      labelName="Name of Holiday"
                      value={this.state.holiday}
                      onChange={this.onChangeHandler}
                      maxLength={maxLengths.char30}
                      autoFocus={true}
                      error={errors.holiday}
                    />

                    {/* <CustomEditDropdown
                      id="selectedOption"
                      name="selectedOption"
                      value={this.state.selectedOption}
                      onInputChangeHandler={this.onDropdownChange}
                      dropDownToggler={this.dropDownToggler}
                      dropDown={this.state.dropdown}
                      suggestionList={this.state.suggestionList}
                      dropDownSelect={this.dropDownSelect}
                      placeholder={"Eg. Sick Leave"}
                    /> */}
                  </div>
                </Fragment>
              ) : (
                ""
              )}
              {/* Duration of leave */}
              {prevNextIndex === 1 ? (
                <Fragment>
                  <label
                    htmlFor="date"
                    className="add-lead-label font-24-semibold"
                  >
                    Date Of Holiday?
                  </label>
                  <br />

                  {/* datepicker */}
                  <div className="d-flex align-items-center tasklist-duration-fields leads-title-block-container__date-picker mb-30">
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
                      selected={this.state.holidayDate}
                      onChange={this.handleChangeHolidayDate}
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </div>
                  {errors.holidayDate && (
                    <div className="is-invalid tasklist-duration-fields mt-0 mb-0">
                      {errors.holidayDate}
                    </div>
                  )}

                  {/* buttons */}
                  <div className="pt-25 text-right">
                    <button
                      // type="submit"
                      onClick={this.handleSubmit}
                      onKeyDown={this.handleSubmitOnKeyDown}
                      className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                    >
                      Save
                    </button>
                  </div>
                </Fragment>
              ) : (
                ""
              )}
            </form>
            {/*<AddLeadBlueProgressbar
              percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
              skipButtonFrom={1}
              prevNextIndex={prevNextIndex}
            />*/}
          </div>
        </div>
      </Fragment>
    );
  };

  renderAddLevesModel = () => {
    const { open } = this.state;
    return (
      <Fragment>
        <button
          onClick={this.onOpenModal}
          className={this.props.buttonClassName}
        >
          {this.props.buttonText}
        </button>

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
          {this.renderAddLeavesFields()}
        </Modal>
      </Fragment>
    );
  };

  render() {
    return <Fragment>{this.renderAddLevesModel()}</Fragment>;
  }
}

CalenderAddHoliday.defaultProps = {
  buttonClassName: "",
  buttonText: "+ Leave",
};

const mapStateToProps = (state) => ({
  apiStatus: state.auth.status,
});

export default connect(mapStateToProps, { addLeavesAction })(
  CalenderAddHoliday
);
