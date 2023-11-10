import React, { Component, Fragment } from "react";
import Slider from "react-slick";
import dateFns from "date-fns";
import PopupInputFields from "../common/PopupInputFields";
import CalenderAddLeave from "./CalenderAddLeave";
import { connect } from "react-redux";
import { getAllApprovedLeaves } from "./../../../store/actions/calenderAction";
import isEmpty from "./../../../store/validations/is-empty";

class LeavesCalender extends Component {
  constructor() {
    super();
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      calenderView: true,
      allApprovedLeaves: [],
      dayViewFollowUps: [],
    };
  }

  /*=============================
      Lifecycle Methods
  ==============================*/
  componentDidMount() {
    this.props.getAllApprovedLeaves(
      dateFns.format(this.state.currentMonth, "M"),
      dateFns.format(new Date(), "YYYY")
    );
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allApprovedLeaves) &&
      nextProps.allApprovedLeaves !== nextState.allApprovedLeaves
    ) {
      return {
        allApprovedLeaves: nextProps.allApprovedLeaves,
      };
    }
    return null;
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
        this.props.getAllApprovedLeaves(
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
        this.props.getAllApprovedLeaves(
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
                  ""
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
                <p>{this.renderCurrentTime()}</p>
              </div>
              <div className="current-date-time">
                <CalenderAddLeave />
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
    let allLeaves = this.state.allApprovedLeaves;

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

        Object.keys(allLeaves).forEach((key) => {
          if (
            key === formattedDate &&
            iterationDayMonth === activeMonth &&
            activeYear === iterationDayYear
          ) {
            formattedDateFollowUpData = allLeaves[key];
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
                  {formattedDateFollowUpData.length + " Approved Leaves"}
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

  /*=================================
          Render Day View
  ==================================*/

  renderDayView = () => {
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 7,
      slickGoTo: 3,
    };

    const { currentMonth, dayInDayView } = this.state;
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
            {!isEmpty(this.state.dayViewFollowUps) ? (
              this.state.dayViewFollowUps.map((pendingLeave, index) => {
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
                              ? "Paid Leave"
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
                  No leaves found on {dateFns.format(dayInDayView, "Do MMM")}{" "}
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
    console.log(this.state.allApprovedLeaves);
    return (
      <Fragment>
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
  allApprovedLeaves: state.calender.approvedLeaves,
});

export default connect(mapStateToProps, { getAllApprovedLeaves })(
  LeavesCalender
);
