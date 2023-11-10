import React, { Component, Fragment } from "react";
import Slider from "react-slick";
import Select from "react-select";
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
  getAllFolloUps,
  deleteFollowUpAction,
  updateFollowUpAction,
} from "./../../../store/actions/calenderAction";
import isEmpty from "./../../../store/validations/is-empty";
import { validateAddFollowup } from "../../../store/validations/followUpValidations/followUpValidation";
import FollowUpCalendarEditModal from "./FollowUpCalendarEditModal";
import { statusEmpty } from "./../../../store/actions/authAction";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AddFollowUpInCalender from "./AddFollowUpInCalender";
import { getAllLeads } from "./../../../store/actions/leadAction";

// FETCH THE LIST FROM THE BACKEND
const list = ["Make a Call", "Email"];

const selectDropdownOptions = [
  { value: "Make a Call", label: "Make a Call" },
  { value: "Email", label: "Email" },
];

class FollowUpCalender extends Component {
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

  /*=============================
      Lifecycle Methods
  ==============================*/
  componentDidMount() {
    const allLeadQuery = {
      // pageNo: 10,
      // pageSize: 0,
      query: {},
    };
    this.props.getAllLeads(allLeadQuery);
    setInterval(this.renderCurrentTime, 60000);
    this.props.getAllFolloUps(
      dateFns.format(new Date(), "M"),
      dateFns.format(new Date(), "YYYY")
    );
  }

  // componentWillUnmount() {
  //   clearInterval(this.renderCurrentTime);
  // }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allFollowups) &&
      nextProps.allFollowups !== nextState.allFollowups
    ) {
      return {
        allFollowups: nextProps.allFollowups,
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
        errors: {},
      });
    }

    if (this.state.clickOnDate) {
      if (
        this.props.allFollowups[this.state.clickOnDate] !==
        this.state.dayViewFollowUps
      ) {
        console.log("calendar edit");
        this.setState({
          dayViewFollowUps: this.props.allFollowups[this.state.clickOnDate],
        });
      }
    }
    if (
      this.props.allFollowups !== this.state.allFollowups &&
      !this.state.hasSet
    ) {
      console.log(this.props.allFollowups[this.state.clickOnDate], "asd");
      this.setState({
        allFollowups: this.props.allFollowups,
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
        this.props.getAllFolloUps(
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
        this.props.getAllFolloUps(
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
    // console.log(new Date());
    let myDate = new Date();
    myDate = dateFns.parse(myDate);
    myDate = dateFns.format(myDate, "HH:mm aa");
    this.setState({ currentTime: myDate });
    // console.log(myDate);
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

              <td>
                {calenderView ? (
                  <AddFollowUpInCalender />
                ) : (
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
                )}
              </td>
            </tr>
          </tbody>
        </table>
        {calenderView && (
          <div className="calender-month-slider w-100 mt-0">
            <div className="day-and-date-view">
              <div className="current-date-time">
                <h3>{this.renderCurrentDate()}</h3>
                <p>{this.state.currentTime}</p>
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
    let allFollowups = this.state.allFollowups;

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
        let formattedDateFollowUpData = [];

        Object.keys(allFollowups).forEach((key) => {
          if (
            key === formattedDate &&
            iterationDayMonth === activeMonth &&
            activeYear === iterationDayYear
          ) {
            formattedDateFollowUpData = allFollowups[key];
            return null;
          }
        });
        days.push(
          <td
            onClick={this.openClickOnDay(
              formattedDateFollowUpData,
              day,
              formattedDate
            )}
            key={day}
            className={
              this.getTodaysDateTrueFalse(formattedDate) &&
              iterationDayMonth === activeMonth &&
              activeYear === iterationDayYear
                ? "current-date-border"
                : formattedDateFollowUpData.length !== 0
                ? "follo-up-border"
                : iterationDayMonth !== calenderActiveMonth
                ? "dayDisabled"
                : "dates"
            }
          >
            {formattedDateFollowUpData.length !== 0 ? (
              <span className="event-name">
                <p
                  onClick={this.goToDayViewHandler(
                    formattedDateFollowUpData,
                    day,
                    formattedDate
                  )}
                >
                  {formattedDateFollowUpData.length + " Follow Up's"}
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
          entityId: this.state.followUpData.assigned._id,
          followupAtDate: this.state.startDate,
          followupAtTime: this.state.startTime,
          assigned: this.state.followUpData.assigned._id,
          notification: true,
        };
        this.props.updateFollowUpAction(
          this.state.followUpData._id,
          newFollowUp,
          dateFns.format(new Date(), "M"),
          dateFns.format(new Date(), "YYYY")
        );
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

  /*==========================================
                dropdown
  ============================================*/

  onVisibleChange = (visible) => {
    console.log(visible);
  };

  onSelect = (followUpData, action) => {
    console.log("onselect ", followUpData);
    if (action === "delete") {
      this.props.deleteFollowUpAction(
        followUpData._id,
        dateFns.format(this.state.currentMonth, "M"),
        dateFns.format(this.state.currentMonth, "YYYY")
      );
      this.setState({
        allFollowUps: [],
      });
    } else if (action === "edit") {
      this.props.statusEmpty();
      let option = 0;
      if (followUpData.name === "Email") {
        option = 1;
      }
      this.setState({
        success: false,
        hasClosedModal: false,
        followUpData: followUpData,
        startDate: new Date(followUpData.followupAtDate),
        startTime: new Date(followUpData.followupAtTime),
        selectedOptionDropdown: selectDropdownOptions[option],
        selectedOption: selectDropdownOptions[option].value,
        addFollowUpPopUp: true,
        leadFollowUpNew: followUpData.name,
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
    const { clickOnDate, dayInDayView } = this.state;

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
            {!isEmpty(this.state.dayViewFollowUps) ? (
              this.state.dayViewFollowUps.map((followup, index) => {
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
                            <h4>{followup.assigned.name}</h4>
                            <p>
                              {followup.assigned.status === "CONVERTED"
                                ? "Converted"
                                : followup.assigned.status === "NEW_LEAD"
                                ? "New lead"
                                : followup.assigned.status === "ON_HOLD"
                                ? "On Hold"
                                : followup.assigned.status === "CONTACTED_LEADS"
                                ? "Contacted Lead"
                                : followup.assigned.status === "QUALIFIED_LEADS"
                                ? "Qualified Lead"
                                : followup.assigned.status === "OPPORTUNITIES"
                                ? "Oportunity"
                                : followup.assigned.status === "ARCHIVE"
                                ? "Archive"
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div>{this.renderFollowupDropdown(followup)}</div>
                      </div>
                      <div className="content-section">
                        <p>Time</p>
                        <span>
                          {dateFns.format(followup.followupAtTime, "h:mm a")}{" "}
                        </span>
                      </div>
                      <div className="content-section">
                        <p>Date</p>
                        <span>
                          {dateFns.format(followup.followupAtDate, "Do MMM")}{" "}
                        </span>
                      </div>
                      <div className="content-section">
                        <p> Followup type</p>
                        <span>{followup.name}</span>
                      </div>
                      {/* <h3>FollowUp Type: {followup.name}</h3>
                      <p>Lead Name:akshay</p>
                      <p>
                        followUp Date :{" "}
                        {dateFns.format(followup.followupAtDate, "Do MMM YYYY")}
                      </p>
                      <p>
                        followUp Time :{" "}
                        {dateFns.format(followup.followupAtTime, "hh A")}
                      </p> */}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no_data_in_calender">
                <h3>
                  No follow up's found on{" "}
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
    console.log(formattedDate);
    this.setState({
      calenderView: false,
      dayViewFollowUps: data,
      clickOnDate: formattedDate,
    });
  };

  openClickOnDay = (data, day, formattedDate) => (e) => {
    console.log(day);
    this.setState({
      calenderView: false,
      dayViewFollowUps: data,
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
    // console.log(this.state.allFollowups);
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
  allFollowups: state.calender.allFollowUps,
  apiStatus: state.auth.status,
});

export default connect(mapStateToProps, {
  getAllFolloUps,
  deleteFollowUpAction,
  updateFollowUpAction,
  statusEmpty,
  getAllLeads,
})(FollowUpCalender);
