import React, { Component } from "react";

class TopNavbarMobile extends Component {
  render() {
    return (
      <div className="topnavbar-mobile-new">
        <img
          src={require("../../../assets/img/logo-new/Dominate-logo-white.svg")}
          alt="dominate logo"
          className="topnavbar-mobile-new__logo"
        />
        <div>
          <img
            src={require("../../../assets/img/mobile-new/dashboard/user-profile-picture.png")}
            alt="profile"
            className="topnavbar-mobile-new__profile"
          />
          <img
            src={require("../../../assets/img/mobile-new/dashboard/notification.svg")}
            alt="notification"
            className="topnavbar-mobile-new__notification"
          />
        </div>
      </div>
    );
  }
}

export default TopNavbarMobile;
