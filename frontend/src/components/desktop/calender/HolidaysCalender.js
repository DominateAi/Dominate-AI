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
import CalenderAddHoliday from "./CalenderAddHoliday";
import { connect } from "react-redux";
import {
  getAllHolidays,
  deleteHolidayAction,
  updateHolidayAction,
  getAllHolidaysInYear,
} from "./../../../store/actions/calenderAction";
import isEmpty from "./../../../store/validations/is-empty";
import { validateAddHoliday } from "../../../store/validations/holidayValidation/holidayValidation";
import FollowUpCalendarEditModal from "./FollowUpCalendarEditModal";
import { statusEmpty } from "./../../../../src/store/actions/authAction";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

// FETCH THE LIST FROM THE BACKEND
const list = ["Make a Call", "Email", "Meeting"];

// remove after integration
const followup = [];

// started from 0
const totalFormSlides = 1;

class HolidaysCalender extends Component {
  constructor() {
    super();
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      calenderView: true,
      allHolidays: [],
      dayViewHolidays: [],
      /*======================
        eidt Follow up states
      =======================*/

      dropdown: false,
      leadData: [],
      success: false,
      /*=======================
          edit Holiday
      ========================*/
      editHolidayPopup: false,
      prevNextIndex: 0,
      holidayDate: new Date(),
      holiday: "",
      clickOnDate: "",
      errors: {},
    };
  }

  /*=============================
      Lifecycle Methods
  ==============================*/
  componentDidMount() {
    this.props.getAllHolidays(
      dateFns.format(new Date(), "M"),
      dateFns.format(new Date(), "YYYY")
    );
    this.props.getAllHolidaysInYear(dateFns.format(new Date(), "YYYY"));
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allHolidays) &&
      nextProps.allHolidays !== nextState.allHolidays
    ) {
      return {
        allHolidays: nextProps.allHolidays,
      };
    }

    if (
      !isEmpty(nextProps.allHolidaysInYear) &&
      nextProps.allHolidaysInYear !== nextState.allHolidaysInYear
    ) {
      return {
        allHolidaysInYear: nextProps.allHolidaysInYear,
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
        editHolidayPopup: false,
        hasClosedModal: true,
      });
    }

    if (this.state.clickOnDate) {
      if (
        this.props.allHolidays[this.state.clickOnDate] !==
        this.state.dayViewHolidays
      ) {
        console.log("calendar edit");
        this.setState({
          dayViewHolidays: this.props.allHolidays[this.state.clickOnDate],
        });
      }
    }
    if (
      this.props.allHolidays !== this.state.allHolidays &&
      !this.state.hasSet
    ) {
      // console.log(this.props.allHolidays[this.state.clickOnDate], "asd");
      this.setState({
        allHolidays: this.props.allHolidays,
        // hasSet: true
      });
    }

    if (
      this.props.allHolidaysInYear !== this.state.allHolidaysInYear &&
      !this.state.hasAllHolidaySet
    ) {
      // console.log(this.props.allHolidays[this.state.clickOnDate], "asd");
      this.setState({
        allHolidaysInYear: this.props.allHolidaysInYear,
        hasAllHolidaySet: true,
      });
    }
  }

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

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*============================
        Model Event Handlers
    ===============================*/

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({
      editHolidayPopup: false,
      // prevNextIndex: 0,
      hasClosedModal: false,
      // holidayDate: new Date(),
      success: false,
      hasmodalclose: false,
      errors: {},
    });
  };

  handlePrev = () => {
    this.setState({
      prevNextIndex: this.state.prevNextIndex - 1,
    });
  };

  // handle next on key enter
  onFormKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleNext();
    }
  };

  onFormKeyDownNew = (e) => {
    if (e.keyCode === 13 && e.target.name !== "SaveButtonNewEditForm") {
      e.preventDefault();
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
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    }
    if (this.state.prevNextIndex === 1) {
      if (errors.holidayDate) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      }
    }
  };

  /*================================
          form events
    =================================*/

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    const { holidayData } = this.state;

    const { isValid, errors } = validateAddHoliday(this.state);
    console.log(errors);
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
      };
      console.log(newLeave);
      this.props.updateHolidayAction(
        holidayData._id,
        newLeave,
        dateFns.format(new Date(), "M"),
        dateFns.format(new Date(), "YYYY")
      );
    }

    this.setState({
      success: true,
    });
  };

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
        this.props.getAllHolidays(
          dateFns.format(this.state.currentMonth, "M"),
          dateFns.format(new Date(), "YYYY")
        )
    );
  };

  addMonthHandler = () => {
    this.setState(
      {
        currentMonth: dateFns.addMonths(this.state.currentMonth, 1),
      },
      () =>
        this.props.getAllHolidays(
          dateFns.format(this.state.currentMonth, "M"),
          dateFns.format(new Date(), "YYYY")
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
                  <button onClick={this.subMonthHanlder}>
                    <i className="fa fa-arrow-left" />
                  </button>
                  {dateFns.format(this.state.currentMonth, "MMMM YYYY")}
                  <button onClick={this.addMonthHandler}>
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
                {this.props.userRole === "Administrator" && (
                  <CalenderAddHoliday />
                )}
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
    let allHolidays = this.state.allHolidays;

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
        let formattedDateHolidayData = [];
        Object.keys(allHolidays).forEach((key) => {
          if (
            key === formattedDate &&
            iterationDayMonth === activeMonth &&
            activeYear === iterationDayYear
          ) {
            formattedDateHolidayData = allHolidays[key];
            return null;
          }
        });
        days.push(
          <td
            onClick={this.openClickOnDay(
              formattedDateHolidayData,
              day,
              formattedDate
            )}
            key={day}
            className={
              this.getTodaysDateTrueFalse(formattedDate) &&
              iterationDayMonth === activeMonth &&
              activeYear === iterationDayYear
                ? "current-date-border"
                : formattedDateHolidayData.length !== 0
                ? "follo-up-border"
                : iterationDayMonth !== calenderActiveMonth
                ? "dayDisabled"
                : "dates"
            }
          >
            {formattedDateHolidayData.length !== 0 ? (
              <span className="event-name">
                <p
                  onClick={this.goToDayViewHandler(
                    formattedDateHolidayData,
                    day,
                    formattedDate
                  )}
                >
                  {/* {formattedDateHolidayData.length + " Meetings"} */}
                  {/* Holiday */}
                  {formattedDateHolidayData.length === 1
                    ? formattedDateHolidayData[0].reason
                    : formattedDateHolidayData.length + " Holiday"}
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
    this.setState(
      {
        startTime: time,
      }
      // () => console.log(this.state.startTime)
    );
  };

  handleChangeDate = (date) => {
    this.setState(
      {
        startDate: date,
      }
      // () => console.log(this.state.startDate)
    );
  };

  handleSaveFollowUp = (e) => {
    e.preventDefault();
    const { leadData } = this.state;
    console.log(this.state);
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
  };

  /*===============================
      Holiday Card Handler
  ================================*/
  onDeleteClickHandler = (holidayData) => (e) => {
    e.preventDefault();
    // console.log(holidayData);
    this.props.deleteHolidayAction(
      holidayData._id,
      dateFns.format(new Date(), "M"),
      dateFns.format(new Date(), "YYYY")
    );
  };

  onEditClickHandler = (holidayData) => (e) => {
    e.preventDefault();
    // console.log(holidayData);
    this.props.statusEmpty();
    this.setState({
      holidayDate: new Date(holidayData.fromDate),
      holiday: holidayData.reason,
      editHolidayPopup: true,
      holidayData: holidayData,
      hasClosedModal: false,
      prevNextIndex: 0,
      success: false,
    });
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
    const { allHolidaysInYear, dayInDayView } = this.state;
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
    return (
      <div className="container day-view-container">
        {/* <Slider {...settings}>
          {days.map((day, index) => {
            return day;
          })}
        </Slider> */}
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <ul>
                <li className="holiday_card">
                  {!isEmpty(this.state.dayViewHolidays) ? (
                    this.state.dayViewHolidays.map((holiday, index) => {
                      return (
                        <div key={index}>
                          <div className="day-view-calender-card">
                            <div className="card-info-section">
                              <div className="card-info-section__1">
                                <div>
                                  <h4>{holiday.reason}</h4>
                                  <p>
                                    {dateFns.format(
                                      holiday.fromDate,
                                      "Do MMMM"
                                    )}
                                  </p>
                                  <p>
                                    {dateFns.format(holiday.fromDate, "dddd")}
                                  </p>
                                </div>
                                <div className="edit-delete-button-section">
                                  <i
                                    onClick={this.onEditClickHandler(holiday)}
                                    className="fa fa-pencil"
                                    aria-hidden="true"
                                  ></i>
                                  <i
                                    onClick={this.onDeleteClickHandler(holiday)}
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no_data_in_calender">
                      <h3>
                        No Holidays found on{" "}
                        {dateFns.format(dayInDayView, "Do MMM")}{" "}
                      </h3>
                    </div>
                  )}
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <div className="all-holiday-list-year-section">
                <h2>
                  All holiday of{" "}
                  {dateFns.format(this.state.currentMonth, "YYYY")}
                </h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">National Holiday</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isEmpty(allHolidaysInYear)
                      ? allHolidaysInYear.map((holiday, index) => {
                          return (
                            <tr key={index}>
                              <td>{holiday.reason}</td>
                              <td>
                                {dateFns.format(holiday.fromDate, "Do MMMM")}
                              </td>
                            </tr>
                          );
                        })
                      : "Noholiday Found"}

                    {/* <tr>
                      <td>Holiday</td>
                      <td>03 March</td>
                    </tr>
                    <tr>
                      <td>Holiday</td>
                      <td>03 March</td>
                    </tr>
                    <tr>
                      <td>Holiday</td>
                      <td>03 March</td>
                    </tr>
                    <tr>
                      <td>Holiday</td>
                      <td>03 March</td>
                    </tr>
                    <tr>
                      <td>Holiday</td>
                      <td>03 March</td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
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
      dayViewHolidays: data,
      clickOnDate: formattedDate,
    });
  };

  openClickOnDay = (data, day, formattedDate) => (e) => {
    console.log(day);
    this.setState({
      calenderView: false,
      dayViewHolidays: data,
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

  /*===================================
      Render edit Holiday modal 
  ===================================*/

  // renderEditHolidayModalBlock = () => {
  //   const { errors, prevNextIndex } = this.state;
  //   return (
  //     <div className="add-lead-form-field-block">
  //       {/* prev next arrows */}
  //       <div className="add-lead-arrows">
  //         {prevNextIndex <= 0 ? (
  //           ""
  //         ) : (
  //           <img
  //             src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
  //             alt="previous"
  //             className="add-lead-prev-icon"
  //             onClick={this.handlePrev}
  //           />
  //         )}

  //         {prevNextIndex >= totalFormSlides ? (
  //           ""
  //         ) : (
  //           <img
  //             src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
  //             alt="previous"
  //             className="add-lead-next-icon"
  //             onClick={this.handleNext}
  //           />
  //         )}
  //       </div>

  //       {/* form */}
  //       <form onSubmit={this.handleSubmit} onKeyDown={this.onFormKeyDown}>
  //         {/* name */}
  //         {prevNextIndex === 0 ? (
  //           <Fragment>
  //             <label
  //               htmlFor="selectedOption"
  //               className="add-lead-label font-24-semibold"
  //             >
  //               Name of Holiday
  //             </label>
  //             <br />
  //             <div className="type-of-leave-select mb-30">
  //               {/* <Select
  //                             value={selectedOption.value}
  //                             onChange={this.handleChangeSelect}
  //                             options={options}
  //                             placeholder="Select"
  //                         /> */}

  //               {/* <input readOnly className="invisible d-none" autoFocus /> */}

  //               <input
  //                 className="holiday_input"
  //                 placeholder="e.g. National Holiday"
  //                 type="text"
  //                 name="holiday"
  //                 id="holiday"
  //                 value={this.state.holiday}
  //                 onChange={this.onChangeHandler}
  //                 autoFocus={true}
  //               />
  //               {errors.holiday && (
  //                 <div className="is-invalid add-lead-form-field-errors ml-4">
  //                   {errors.holiday}
  //                 </div>
  //               )}

  //               {/* <CustomEditDropdown
  //           id="selectedOption"
  //           name="selectedOption"
  //           value={this.state.selectedOption}
  //           onInputChangeHandler={this.onDropdownChange}
  //           dropDownToggler={this.dropDownToggler}
  //           dropDown={this.state.dropdown}
  //           suggestionList={this.state.suggestionList}
  //           dropDownSelect={this.dropDownSelect}
  //           placeholder={"Eg. Sick Leave"}
  //         /> */}
  //             </div>
  //           </Fragment>
  //         ) : (
  //           ""
  //         )}
  //         {/* Duration of leave */}
  //         {prevNextIndex === 1 ? (
  //           <Fragment>
  //             <label htmlFor="date" className="add-lead-label font-24-semibold">
  //               Date Of Holiday?
  //             </label>
  //             <br />

  //             {/* datepicker */}
  //             <div className="d-flex align-items-center tasklist-duration-fields leads-title-block-container__date-picker mb-30">
  //               <span
  //                 className="font-24-semibold mr-30"
  //                 role="img"
  //                 aria-labelledby="Tear-Off Calendar"
  //               >
  //                 {/* calendar */}
  //                 {/* &#x1F4C6; */}
  //               </span>
  //               {/* datepicker */}
  //               <DatePicker
  //                 selected={this.state.holidayDate}
  //                 onChange={this.handleChangeHolidayDate}
  //               />
  //             </div>
  //             {errors.holidayDate && (
  //               <div className="is-invalid tasklist-duration-fields mt-0 mb-0">
  //                 {errors.holidayDate}
  //               </div>
  //             )}

  //             {/* buttons */}
  //             <div className="pt-25 text-right">
  //               <button
  //                 type="submit"
  //                 className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
  //               >
  //                 Save
  //               </button>
  //             </div>
  //           </Fragment>
  //         ) : (
  //           ""
  //         )}
  //       </form>
  //       <AddLeadBlueProgressbar
  //         percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
  //         skipButtonFrom={1}
  //         prevNextIndex={prevNextIndex}
  //       />
  //     </div>
  //   );
  // };

  /*=======================================
      Render edit Holiday modal block New
  ========================================*/

  renderEditHolidayModalBlockNew = () => {
    const { errors, prevNextIndex } = this.state;
    return (
      <div className="add-lead-form-field-block new-edit-lead-form-row__holiday-edit">
        {/* form */}
        <form
          noValidate
          onSubmit={this.handleSubmit}
          onKeyDown={this.onFormKeyDownNew}
        >
          {/* name */}
          <div className="new-edit-lead-form-row">
            <label
              htmlFor="selectedOption"
              className="add-lead-label font-24-semibold"
            >
              Name
            </label>
            <br />
            <div className="type-of-leave-select mb-30">
              {/* <Select
                              value={selectedOption.value}
                              onChange={this.handleChangeSelect}
                              options={options}
                              placeholder="Select"
                          /> */}

              {/* <input readOnly className="invisible d-none" autoFocus /> */}

              <input
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
              )}

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
          </div>

          {/* Duration of leave */}
          <div className="new-edit-lead-form-row">
            <label htmlFor="date" className="add-lead-label font-24-semibold">
              Date
            </label>
            <br />
            <div>
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
            </div>
          </div>

          {/* buttons */}
          <div className="pt-25 text-right">
            <button
              name="SaveButtonNewEditForm"
              type="submit"
              className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  };

  /*===================================
      Render edit Holiday model 
  ===================================*/

  renderEditHolidayModel = () => {
    const { editHolidayPopup } = this.state;
    const { errors, prevNextIndex } = this.state;
    return (
      <Fragment>
        <Modal
          open={editHolidayPopup}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal:
              "customModal customModal--addLead customModal--editLeadNew--emp",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="add-lead-modal-container container-fluid pr-0">
            <h1 className="font-30-bold mb-61">Edit Holiday</h1>

            {/* {this.renderEditHolidayModalBlock()} */}
            {this.renderEditHolidayModalBlockNew()}
          </div>
        </Modal>
      </Fragment>
    );
  };

  render() {
    const { calenderView } = this.state;
    // console.log(this.state.allHolidaysInYear);

    return (
      <Fragment>
        {this.renderEditHolidayModel()}
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
  allHolidays: state.calender.allHolidays,
  userRole: state.auth.user.role.name,
  allHolidaysInYear: state.calender.allHolidaysInYear,
  apiStatus: state.auth.status,
});

export default connect(mapStateToProps, {
  getAllHolidays,
  deleteHolidayAction,
  updateHolidayAction,
  getAllHolidaysInYear,
  statusEmpty,
})(HolidaysCalender);
