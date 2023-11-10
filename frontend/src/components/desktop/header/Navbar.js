import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { Dropdown as RBDropdown, Toggle, Item } from "react-bootstrap";
import TopMenuBar from "./TopMenuBar";
import Dropdown from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as RCMenuItem, Divider } from "rc-menu";
import { connect } from "react-redux";
import {
  logoutUser,
  updateUserAfterLogout,
} from "./../../../store/actions/authAction";
import { withRouter } from "react-router-dom";
import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
import MobileNavbar from "../../mobile/common/MobileNavbar";
import LogoutConfirmation from "./../popups/LogoutConfirmation";

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

function renderNotifyDropdown() {
  return (
    <Dropdown
      trigger={["click"]}
      overlay={menu}
      animation="slide-up"
      onVisibleChange={onVisibleChange}
    >
      <img
        src={require("./../../../assets/img/menu/bell-icon.png")}
        alt="bell"
      />
    </Dropdown>
  );
}

/*==============================
    profile dropdown Events
===============================*/

function onSelectProfile({ key }) {
  console.log(`${key} selected`);
}

function onVisibleChangeProfile(visible) {
  // console.log(visible);
}

export class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // require for responsive window
      windowWidth: window.innerWidth,
      userProfileImg: [],
      activeProfileMenu: this.props.activeProfileMenu,
      logoutConfirmModel: false,
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
    if (
      !isEmpty(nextProps.userPayload) &&
      nextProps.userPayload !== nextState.userPayload
    ) {
      return {
        userPayload: nextProps.userPayload,
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
    var data = JSON.parse(localStorage.getItem("Data"));

    const { userPayload } = this.props;

    // const logedOut = {
    //   email: data.email,
    //   firstName: data.firstName,
    //   lastName: data.lastName,
    //   role: data.role,
    //   // dateOfJoining: "2018-07-27T13:17:12.178Z",
    //   // jobTitle: "asdasdasd",
    //   // targetedLeads: 400,
    //   loggedOff: new Date().toISOString(),
    // };
    // // console.log(logedOut);
    // this.props.updateUserAfterLogout(data.id);
    this.props.logoutUser();
    this.props.history.push("/");
  };

  openModel = () => {
    this.setState({
      logoutConfirmModel: true,
    });
  };

  onCloseHandler = () => {
    this.setState({
      logoutConfirmModel: false,
    });
  };

  render() {
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    // console.log(this.state.userPayload);
    const { userProfileImg } = this.state;
    return (
      <>
        <MobileNavbar />

        <div className="dominate_header">
          <nav className="navbar my-navbar navbar-light">
            <div>
              <Link to="/dashboard" className="navbar-brand">
                <img
                  src="/img/desktop-dark-ui/logo/logo-color-white.svg"
                  alt="logo"
                  className="main-logo-navbar"
                />
              </Link>
            </div>
            <div className="row mx-0 align-items-center flex-nowrap">
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
                alt=""
              />
            </span> */}

              <Link to="/profile">
                <p
                  onClick={() =>
                    store.dispatch({
                      type: SET_PAGETITLE,
                      payload: "Profile",
                    })
                  }
                  className={
                    this.props.history !== undefined &&
                    this.props.history.location.pathname === "/profile"
                      ? "nav_icons profile-nav-icon font-18-semibold topmenubar-menu-name topmenubar-menu-name--active"
                      : "nav_icons profile-nav-icon font-18-semibold topmenubar-menu-name"
                  }
                >
                  <img
                    src={`${dataToken.profileImage}&token=${dataToken.token}`}
                    alt=""
                    className="mr-15"
                  />
                  {dataToken.name}
                </p>

                {/* {this.props.activeProfileMenu ? (
                    ""
                  ) : (
                    <span className="tooltip-box">
                      <p className="tooltip-box__text">Visit Profile</p>
                    </span>
                  )} */}
              </Link>

              {!isEmpty(this.props.history) &&
              !isEmpty(this.props.userPayload) ? (
                <LogoutConfirmation
                  logoutConfirmModel={this.state.logoutConfirmModel}
                  openModel={this.openModel}
                  yesHandler={this.logoutHandler}
                  onCloseHandler={this.onCloseHandler}
                />
              ) : (
                <span
                  onClick={this.logoutHandler}
                  className="logout-btn opacity-0"
                >
                  <img
                    src="/img/desktop-dark-ui/nav-icons/nav-logout-white.svg"
                    alt="logout"
                    className="opacity-0"
                  />
                </span>
              )}
            </div>
          </nav>
          {/* desktop view */}
          {this.state.windowWidth >= 768 && <TopMenuBar />}
        </div>

        {/* fix header */}
        <div className="dominate_header__fix"></div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfileImg: state.auth.user,
  userPayload: state.auth.user,
});

export default connect(mapStateToProps, { logoutUser, updateUserAfterLogout })(
  withRouter(Navbar)
);
