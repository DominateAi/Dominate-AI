import React, { Component } from "react";
import DashboardRowSixColm1Graph from "./DashboardRowSixColm1Graph";
import DashboardRowSixColm2Graph from "./DashboardRowSixColm2Graph";

class DashboardRowSix extends Component {
  render() {
    return (
      <div className="row mx-0 new-dashboard-row-6">
        <DashboardRowSixColm1Graph />
        <div className="new-dashboard-row-6-colm1-card new-dashboard-row-6-colm1-card--colm2Card">
          <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
            My Target
          </h3>
          <DashboardRowSixColm2Graph />
        </div>
      </div>
    );
  }
}

export default DashboardRowSix;
