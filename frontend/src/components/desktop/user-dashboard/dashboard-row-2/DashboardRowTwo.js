import React, { Component } from "react";
import DashboardRowTwoColm1Card1 from "./DashboardRowTwoColm1Card1";
import DashboardRowTwoColm1Card2 from "./DashboardRowTwoColm1Card2";
import DashboardRowTwoColm2 from "./DashboardRowTwoColm2";
import DashboardRowTwoColm3 from "./DashboardRowTwoColm3";

class DashboardRowTwo extends Component {
  render() {
    return (
      <div className="row mx-0 new-dashboard-row-2">
        {/* <div className="col-md-6 col-lg-3 pr-0"> */}
        <div>
          <DashboardRowTwoColm1Card1 />
          <DashboardRowTwoColm1Card2 />
        </div>
        {/* <div className="col-md-6 col-lg-5 pr-0"> */}
        <DashboardRowTwoColm2 />
        {/* </div> */}
        {/* <div className="col-md-12 col-lg-4 pr-md-0"> */}
        <DashboardRowTwoColm3 />
        {/* </div> */}
      </div>
    );
  }
}

export default DashboardRowTwo;
