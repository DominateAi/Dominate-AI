import React, { Component, Fragment } from "react";
import dateFns from "date-fns";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import { validateAddFollowup } from "../../../store/validations/followUpValidations/followUpValidation";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import isEmpty from "../../../store/validations/is-empty";
import { updateFollowUpAction } from "./../../../store/actions/calenderAction";
import { connect } from "react-redux";

// FETCH THE LIST FROM THE BACKEND
const list = ["Make a Call", "Email"];

const selectDropdownOptions = [
  { value: "Make a Call", label: "Make a Call" },
  { value: "Email", label: "Email" },
];

export class CalendarEditFollowUp extends Component {
  constructor() {
    super();
    this.state = {
      currentTime: dateFns.format(new Date(), "HH:mm aa"),
      currentMonth: new Date(),
      selectedDate: new Date(),
      calenderView: true,
      allFollowups: [],
      dayViewFollowUps: [],

      /*======================
        eidt Follow up states
      =======================*/
      addFollowUpPopUp: false,
      selectedOptionDropdown: selectDropdownOptions[0],
      selectedOption: selectDropdownOptions[0].value,
      // dropdown: false,
      // suggestionList: list,
      startDate: new Date(),
      startTime: new Date(),
      followUpLocation: "",
      leadData: [],
      success: false,
      clickOnDate: "",
      errors: {},
      leadFollowUpNew: "Make a Call",
    };
  }

  componentDidMount() {
    const { followUpData } = this.props;
    if (!isEmpty(followUpData)) {
      // console.log(followUpData);
      this.setState({
        leadFollowUpNew:
          followUpData.type === "CALL"
            ? "Make a Call"
            : followUpData.type === "WHATSAPP"
            ? "Whatsapp"
            : followUpData.type === "EMAIL"
            ? "Email"
            : "SMS",
        startDate: new Date(followUpData.followupAtDate),
        startTime: new Date(followUpData.followupAtTime),
      });
    }
  }

  /*=================================
   follow up select On click Handler
  ==================================*/
  onClickFllowUpButton = (followup) => (e) => {
    e.preventDefault();
    console.log(followup);
    this.setState({
      leadFollowUpNew: followup,
    });
  };

  /*====================================
  edit Follow up form  handler
======================================*/

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

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

  callBackUpdate = (status) => {
    if (status === 200) {
      this.onCloseModal();
    }
  };

  handleSaveFollowUp = (e) => {
    e.preventDefault();
    const { followUpData, selectedDate } = this.props;
    console.log(this.state);

    const { errors, isValid } = validateAddFollowup(this.state);

    if (!isValid) {
      this.setState({ errors });
    } else {
      if (this.state.selectedOption === "Meeting") {
        const newMeeting = {
          subject: this.state.selectedOption,
          meetingDate: this.state.startDate,
          meetingTime: this.state.startTime,
          location: this.state.followUpLocation,
          assigned: this.state.followUpData.assigned._id,
        };
        this.props.addLeadMeetingsAction();
      } else {
        const newFollowUp = {
          name: this.state.leadFollowUpNew,
          type:
            this.state.leadFollowUpNew === "SMS"
              ? "SMS"
              : this.state.leadFollowUpNew === "Email"
              ? "EMAIL"
              : this.state.leadFollowUpNew === "Whatsapp"
              ? "WHATSAPP"
              : "CALL",
          entityType: "LEAD",
          entityId: followUpData.assigned._id,
          followupAtDate: this.state.startDate,
          followupAtTime: this.state.startTime,
          assigned: !isEmpty(followUpData.assigned)
            ? followUpData.assigned._id
            : followUpData.assignedPipelead._id,
          assignedPipelead: !isEmpty(followUpData.assigned)
            ? followUpData.assigned._id
            : followUpData.assignedPipelead._id,
          notification: true,
        };
        this.props.updateFollowUpAction(
          followUpData._id,
          newFollowUp,
          dateFns.format(selectedDate, "M"),
          dateFns.format(selectedDate, "YYYY"),
          dateFns.format(selectedDate, "D"),
          this.callBackUpdate
        );
      }
    }
  };

  onOpenModal = () => {
    this.setState({
      addFollowUpPopUp: true,
    });
  };

  onCloseModal = () => {
    this.setState({
      addFollowUpPopUp: false,
      errors: {},
    });
  };

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

  /*===============================
     Render edit Follow up form 
  ================================*/

  renderEditFolloupFields = () => {
    const { followUpData } = this.props;
    const { selectedOption, leadData, addFollowUpPopUp, errors } = this.state;
    // console.log(this.state.selectedOption);
    return (
      <>
        <button
          className={this.props.buttonClassName}
          onClick={this.onOpenModal}
        >
          {this.props.buttonText}
        </button>

        <Modal
          open={addFollowUpPopUp}
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
          <Fragment>
            <div className="add-lead-modal-container add-lead-modal-container--followUp">
              <h1 className="font-21-bold mb-30">
                Edit Follow up for{" "}
                {!isEmpty(followUpData.assigned)
                  ? followUpData.assigned.name
                  : followUpData.assignedPipelead.name}
              </h1>
              <form noValidate onSubmit={this.handleSaveFollowUp}>
                <div className="add-lead-form-field-block add-follow-up-main-container">
                  <div className="follow-up-select mb-60">
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
                      error={errors.selectedOption}
                    /> */}

                    {/*<Select
                      className="react-select-follow-up-form-container"
                      classNamePrefix="react-select-follow-up-form"
                      isSearchable={false}
                      options={selectDropdownOptions}
                      value={this.state.selectedOptionDropdown}
                      onChange={(e) => this.onSelectDropdownSelect(e)}
                      placeholder="Select"
                    />*/}
                    <div className="set_level_and_status_of_lead set_level_and_status_of_lead--status set_level_and_status_of_lead--followup ml-0">
                      <p>Type of Follow up</p>
                      <button
                        onClick={this.onClickFllowUpButton("Make a Call")}
                        className={
                          this.state.leadFollowUpNew === "Make a Call"
                            ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                            : "select-lead-followup-by-btn"
                        }
                      >
                        {/* <span>📞</span> */}
                        Make a Call
                      </button>
                      <button
                        onClick={this.onClickFllowUpButton("Email")}
                        className={
                          this.state.leadFollowUpNew === "Email"
                            ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                            : "select-lead-followup-by-btn"
                        }
                      >
                        {/* <img
                          src={require("../../../assets/img/leads-new/email.png")}
                          alt="gradient"
                          className="add-leads-status-img"
                        />{" "} */}
                        <span>Email</span>
                      </button>
                      <button
                        onClick={this.onClickFllowUpButton("Whatsapp")}
                        className={
                          this.state.leadFollowUpNew === "Whatsapp"
                            ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                            : "select-lead-followup-by-btn"
                        }
                      >
                        {/* <img
                        src={require("../../../assets/img/leads-new/status/status3.png")}
                        alt="gradient"
                        className="add-leads-status-img"
                     />{" "}*/}
                        <span>Whatsapp</span>
                      </button>
                      <button
                        onClick={this.onClickFllowUpButton("SMS")}
                        className={
                          this.state.leadFollowUpNew === "SMS"
                            ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                            : "select-lead-followup-by-btn"
                        }
                      >
                        {/* <img
                          src={require("../../../assets/img/leads-new/sms.png")}
                          alt="sms"
                          className="add-leads-status-img"
                        />{" "} */}
                        <span>SMS</span>
                      </button>
                    </div>
                  </div>

                  <div className="follow-up-date-time-section mb-30">
                    <div className="follow-up-date leads-title-block-container__date-picker mr-30">
                      <label
                        htmlFor="date"
                        className="font-21-medium leads-follow-up-date-label-new-color"
                      >
                        {/*Date for scheduling*/}
                        Follow up Date
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
                      {errors.startDate && (
                        <div className="is-invalid tasklist-duration-fields mt-0 mb-0">
                          {errors.startDate}
                        </div>
                      )}
                    </div>
                    <div className="follow-up-time leads-title-block-container__date-picker">
                      <label
                        htmlFor="date"
                        className="font-21-medium leads-follow-up-time-label-new-color"
                      >
                        Time
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
                      {errors.startTime && (
                        <div className="is-invalid tasklist-duration-fields mt-0 mb-0">
                          {errors.startTime}
                        </div>
                      )}
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
                        <div className="is-invalid mt-20 ml-0 mb-0">
                          {errors.followUpLocation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* buttons */}
                <div className="pt-25 text-right">
                  <button
                    type="submit"
                    className="save_new_lead_button m-0"
                    //className="btn-funnel-view btn-funnel-view--files m-0"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </Fragment>
        </Modal>
      </>
    );
  };

  render() {
    return <>{this.renderEditFolloupFields()}</>;
  }
}

CalendarEditFollowUp.defaultProps = {
  buttonClassName: "",
  buttonText: "Edit",
};

const mapStateToProps = (state) => ({
  selectedDate: state.calender.selectedDate,
});

export default connect(mapStateToProps, { updateFollowUpAction })(
  CalendarEditFollowUp
);
