import React, { Component } from "react";
import { Link } from "react-router-dom";
import Dropdown from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as RCMenuItem, Divider } from "rc-menu";
import { connect } from "react-redux";
import { logoutUser } from "./../../../../store/actions/authAction";
import { withRouter } from "react-router-dom";
import isEmpty from "./../../../../store/validations/is-empty";

/*==============================
    Notification Events
===============================*/

function onSelect({ key }) {
  console.log(`${key} selected`);
}

function onVisibleChange(visible) {
  console.log(visible);
}

/*===============================
    Notifications List
================================*/

const menu = (
  <Menu onSelect={onSelect}>
    <RCMenuItem disabled>disabled</RCMenuItem>
    <RCMenuItem key="1">one</RCMenuItem>
    <Divider />
    <RCMenuItem key="2">two</RCMenuItem>
  </Menu>
);

/*===============================
  Render Notification Dropdown
================================*/

// function renderNotifyDropdown() {
//   return (
//     <Dropdown
//       trigger={["click"]}
//       overlay={menu}
//       animation="slide-up"
//       onVisibleChange={onVisibleChange}
//     >
//       <img
//         src={require("./../../../../assets/img/menu/bell-icon.png")}
//         alt="bell"
//       />
//     </Dropdown>
//   );
// }

// /*==============================
//     profile dropdown Events
// ===============================*/

// function onSelectProfile({ key }) {
//   console.log(`${key} selected`);
// }

// function onVisibleChangeProfile(visible) {
//   // console.log(visible);
// }

export class SuperAdminNavbar extends Component {
  constructor() {
    super();
    this.state = {
      // require for responsive window
      windowWidth: window.innerWidth,
      userProfileImg: [],
    };
  }

  /*============================================
          component lifecycle methods
  =============================================*/

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.userProfileImg) &&
      nextProps.userProfileImg !== nextState.userProfileImg
    ) {
      return {
        userProfileImg: nextProps.userProfileImg,
      };
    }
    return null;
  }

  /*========================================================
                mobile view event handlers
  ========================================================*/

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
    });
  };

  /*========================================================
                end mobile view event handlers
  ========================================================*/

  logoutHandler = () => {
    // console.log("logout");
    this.props.logoutUser();
    this.props.history.push("/login");
  };

  render() {
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    // console.log(this.state.userProfileImg);
    const { userProfileImg } = this.state;
    return (
      <>
        <nav className="navbar my-navbar navbar-light">
          <div>
            <Link to="/organization" className="navbar-brand">
              <img
                src="/img/desktop-dark-ui/logo/logo-color-white.svg"
                alt="logo"
                className="main-logo-navbar"
              />
            </Link>
          </div>
          <div className="d-flex" style={{ alignItems: "center" }}>
            {/* <span className="nav_icons">
                <img
                  src={require("./../../../assets/img/menu/search-icon.png")}
                  alt="search"
                />
              </span>
              <span className="nav_icons mr-30">{renderNotifyDropdown()}</span> */}
            {/* <span className="nav_icons">
              <img
                src={require("./../../../assets/img/menu/NoPath.png")}
                alt="logo"
              />
            </span> */}
            <Link to="/profile">
              <span className="nav_icons">
                {/* <i className="fa fa-user" aria-hidden="true"></i> */}
                <img
                  src={`${userProfileImg.profileImage}&token=${dataToken.token}`}
                  alt=""
                />
              </span>
            </Link>
            <span onClick={this.logoutHandler} className="logout-btn">
              {/* <i className="fa fa-power-off"></i> */}
              <img
                src={require("./../../../../assets/img/logo/dashboard-logout-icon.svg")}
                alt="logout-icons"
              />
            </span>
          </div>
        </nav>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfileImg: state.auth.user,
});

export default connect(mapStateToProps, { logoutUser })(
  withRouter(SuperAdminNavbar)
);
