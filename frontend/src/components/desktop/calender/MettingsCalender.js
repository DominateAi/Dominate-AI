import React, { Component, Fragment } from "react";
import Slider from "react-slick";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import dateFns from "date-fns";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import CustomEditDropdown from "../common/CustomEditDropdown";
import PopupInputFields from "../common/PopupInputFields";
import CalenderAddLeave from "./CalenderAddLeave";
import { connect } from "react-redux";
import {
  getUserAllMettings,
  deleteMeetingAction,
  updateMeetingAction,
} from "./../../../store/actions/calenderAction";
import isEmpty from "./../../../store/validations/is-empty";
import { validateEditMeetingFollowup } from "../../../store/validations/followUpValidations/editFollowupMeeting";
import FollowUpCalendarEditModal from "./FollowUpCalendarEditModal";
import { statusEmpty } from "./../../../store/actions/authAction";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

// FETCH THE LIST FROM THE BACKEND
const list = ["Make a Call", "Email", "Meeting"];

// remove after integration
const followup = [];

class MettingsCalender extends Component {
  constructor() {
    super();
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      calenderView: true,
      allMeetings: [],
      dayViewMeetings: [],
      /*======================
        eidt Follow up states
      =======================*/
      addFollowUpPopUp: false,
      selectedOption: list[2],
      dropdown: false,
      suggestionList: list,
      startDate: new Date(),
      startTime: new Date(),
      followUpLocation: "",
      leadData: [],
      success: false,
      clickOnDate: "",
      errors: {},
    };
  }

  /*=============================
      Lifecycle Methods
  ==============================*/
  componentDidMount() {
    this.props.getUserAllMettings(
      dateFns.format(new Date(), "M"),
      dateFns.format(new Date(), "YYYY")
    );
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allMeetings) &&
      nextProps.allMeetings !== nextState.allMeetings
    ) {
      return {
        allMeetings: nextProps.allMeetings,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (
      this.props.apiStatus &&
      this.state.success &&
      !this.state.hasClosedModal
    ) {
      // this.onCloseModal();
      this.setState({
        addFollowUpPopUp: false,
        hasClosedModal: true,
      });
    }
    // console.log(this.props.allMeetings);

    if (this.state.clickOnDate) {
      if (
        this.props.allMeetings[this.state.clickOnDate] !==
        this.state.dayViewMeetings
      ) {
        console.log("calendar edit");
        this.setState({
          dayViewMeetings: this.props.allMeetings[this.state.clickOnDate],
        });
      }
    }
    if (
      this.props.allMeetings !== this.state.allMeetings &&
      !this.state.hasSet
    ) {
      console.log(this.props.allMeetings[this.state.clickOnDate], "asd");
      this.setState({
        allMeetings: this.props.allMeetings,
        hasSet: true,
      });
    }
  }

  /****************************
   *  handler event
   ***************************/
  dayViewHandler = () => {
    this.setState({
      calenderView: !this.state.calenderView,
    });
  };

  /*===============================
      Leaves duration events
  ================================*/
  handleChangeFromDate = (date) => {
    this.setState(
      {
        fromDate: date,
      },
      () => console.log(this.state.startDate)
    );
  };

  handleChangeToDate = (date) => {
    this.setState(
      {
        toDate: date,
      },
      () => console.log(this.state.toDate)
    );
  };

  /*================================
      Render Current Date and Time
  ==================================*/

  renderCurrentDate = () => {
    const myDate = dateFns.format(new Date(), "Do MMMM");
    return myDate;
  };

  renderCurrentTime = () => {
    const myDate = dateFns.format(this.state.currentMonth, "HH:mm aa");
    return myDate;
  };

  /*================================
        form events
  =================================*/

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    // alert(this.state.leadsWorkInCompanyName);
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*********************************
   * @DESC - RENDER NEXT, PREVIOUS
   * @DESC - AND CURRENT MONTH
   ********************************/
  renderHeaderCells = () => {
    const { calenderView, dayInDayView } = this.state;
    return (
      <Fragment>
        <table className="calender-month-slider mb-0" style={{ width: "100%" }}>
          <tbody>
            <tr>
              {calenderView ? (
                <td>
                  <button
                    onClick={() =>
                      this.setState({
                        currentMonth: dateFns.subMonths(
                          this.state.currentMonth,
                          1
                        ),
                      })
                    }
                  >
                    <i className="fa fa-arrow-left" />
                  </button>
                  {dateFns.format(this.state.currentMonth, "MMMM YYYY")}
                  <button
                    onClick={() =>
                      this.setState({
                        currentMonth: dateFns.addMonths(
                          this.state.currentMonth,
                          1
                        ),
                      })
                    }
                  >
                    <i className="fa fa-arrow-right" />
                  </button>
                </td>
              ) : (
                <td>
                  <div className="calender-month-slider w-100 mt-0 day_view_selected_date">
                    <div className="day-and-date-view">
                      <div className="current-date-time">
                        <h3>{dateFns.format(dayInDayView, "Do dddd")}</h3>
                      </div>
                      <div className="current-date-time">
                        {/* <CalenderAddLeave /> */}
                      </div>
                    </div>
                  </div>
                </td>
              )}
              {!calenderView && (
                <td>
                  <div className="calendar-day-month-view">
                    <p onClick={this.dayViewHandler}>
                      <span
                        className="font-24-semibold"
                        role="img"
                        aria-labelledby="Tear-Off Calendar"
                      >
                        {/* calendar */}
                        {/* &#x1F4C6; */}
                      </span>{" "}
                      {calenderView ? "Day View" : "Back to calender view"}
                    </p>
                  </div>
                </td>
              )}
            </tr>
          </tbody>
        </table>

        {calenderView && (
          <div className="calender-month-slider w-100 mt-0">
            <div className="day-and-date-view">
              <div className="current-date-time">
                <h3>{this.renderCurrentDate()}</h3>
                <p>{this.renderCurrentTime()}</p>
              </div>
              <div className="current-date-time">
                {/* <CalenderAddLeave /> */}
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  };

  /*********************************
   * @DESC - RENDER DATE CELLS
   *********************************/
  renderCells = () => {
    //@ We Require all the the meeting data, and current Month name
    let allMeetings = this.state.allMeetings;
    // console.log(allMeetings);
    //console.log(absentDays,attendanceDays);
    const { currentMonth } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        // console.log(day, currentMonth);
        let iterationDayYear = dateFns.getYear(day);
        let activeYear = dateFns.getYear(Date.now());

        let iterationDayMonth = dateFns.getMonth(day);
        let activeMonth = dateFns.getMonth(Date.now());
        let calenderActiveMonth = dateFns.getMonth(currentMonth);
        formattedDate = dateFns.format(day, dateFormat);
        let formattedDateMeetingData = [];
        Object.keys(allMeetings).forEach((key) => {
          if (
            key === formattedDate &&
            iterationDayMonth === activeMonth &&
            activeYear === iterationDayYear
          ) {
            formattedDateMeetingData = allMeetings[key];
            return null;
          }
        });
        // console.log(formattedDateMeetingData);
        days.push(
          <td
            onClick={this.openClickOnDay(
              formattedDateMeetingData,
              day,
              formattedDate
            )}
            key={day}
            className={
              this.getTodaysDateTrueFalse(formattedDate) &&
              iterationDayMonth === activeMonth &&
              activeYear === iterationDayYear
                ? "current-date-border"
                : formattedDateMeetingData.length !== 0
                ? "follo-up-border"
                : iterationDayMonth !== calenderActiveMonth
                ? "dayDisabled"
                : "dates"
            }
          >
            {formattedDateMeetingData.length !== 0 ? (
              <span className="event-name">
                <p
                  onClick={this.goToDayViewHandler(
                    formattedDateMeetingData,
                    day,
                    formattedDate
                  )}
                >
                  {formattedDateMeetingData.length + " Meetings"}
                </p>
              </span>
            ) : null}
            {formattedDate}
          </td>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(<tr key={day}>{days}</tr>);
      days = [];
    }
    const dateFormats = "ddd";
    const daysname = [];

    let startDay = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      daysname.push(
        <td key={i} className="text-center days_name">
          {dateFns.format(dateFns.addDays(startDay, i), dateFormats)}
        </td>
      );
    }
    return (
      <div className="table_responsive calender-date-section">
        <table className="table table-bordered my_calender_background">
          <tbody>
            <tr>{daysname}</tr>
            {rows}
          </tbody>
        </table>
      </div>
    );
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

  handleSaveFollowUp = (e) => {
    e.preventDefault();
    const { leadData } = this.state;

    const { errors, isValid } = validateEditMeetingFollowup(this.state);

    if (!isValid) {
      this.setState({ errors });
    } else {
      // console.log(this.state);
      // console.log(this.state.meetingAt);
      if (this.state.selectedOption === "Meeting") {
        const newMeeting = {
          subject: this.state.selectedOption,
          meetingDate: this.state.startDate,
          meetingTime: this.state.startTime,
          location: this.state.followUpLocation,
          assigned: this.state.followUpData.assigned._id,
        };
        this.props.updateMeetingAction(
          this.state.followUpData._id,
          newMeeting,
          dateFns.format(new Date(), "M"),
          dateFns.format(new Date(), "YYYY")
        );
      } else {
      }
    }
    this.setState({
      success: true,
    });
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

  onDropdownKeyPress = (e) => {
    if (this.state.dropdown) {
      if (e.keyCode === 13) {
        this.dropDownToggler();
      }
    }
  };

  onDropdownClick = (e) => {
    if (this.state.dropdown) {
      if (!document.getElementById("selectedOption").contains(e.target)) {
        this.dropDownToggler();
      }
    }
  };

  onDropdownChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  dropDownToggler = (e) => {
    this.setState({
      dropdown: !this.state.dropdown,
    });
  };

  dropDownSelect = (value) => (e) => {
    this.setState({
      selectedOption: value,
      dropdown: !this.state.dropdown,
    });
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*===============================
   Render edit Follow up form 
================================*/

  renderEditFolloupFields = () => {
    const { selectedOption, leadData, addFollowUpPopUp, errors } = this.state;
    // console.log(this.state.selectedOption);
    return (
      <>
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
                Edit Follow up for {leadData && leadData.name}
              </h1>
              <form noValidate onSubmit={this.handleSaveFollowUp}>
                <div className="add-lead-form-field-block add-follow-up-main-container">
                  <div className="follow-up-select mb-30">
                    {/* <input readOnly className="invisible d-none" autoFocus /> */}

                    {/* <CustomEditDropdown
                      id="selectedOption"
                      name="selectedOption"
                      value={this.state.selectedOption}
                      onInputChangeHandler={this.onDropdownChange}
                      dropDownToggler={this.dropDownToggler}
                      dropDown={this.state.dropdown}
                      suggestionList={this.state.suggestionList}
                      dropDownSelect={this.dropDownSelect}
                      placeholder={"Select"}
                    /> */}
                    <div className="row align-items-start justify-content-center main-dropdown-class dropdown-input-class">
                      Meeting
                    </div>
                  </div>

                  <div className="follow-up-date-time-section mb-30">
                    <div className="follow-up-date leads-title-block-container__date-picker">
                      <label htmlFor="date" className="font-21-medium">
                        Date for scheduling
                      </label>
                      <div>
                        <div className="d-flex align-items-center justify-content-end leads-title-block-container__date-picker mb-10 mx-0">
                          <span
                            className="font-24-semibold mr-30"
                            role="img"
                            aria-labelledby="Tear-Off Calendar"
                          >
                            {/* calendar */}
                            {/* &#x1F4C6; */}
                          </span>
                          <DatePicker
                            minDate={new Date()}
                            selected={this.state.startDate}
                            onChange={this.handleChangeDate}
                            onChangeRaw={this.handleDateChangeRaw}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="follow-up-time leads-title-block-container__date-picker">
                      <label htmlFor="date" className="font-21-medium">
                        Time for scheduling
                      </label>
                      <div>
                        <div className="d-flex align-items-center justify-content-end leads-title-block-container__date-picker mb-10 mx-0">
                          <span
                            className="font-24-semibold mr-30"
                            role="img"
                            aria-labelledby="clock"
                          >
                            {/* clock */}
                            {/* &#x1F552; */}
                          </span>
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
                        <div className="is-invalid tasklist-duration-fields mt-0 mb-0 ml-2">
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
                    className="btn-funnel-view btn-funnel-view--files m-0"
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

  /*==========================================
              dropdown
============================================*/

  onVisibleChange = (visible) => {
    console.log(visible);
  };

  onSelect = (meetingData, action) => {
    console.log("onselect ", meetingData);
    if (action === "delete") {
      this.props.deleteMeetingAction(
        meetingData._id,
        dateFns.format(this.state.currentMonth, "M"),
        dateFns.format(this.state.currentMonth, "YYYY")
      );
    } else if (action === "edit") {
      this.props.statusEmpty();
      this.setState({
        success: false,
        hasClosedModal: false,
        followUpData: meetingData,
        startDate: new Date(meetingData.meetingDate),
        startTime: new Date(meetingData.meetingTime),
        suggestionList: meetingData.subject,
        selectedOption: meetingData.subject,
        followUpLocation: meetingData.location,
        addFollowUpPopUp: true,
      });
    }
  };

  renderFollowupDropdown = (meetingData) => {
    const menu = (
      <Menu>
        <MenuItem onClick={() => this.onSelect(meetingData, "edit")}>
          {/* <FollowUpCalendarEditModal /> */}
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => this.onSelect(meetingData, "delete")}>
          Delete
        </MenuItem>
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={this.onVisibleChange}
      >
        <img
          className="edit-img-followup-card"
          src={require("./../../../assets/img/leads/edit-icon.png")}
          alt=""
        />
      </DropdownIcon>
    );
  };

  /*==========================================
              dropdown end
============================================*/

  /*=================================
          Render Day View
  ==================================*/

  renderDayView = () => {
    const { dayInDayView } = this.state;
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 7,
      slickGoTo: 3,
    };

    const { currentMonth } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    // tseting end

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        days.push(
          <div key={dateFormat + i} className="dates">
            {formattedDate}
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(<div key={day}>{days}</div>);
      // days = [];
    }
    return (
      <div className="container day-view-container">
        {/* <Slider {...settings}>
          {days.map((day, index) => {
            return day;
          })}
        </Slider> */}
        <div className="container">
          <div className="row">
            {!isEmpty(this.state.dayViewMeetings) ? (
              this.state.dayViewMeetings.map((meeting, index) => {
                return (
                  <div className="col-md-4" key={index}>
                    <div className="day-view-calender-card">
                      <div className="card-info-section">
                        <div className="card-info-section__1">
                          <img
                            src={require("../../../assets/img/leads/lead_default_img.svg")}
                            className="lead-list-view-img"
                            alt="lead"
                          />
                          <div>
                            <h4>{meeting.assigned.name}</h4>
                            <p>
                              {meeting.assigned.status === "CONVERTED"
                                ? "Converted"
                                : meeting.assigned.status === "NEW_LEAD"
                                ? "New lead"
                                : meeting.assigned.status === "ON_HOLD"
                                ? "On Hold"
                                : meeting.assigned.status === "CONTACTED_LEADS"
                                ? "Contacted Lead"
                                : meeting.assigned.status === "QUALIFIED_LEADS"
                                ? "Qualified Lead"
                                : meeting.assigned.status === "OPPORTUNITIES"
                                ? "Oportunity"
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div>{this.renderFollowupDropdown(meeting)}</div>
                      </div>
                      <div className="content-section">
                        <p>Time</p>
                        <span>
                          {dateFns.format(meeting.meetingTime, "h:mm a")}
                        </span>
                      </div>
                      <div className="content-section">
                        <p>Date</p>
                        <span>
                          {dateFns.format(meeting.meetingDate, "Do MMM")}
                        </span>
                      </div>
                      <div className="content-section">
                        <p>Location</p>
                        <span>{meeting.location}</span>
                      </div>
                    </div>
                    {/* <div
                      className="day-view-followuplist"
                      style={{ marginTop: "30px" }}
                    >
                      <h3>{meeting.subject}</h3>
                      <p>Lead Name:akshay</p>
                      <p>
                        Meeting Date :{" "}
                        {dateFns.format(meeting.meetingDate, "Do MMM YYYY")}
                      </p>
                      <p>
                        Meeting Time :{" "}
                        {dateFns.format(meeting.meetingTime, "hh A")}
                      </p>
                      <p>Location: {meeting.location}</p>
                    </div> */}
                  </div>
                );
              })
            ) : (
              <div className="no_data_in_calender">
                <h3>
                  No meetings found on {dateFns.format(dayInDayView, "Do MMM")}{" "}
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /*=====================================
     Go TO Day view
=======================================*/
  goToDayViewHandler = (data, day, formattedDate) => (e) => {
    console.log(data, day);
    this.setState({
      calenderView: false,
      dayViewMeetings: data,
      clickOnDate: formattedDate,
    });
  };

  openClickOnDay = (data, day, formattedDate) => (e) => {
    console.log(day);
    this.setState({
      calenderView: false,
      dayViewMeetings: data,
      clickOnDate: formattedDate,
      dayInDayView: day,
    });
  };

  /*===================================
      Get Date is todays date or not
  ====================================*/

  getTodaysDateTrueFalse = (day) => {
    const { currentMonth } = this.state;
    let todayDate = dateFns.format(currentMonth, "D");
    if (day == todayDate) {
      return true;
    }
    return false;
  };

  render() {
    const { calenderView } = this.state;
    // console.log(this.getCurrentMonthData());
    // console.log(this.state.allMeetings);
    return (
      <Fragment>
        {this.renderEditFolloupFields()}
        <div className="main-calender-container">
          <div className="row">
            {this.renderHeaderCells()}
            {calenderView ? this.renderCells() : this.renderDayView()}
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  allMeetings: state.calender.allMeetings,
  apiStatus: state.auth.status,
});

export default connect(mapStateToProps, {
  getUserAllMettings,
  deleteMeetingAction,
  updateMeetingAction,
  statusEmpty,
})(MettingsCalender);
