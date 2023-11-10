import React, { Component } from "react";
import DashboardRowFiveLeadsLevelsGraph from "./DashboardRowFiveLeadsLevelsGraph";
import DatePicker from "react-datepicker";

class DashboardRowFive extends Component {
  constructor() {
    super();
    this.state = {
      fromDate: new Date(),
      toDate: new Date(),
    };
  }

  /*===============================
      leads level count month events
  ================================*/
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

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="row mx-0 new-dashboard-row-5">
        <div className="new-dashboard-row-5-colm1-card">
          <h3 className="text-center new-dashboard-row-2-colm1-card1__title mb-30">
            Leads Levels
          </h3>
          {/* datepicker */}
          <div className="leads-title-block-container__date-picker text-center justify-content-between ml-30 mb-30">
            {/* <span
              className="font-24-semibold mr-30"
              role="img"
              aria-labelledby="Tear-Off Calendar"
            >
              {/* &#x1F4C6; */}
            </span> */}

            {/* datepicker */}
            <DatePicker
              selected={this.state.fromDate}
              selectsStart
              startDate={this.state.fromDate}
              endDate={this.state.toDate}
              onChange={this.handleChangeFromDate}
              onChangeRaw={this.handleDateChangeRaw}
            />
            {/* <span className="font-18-medium">to</span> */}
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

          <DashboardRowFiveLeadsLevelsGraph />
        </div>
        <div className="new-dashboard-row-5-colm1-card new-dashboard-row-5-colm1-card--colm2Card">
          <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
            Leads Closed
          </h3>
        </div>
        <div className="new-dashboard-row-5-colm1-card new-dashboard-row-5-colm1-card--colm3Card">
          <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
            Email
          </h3>
        </div>
      </div>
    );
  }
}

export default DashboardRowFive;
