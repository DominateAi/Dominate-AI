import React, { Component, Fragment } from "react";
import Slider from "react-slick";
import dateFns from "date-fns";
import PopupInputFields from "./../common/PopupInputFields";
import CalenderAddLeave from "./CalenderAddLeave";
import { connect } from "react-redux";

class Calender extends Component {
  constructor() {
    super();
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      calenderView: true,
    };
  }

  /*========================================
             Lifecycle methods
  =========================================*/
  componentDidMount() {}

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
    const myDate = dateFns.format(this.state.currentMonth, "Do MMMM");
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
    const { calenderView } = this.state;
    return (
      <Fragment>
        <table className="calender-month-slider mb-0" style={{ width: "100%" }}>
          <tbody>
            <tr>
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
                    {calenderView ? "Day View" : "Month View"}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

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
      </Fragment>
    );
  };

  /*********************************
   * @DESC - RENDER DATE CELLS
   *********************************/
  renderCells = () => {
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
        formattedDate = dateFns.format(day, dateFormat);
        days.push(
          <td key={day} className="dates">
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
        days.push(<div className="dates">{formattedDate}</div>);
        day = dateFns.addDays(day, 1);
      }
      rows.push(<div key={day}>{days}</div>);
      // days = [];
    }
    return (
      <div className="container day-view-container">
        <Slider {...settings}>
          {days.map((day, index) => {
            return day;
          })}
        </Slider>
      </div>
    );
  };

  render() {
    const { calenderView } = this.state;
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

export default connect(null, {})(Calender);
