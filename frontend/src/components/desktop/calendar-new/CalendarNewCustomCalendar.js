import React, { Component, Fragment } from "react";
import Slider from "react-slick";
import dateFns from "date-fns";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";

import { connect } from "react-redux";
import {
  getAllFolloUps,
  getAllDataOfTheDay,
} from "../../../store/actions/calenderAction";
import { getAllDataCalenderWidget } from "../../../store/actions/dashBoardAction";
import isEmpty from "../../../store/validations/is-empty";
import {
  SET_DASHBOARD_CALENDER_WIDGET_CARD,
  SET_CALENDER_FOLLOWUP_MEET_OF_THAT_DAY,
  SET_CALENDER_FOLLOWUP_SELECTED_DAY,
  GET_ALL_FOLLOW_UPS,
  SET_SELECTED_DATE,
} from "../../../store/types";
import store from "../../../store/store";

class CalendarNewCustomCalendar extends Component {
  constructor() {
    super();
    this.state = {
      currentTime: dateFns.format(dateFns.parse(new Date(), "HH:mm aa")),
      currentMonth: new Date(),
      selectedDate: new Date(),
      calenderView: true,
      dashboardCalenderMeetFollowup: [],
      dayViewFollowUps: [],
      clickOnDate: "",
    };
  }

  /*=============================
      Lifecycle Methods
  ==============================*/
  componentDidMount() {
    this.props.getAllDataCalenderWidget(
      dateFns.format(new Date(), "M"),
      dateFns.format(new Date(), "YYYY")
    );
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.dashboardCalenderMeetFollowup) &&
      nextProps.dashboardCalenderMeetFollowup !==
        nextState.dashboardCalenderMeetFollowup
    ) {
      return {
        dashboardCalenderMeetFollowup: nextProps.dashboardCalenderMeetFollowup,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.state.clickOnDate) {
      if (
        this.props.dashboardCalenderMeetFollowup[this.state.clickOnDate] !==
        this.state.dayViewFollowUps
      ) {
        console.log("calendar edit");
        this.setState({
          dayViewFollowUps:
            this.props.dashboardCalenderMeetFollowup[this.state.clickOnDate],
        });
      }
    }
    if (
      this.props.dashboardCalenderMeetFollowup !==
        this.state.dashboardCalenderMeetFollowup &&
      !this.state.hasSet
    ) {
      console.log(
        this.props.dashboardCalenderMeetFollowup[this.state.clickOnDate],
        "asd"
      );
      this.setState({
        dashboardCalenderMeetFollowup: this.props.dashboardCalenderMeetFollowup,
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
        this.props.getAllDataCalenderWidget(
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
        this.props.getAllDataCalenderWidget(
          dateFns.format(this.state.currentMonth, "M"),
          dateFns.format(new Date(), "YYYY")
        )
    );
  };

  /*================================
      Render Current Date and Time
  ==================================*/

  renderCurrentDate = () => {
    const myDate = dateFns.format(new Date(), "Do MMMM");
    return myDate;
  };

  renderNewCalendarCurrentTime = () => {
    let newCalendarCurrentTimeVal = dateFns.format(new Date(), "hh:mm A");
    return newCalendarCurrentTimeVal;
  };

  renderCurrentTime = () => {
    // console.log(new Date());
    let myDate = new Date();
    myDate = dateFns.parse(myDate);
    myDate = dateFns.format(myDate, "HH:mm AA");
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

  /*********************************
   * @DESC - RENDER NEXT, PREVIOUS
   * @DESC - AND CURRENT MONTH
   ********************************/
  renderHeaderCells = () => {
    return (
      <Fragment>
        <table className="calender-month-slider mb-0" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>
                <button onClick={this.subMonthHanlder}>
                  <i className="fa fa-arrow-left" />
                </button>
                <span className="font-24-semibold">
                  {dateFns.format(this.state.currentMonth, "MMMM YYYY")}
                </span>
                <button onClick={this.addMonthHandler}>
                  <i className="fa fa-arrow-right" />
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <p className="current_date">{this.renderCurrentDate()}</p>
                <p className="new-calendar-current_time">
                  {this.renderNewCalendarCurrentTime()}
                  {/* 11:26 AM */}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </Fragment>
    );
  };

  renderDotsInDays = (formattedDateFollowUpData) => {
    let followup = false;
    let meeting = false;
    let holiday = false;
    formattedDateFollowUpData.forEach((ele) => {
      // console.log(ele);
      if (ele.name !== undefined) {
        followup = true;
      } else if (ele.leaveType !== undefined) {
        holiday = true;
      } else if (ele.subject !== undefined) {
        meeting = true;
      }
    });
    return (
      <>
        {" "}
        <span
          className={
            followup === true ? "event-name followup_dot_color" : "hidden_dot"
          }
        >
          <img
            src={require("./../../../assets/img/calendar-new/followup_dot.png")}
            alt={""}
          />
        </span>{" "}
        <span
          className={
            holiday === true ? "event-name holiday_dot_color" : "hidden_dot"
          }
        >
          <img
            src={require("./../../../assets/img/calendar-new/holidays_dot.png")}
            alt={""}
          />
        </span>{" "}
        <span
          className={
            meeting === true ? "event-name meeting_dot_color" : "hidden_dot"
          }
        >
          <img
            src={require("./../../../assets/img/calendar-new/meetings_dot.png")}
            alt={""}
          />
        </span>{" "}
      </>
    );
  };

  /*********************************
   * @DESC - RENDER DATE CELLS
   *********************************/
  renderCells = () => {
    //@ We Require all the the meeting data, and current Month name
    let dashboardCalenderMeetFollowup =
      this.state.dashboardCalenderMeetFollowup;

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

        Object.keys(dashboardCalenderMeetFollowup).forEach((key) => {
          if (
            key === formattedDate &&
            iterationDayMonth === activeMonth &&
            activeYear === iterationDayYear
          ) {
            formattedDateFollowUpData = dashboardCalenderMeetFollowup[key];
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
                ? "dates_stayle current-date-border "
                : formattedDateFollowUpData.length !== 0
                ? "dates_stayle follo-up-border "
                : iterationDayMonth !== calenderActiveMonth
                ? "dates_stayle dayDisabled "
                : "dates_stayle dates "
            }
          >
            {formattedDate}
            {formattedDateFollowUpData.length !== 0 ? (
              <>{this.renderDotsInDays(formattedDateFollowUpData)}</>
            ) : null}
          </td>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(<tr key={day}>{days}</tr>);
      days = [];
    }
    const dateFormats = "dd";
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
    this.props.getAllDataOfTheDay(
      formattedDate,
      dateFns.format(this.state.currentMonth, "M"),
      dateFns.format(new Date(), "YYYY")
    );
    store.dispatch({
      type: SET_SELECTED_DATE,
      payload: day.toISOString(),
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
    // console.log(this.props.dashboardCalenderMeetFollowup);
    return (
      <Fragment>
        <div className="main-calender-container">
          <div className="row">
            {this.renderHeaderCells()}
            {calenderView ? this.renderCells() : ""}
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  // allFollowups: state.calender.allFollowUps,
  dashboardCalenderMeetFollowup: state.dashboard.dashboardCalenderMeetFollowup,
  apiStatus: state.auth.status,
});

export default connect(mapStateToProps, {
  getAllFolloUps,
  getAllDataCalenderWidget,
  getAllDataOfTheDay,
})(CalendarNewCustomCalendar);
