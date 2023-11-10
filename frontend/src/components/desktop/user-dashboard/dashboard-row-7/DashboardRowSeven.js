import React, { Component } from "react";
import DashboardOverviewPerformance from "./../../dashboard/DashboardOverviewPerformance";
import DashboardCalender from "./DashboardCalender";

export class DashboardRowSeven extends Component {
  render() {
    return (
      <div className="dashboard_row_seven_container">
        <DashboardOverviewPerformance />
        <DashboardCalender />
      </div>
    );
  }
}

export default DashboardRowSeven;
