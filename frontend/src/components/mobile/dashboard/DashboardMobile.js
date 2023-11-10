import React, { Component } from "react";
import MobileNavbar from "../common/MobileNavbar";

class DashboardMobile extends Component {
  render() {
    return (
      <>
        {/* <MobileNavbar textTitle="Dashboard" /> */}
        <div className="text-center">
          <h1 className="resp-font-12-medium color-gray-resp">Dashboard</h1>
        </div>
      </>
    );
  }
}

export default DashboardMobile;
