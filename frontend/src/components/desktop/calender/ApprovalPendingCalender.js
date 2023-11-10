import React, { Component, Fragment } from "react";
import Select from "react-select";
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
  getAllPendingLeaves,
  approvePendingLeaves,
  acceptApprovalPending,
} from "./../../../store/actions/calenderAction";
import isEmpty from "./../../../store/validations/is-empty";
import { validateEditMeetingFollowup } from "../../../store/validations/followUpValidations/editFollowupMeeting";
import FollowUpCalendarEditModal from "./FollowUpCalendarEditModal";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

// FETCH THE LIST FROM THE BACKEND
// const list = ["Make a Call", "Email", "Meeting"];
const selectDropdownOptions = [
  { value: "Make a Call", label: "Make a Call" },
  { value: "Email", label: "Email" },
  { value: "Meeting", label: "Meeting" },
];

// remove after integration
const followup = [];

class ApprovalPendingCalender extends Component {
  constructor() {
    super();
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      calenderView: true,
      allPendingLeaves: [],
      dayViewPendingLeaves: [],
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
    };
  }

  /*=============================
      Lifecycle Methods
  ==============================*/
  componentDidMount() {
    this.props.getAllPendingLeaves(
      dateFns.format(new Date(), "M"),
      dateFns.format(new Date(), "YYYY")
    );
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allPendingLeaves) &&
      nextProps.allPendingLeaves !== nextState.allPendingLeaves
    ) {
      return {
        allPendingLeaves: nextProps.allPendingLeaves,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.state.clickOnDate) {
      if (
        this.props.allPendingLeaves[this.state.clickOnDate] !==
        this.state.dayViewPendingLeaves
      ) {
        console.log("calendar edit");
        this.setState({
          dayViewPendingLeaves:
            this.props.allPendingLeaves[this.state.clickOnDate],
        });
      }
    }
    if (
      this.props.allPendingLeaves !== this.state.allPendingLeaves &&
      !this.state.hasSet
    ) {
      console.log(this.props.allPendingLeaves[this.state.clickOnDate], "asd");
      this.setState({
        allPendingLeaves: this.props.allPendingLeaves,
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

  subMonthHanlder = () => {
    this.setState(
      {
        currentMonth: dateFns.subMonths(this.state.currentMonth, 1),
      },
      () =>
        this.props.getAllPendingLeaves(
          dateFns.format(this.state.currentMonth, "M")
        )
    );
  };

  addMonthHandler = () => {
    this.setState(
      {
        currentMonth: dateFns.addMonths(this.state.currentMonth, 1),
      },
      () =>
        this.props.getAllPendingLeaves(
          dateFns.format(this.state.currentMonth, "M")
        )
    );
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

  /*===========================
      Button Events Handlers    
  ============================*/

  rejectHandler = (leaveData) => (e) => {
    e.preventDefault();
    console.log(leaveData);
    const rejectLeave = {
      leaveType: leaveData.leaveType,
      leaveStatus: "REJECTED",
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      reason: leaveData.reason,
    };
    this.props.approvePendingLeaves(
      leaveData._id,
      rejectLeave,
      "Leave Rejected",
      dateFns.format(new Date(), "M"),
      dateFns.format(new Date(), "YYYY")
    );
  };

  acceptHandler = (leaveData) => (e) => {
    e.preventDefault();
    console.log(leaveData);
    const approveLeave = {
      leaveType: leaveData.leaveType,
      leaveStatus: "APPROVED",
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      reason: leaveData.reason,
    };
    this.props.acceptApprovalPending(
      leaveData._id,
      approveLeave,
      dateFns.format(new Date(), "M"),
      dateFns.format(new Date(), "YYYY")
    );
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
                  <button onClick={this.subMonthHanlder}>
                    <i className="fa fa-arrow-left" />
                  </button>
                  {dateFns.format(this.state.currentMonth, "MMMM YYYY")}
                  <button onClick={this.addMonthHandler}>
                    <i className="fa fa-arrow-right" />
                  </button>
                </td>
              ) : (
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
    let allPendingLeaves = this.state.allPendingLeaves;
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
        let iterationDayYear = dateFns.getYear(day);
        let activeYear = dateFns.getYear(Date.now());

        let iterationDayMonth = dateFns.getMonth(day);
        let activeMonth = dateFns.getMonth(Date.now());
        let calenderActiveMonth = dateFns.getMonth(currentMonth);

        formattedDate = dateFns.format(day, dateFormat);
        let formattedDateApprovalPending = [];
        Object.keys(allPendingLeaves).forEach((key) => {
          if (
            key === formattedDate &&
            iterationDayMonth === activeMonth &&
            activeYear === iterationDayYear
          ) {
            formattedDateApprovalPending = allPendingLeaves[key];
            return null;
          }
        });
        days.push(
          <td
            onClick={this.openClickOnDay(
              formattedDateApprovalPending,
              day,
              formattedDate
            )}
            key={day}
            className={
              this.getTodaysDateTrueFalse(formattedDate) &&
              iterationDayMonth === activeMonth &&
              activeYear === iterationDayYear
                ? "current-date-border"
                : formattedDateApprovalPending.length !== 0
                ? "follo-up-border"
                : iterationDayMonth !== calenderActiveMonth
                ? "dayDisabled"
                : "dates"
            }
          >
            {formattedDateApprovalPending.length !== 0 ? (
              <span className="event-name">
                <p
                  onClick={this.goToDayViewHandler(
                    formattedDateApprovalPending,
                    day,
                    formattedDate
                  )}
                >
                  {formattedDateApprovalPending.length + " Approval Pending"}
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
    console.log(this.state);

    const { errors, isValid } = validateEditMeetingFollowup(this.state);
    if (!isValid && this.state.selectedOption === "Meeting") {
      this.setState({ errors });
    } else {
      // console.log(this.state.meetingAt);
      // if (this.state.selectedOption === "Meeting") {
      //   const newMeeting = {
      //     subject: this.state.selectedOption,
      //     meetingDate: this.state.startDate,
      //     meetingTime: this.state.startTime,
      //     location: this.state.followUpLocation,
      //     assigned: leadData._id
      //   };
      //   this.props.addLeadMeetingsAction(newMeeting);
      // } else {
      //   const newFollowUp = {
      //     name: this.state.selectedOption,
      //     entityType: "LEAD",
      //     entityId: leadData._id,
      //     followupAtDate: this.state.startDate,
      //     followupAtTime: this.state.startTime,
      //     assigned: leadData._id,
      //     notification: true
      //   };

      //   this.props.addFollowUpLead(newFollowUp);
      // }
      this.setState({
        success: true,
      });
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
    });
  };

  onSelectDropdownSelect = (e) => {
    this.setState({
      selectedOption: e.value,
      selectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
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

  onSelect = (followUpData, action) => {
    console.log("onselect ", followUpData);
    if (action === "delete") {
      this.props.deleteFollowUpAction(followUpData._id);
    } else if (action === "edit") {
      this.setState({
        addFollowUpPopUp: true,
      });
    }
  };

  renderFollowupDropdown = (followUpData) => {
    const menu = (
      <Menu>
        <MenuItem onClick={() => this.onSelect(followUpData, "edit")}>
          {/* <FollowUpCalendarEditModal /> */}
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => this.onSelect(followUpData, "delete")}>
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

    let dataToken = JSON.parse(localStorage.getItem("Data"));
    return (
      <div className="container day-view-container">
        {/* <Slider {...settings}>
          {days.map((day, index) => {
            return day;
          })}
        </Slider> */}
        <div className="container">
          <div className="row">
            {!isEmpty(this.state.dayViewPendingLeaves) ? (
              this.state.dayViewPendingLeaves.map((pendingLeave, index) => {
                return (
                  <div key={index} className="col-md-4 employee-appreoval-card">
                    <div className="card">
                      <div className="card-header card-info-section-emp">
                        <div className="card-info-section-emp__1">
                          <div>
                            <img
                              src={`https://myrltest.dominate.ai${pendingLeave.user.profileImage}&token=${dataToken.token}`}
                              alt="profile"
                              className="employee-appreoval-card__profile-img"
                            />
                          </div>
                          <div>
                            <h3>{pendingLeave.user.name}</h3>
                            <p>{pendingLeave.user.jobTitle}</p>
                          </div>
                        </div>
                        {/* <div>{this.renderFollowupDropdown(followup)}</div> */}
                      </div>
                      <div className="card-body">
                        <div className="leave-type-and-time">
                          <h4>Leave Type</h4>

                          <p>
                            {pendingLeave.leaveType === "HOLIDAY"
                              ? "Holiday"
                              : pendingLeave.leaveType === "SICK_LEAVE"
                              ? "Sick Leave"
                              : pendingLeave.leaveType === "PAID_LEAVE"
                              ? ""
                              : ""}
                          </p>
                        </div>
                        <div className="leave-type-and-time">
                          <h4>Duration</h4>

                          <p>{`${dateFns.format(
                            pendingLeave.fromDate,
                            "Do MMM"
                          )} to ${dateFns.format(
                            pendingLeave.toDate,
                            "Do MMM"
                          )} `}</p>
                        </div>

                        <h4 style={{ textAlign: "left" }}>Description</h4>
                        <p style={{ textAlign: "left" }}>
                          {pendingLeave.reason}
                        </p>
                      </div>
                      <div className="card-footer">
                        {pendingLeave.leaveStatus === "APPROVED" ? (
                          <button>Approved</button>
                        ) : pendingLeave.leaveStatus === "REJECTED" ? (
                          <button>Rejected</button>
                        ) : (
                          <Fragment>
                            <button onClick={this.rejectHandler(pendingLeave)}>
                              Reject
                            </button>
                            <button onClick={this.acceptHandler(pendingLeave)}>
                              Accept
                            </button>
                          </Fragment>
                        )}
                      </div>
                    </div>
                  </div>
                  // <div className="col-md-4" key={index}>
                  //   <div
                  //     className="day-view-followuplist"
                  //     style={{ marginTop: "30px" }}
                  //   >
                  //     <h3>FollowUp Type: {pendingLeave.name}</h3>
                  //     <p>
                  //       followUp Date :{" "}
                  //       {dateFns.format(
                  //         pendingLeave.followupAtDate,
                  //         "Do MMM YYYY"
                  //       )}
                  //     </p>
                  //     <p>
                  //       followUp Time :{" "}
                  //       {dateFns.format(pendingLeave.followupAtTime, "hh A")}
                  //     </p>
                  //   </div>
                  // </div>
                );
              })
            ) : (
              <div className="no_data_in_calender">
                <h3>
                  No approval pending found on{" "}
                  {dateFns.format(dayInDayView, "Do MMM")}{" "}
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
      dayViewPendingLeaves: data,
      clickOnDate: formattedDate,
    });
  };

  openClickOnDay = (data, day, formattedDate) => (e) => {
    console.log(day);
    this.setState({
      calenderView: false,
      dayViewPendingLeaves: data,
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
    // console.log(this.state.allPendingLeaves);
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
  allPendingLeaves: state.calender.pendingLeaves,
});

export default connect(mapStateToProps, {
  getAllPendingLeaves,
  approvePendingLeaves,
  acceptApprovalPending,
})(ApprovalPendingCalender);
