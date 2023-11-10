import React, { Component } from "react";
import { Link } from "react-router-dom";

class StaticNavbar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div className="adjust-mobile-static-navbar"></div>
        <div className="menu-mobile-static">
          <Link to="/dashboard">
            {this.props.active === "home" ? (
              <img
                src={require("../../../assets/img/mobile-new/dashboard/home-active.svg")}
                alt="home"
              />
            ) : (
              <img
                src={require("../../../assets/img/mobile-new/dashboard/home.svg")}
                alt="home"
              />
            )}
          </Link>
          <Link to="/dashboard">
            {this.props.active === "user" ? (
              <img
                src={require("../../../assets/img/mobile-new/dashboard/user-active.svg")}
                alt="user"
              />
            ) : (
              <img
                src={require("../../../assets/img/mobile-new/dashboard/user.svg")}
                alt="user"
              />
            )}
          </Link>
          <Link to="/dashboard">
            {this.props.active === "chat" ? (
              <img
                src={require("../../../assets/img/mobile-new/dashboard/chat-active.svg")}
                alt="chat"
              />
            ) : (
              <img
                src={require("../../../assets/img/mobile-new/dashboard/chat.svg")}
                alt="chat"
              />
            )}
          </Link>
          <Link to="/dashboard">
            {this.props.active === "calendar" ? (
              <img
                src={require("../../../assets/img/mobile-new/dashboard/calendar-active.svg")}
                alt="calendar"
              />
            ) : (
              <img
                src={require("../../../assets/img/mobile-new/dashboard/calendar.svg")}
                alt="calendar"
              />
            )}
          </Link>
        </div>
      </>
    );
  }
}

export default StaticNavbar;
