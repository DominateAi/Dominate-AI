import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import CustomEditDropdown from "../common/CustomEditDropdown";
import { connect } from "react-redux";
import { addLeavesAction } from "./../../../store/actions/calenderAction";
// import dateFns from "date-fns";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
// import Select from "react-select";

// started from 0
const totalFormSlides = 2;

// FETCH THE LIST FROM THE BACKEND
// const list = ["Sick Leave", "Paid Leave"];
const selectDropdownOptions = [
  { value: "Sick Leave", label: "Sick Leave" },
  { value: "Paid Leave", label: "Paid Leave" },
];

class CalenderAddLeave extends Component {
  state = {
    selectedOptionDropdown: selectDropdownOptions[0],
    selectedOption: selectDropdownOptions[0].value,
    // dropdown: false,
    // suggestionList: list,
    open: false,
    prevNextIndex: 0,
    leaveReason: "",
    fromDate: new Date(),
    toDate: new Date(),
    success: false,
  };

  /*=================================
        Lifecycle Methods
  ==================================*/

  /*===============================
    custom edit dropdown
  ================================*/
  componentDidMount() {
    document.addEventListener("click", this.onDropdownClick);
    document.addEventListener("keypress", this.onDropdownKeyPress);
    // handle prev and next screen by keyboard
    document.addEventListener("keydown", this.handleMainDivKeyDown);
  }

  componentWillUnmount() {
    // document.removeEventListener("click", this.onDropdownClick);
    // document.removeEventListener("keypress", this.onDropdownKeyPress);
    // handle prev and next screen by keyboard
    document.removeEventListener("keydown", this.handleMainDivKeyDown);
  }

  onSelectDropdownSelect = (e) => {
    this.setState({
      selectedOption: e.value,
      selectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  // onDropdownKeyPress = e => {
  //   if (this.state.dropdown) {
  //     if (e.keyCode === 13) {
  //       this.dropDownToggler();
  //     }
  //   }
  // };

  // onDropdownClick = e => {
  //   if (this.state.dropdown) {
  //     if (!document.getElementById("selectedOption").contains(e.target)) {
  //       this.dropDownToggler();
  //     }
  //   }
  // };

  // onDropdownChange = e => {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   });
  // };

  // dropDownToggler = e => {
  //   this.setState({
  //     dropdown: !this.state.dropdown
  //   });
  // };

  // dropDownSelect = value => e => {
  //   this.setState({
  //     selectedOption: value,
  //     dropdown: !this.state.dropdown
  //   });
  // };

  handleChangeFromDate = (date) => {
    if (date === null) {
      this.setState({
        fromDate: new Date(),
      });
    } else {
      this.setState({
        fromDate: date,
      });
    }
  };

  handleChangeToDate = (date) => {
    if (date === null) {
      this.setState({
        toDate: new Date(),
      });
    } else {
      this.setState({
        toDate: date,
      });
    }
  };

  /*============================
        Model Event Handlers
    ===============================*/

  onOpenModal = () => {
    this.setState({ open: true, success: false, hasmodalclose: false });
  };

  onCloseModal = () => {
    this.setState({
      selectedOptionDropdown: selectDropdownOptions[0],
      selectedOption: selectDropdownOptions[0].value,
      // dropdown: false,
      // suggestionList: list,
      followUpLocation: "",
      open: false,
      prevNextIndex: 0,
      leaveReason: "",
      fromDate: new Date(),
      toDate: new Date(),
    });
  };

  handleMainDivKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    // for react-select dropdown preventDefault on enter
    if (keyCode === 13 && this.state.prevNextIndex === 1) {
      e.preventDefault();
    }
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
    if (keyCode === 13 && this.state.prevNextIndex !== 1) {
      e.preventDefault();
      this.handleNext();
    }
  };

  handleNext = () => {
    this.setState({
      prevNextIndex:
        this.state.prevNextIndex < totalFormSlides
          ? this.state.prevNextIndex + 1
          : this.state.prevNextIndex,
    });
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

  callBackAddLeave = (status) => {
    if (status === 200) {
      this.onCloseModal();
    }
  };

  handleSubmitFunctionMain = (e) => {
    const { selectedOption } = this.state;

    let newFromDate = this.state.fromDate.toISOString();
    let newtoDate = this.state.toDate.toISOString();

    const newLeave = {
      leaveType:
        selectedOption === "Paid Leave"
          ? "PAID_LEAVE"
          : selectedOption === "Sick Leave"
          ? "SICK_LEAVE"
          : "",
      leaveStatus: "PENDING",
      fromDate: newFromDate,
      toDate: newtoDate,
      reason: this.state.leaveReason,
      hidden: false,
    };

    this.props.addLeavesAction(newLeave, "Leave Added", this.callBackAddLeave);

    this.setState({
      success: true,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  /*=================================
      Render Add Leaves Model
  ===================================*/

  renderAddLeavesFields = () => {
    const { prevNextIndex } = this.state;
    return (
      <Fragment>
        <div className="add-lead-modal-container lead_page_component container-fluid pr-0">
          <h1 className="font-30-bold mb-61">New Leave</h1>
          <AddLeadBlueProgressbar
            percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
            skipButtonFrom={3}
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
                  <label
                    htmlFor="selectedOption"
                    className="add-lead-label font-24-semibold"
                  >
                    Type of Leave?
                  </label>
                  <br />
                  <div className="type-of-leave-select mb-30">
                    {/* <Select
                                        value={selectedOption.value}
                                        onChange={this.handleChangeSelect}
                                        options={options}
                                        placeholder="Select"
                                    /> */}

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
                      placeholder={"Eg. Sick Leave"}
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
                    Duration of leave?
                  </label>
                  <br />

                  {/* datepicker */}
                  <div className="tasklist-duration-fields leads-title-block-container__date-picker mb-30">
                    <span
                      className="font-24-semibold mr-30"
                      role="img"
                      aria-labelledby="Tear-Off Calendar"
                    >
                      {/* calendar */}
                      {/* &#x1F4C6; */}
                    </span>
                    <div className="leads-title-block-container__date-picker mr-0">
                      {/* datepicker */}
                      <DatePicker
                        selected={this.state.fromDate}
                        selectsStart
                        startDate={this.state.fromDate}
                        endDate={this.state.toDate}
                        onChange={this.handleChangeFromDate}
                        onChangeRaw={this.handleDateChangeRaw}
                      />
                      <span className="font-18-medium">to</span>
                      <DatePicker
                        selected={this.state.toDate}
                        selectsEnd
                        startDate={this.state.fromDate}
                        endDate={this.state.toDate}
                        onChange={this.handleChangeToDate}
                        minDate={this.state.fromDate}
                        onChangeRaw={this.handleDateChangeRaw}
                      />
                    </div>
                  </div>
                </Fragment>
              ) : (
                ""
              )}
              {/* Reasons Of Leave */}
              {prevNextIndex === 2 ? (
                <Fragment>
                  <div className="mb-30">
                    <label
                      htmlFor="leaveReason"
                      className="add-lead-label font-24-semibold"
                    >
                      Reasons for leave?
                      <span className="font-21-light"> &#40;if any&#41;</span>
                    </label>
                    <br />
                    <textarea
                      rows="6"
                      id="leaveReason"
                      name="leaveReason"
                      className="add-lead-input-field font-18-regular"
                      placeholder="Eg. The weather's good"
                      value={this.state.leaveReason}
                      onChange={this.handleChange}
                    />
                  </div>
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
              skipButtonFrom={2}
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

CalenderAddLeave.defaultProps = {
  buttonClassName: "",
  buttonText: "+ Leave",
};

const mapStateToProps = (state) => ({
  apiStatus: state.auth.status,
});

export default connect(mapStateToProps, { addLeavesAction })(CalenderAddLeave);
