import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import ProfileImageUploadModal from "../../desktop/profile/ProfileImageUploadModal";
import TopNavbar from "../topnavbar/TopNavbar";

const listMenu = [
  {
    link: "/dashboard",
    name: "Dashboard",
  },
  {
    link: "/leads-new",
    name: "Leads",
  },
  {
    link: "/customers",
    name: "Customers",
  },
  {
    link: "/admin-employees",
    name: "Team",
  },
  {
    link: "/quotations",
    name: "Quotations",
  },
  {
    link: "/proposals",
    name: "Proposals",
  },
  {
    link: "/admin-reports",
    name: "Reports",
  },
  {
    link: "/main-calender",
    name: "Calender",
  },
  {
    link: "/task-list",
    name: "Tasks",
  },
  {
    link: "/message",
    name: "Chat",
  },
  {
    link: "/calling",
    name: "Calling",
  },
];

class MobileNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // require for responsive window
      windowWidth: window.innerWidth,
      isMobileNavbarOpen: false,
    };
  }

  /*========================================================
                react-burger-menu event handlers
  ========================================================*/

  handleOnStateChange(stateVal) {
    this.setState({ isMobileNavbarOpen: stateVal.isOpen });
  }

  closeMobileNavbar() {
    this.setState({ isMobileNavbarOpen: false });
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
  handleLogoutClick = () => {
    console.log("logout clicked");
  };

  render() {
    return (
      this.state.windowWidth <= 767 && (
        <>
          <div className="resp-top-header resp-top-header--main-menu">
            <div className="w-100">
              {/* menu */}
              <div>
                <Menu
                  isOpen={this.state.isMobileNavbarOpen}
                  onStateChange={(stateVal) =>
                    this.handleOnStateChange(stateVal)
                  }
                  customBurgerIcon={
                    <img
                      className="resp-top-header__menuImg"
                      src={require("./../../../assets/img/icons/Dominate-Icon_mobile-menu.svg")}
                      alt="menu"
                    />
                  }
                >
                  {/* <span className="resp-top-header__profileImgBlock">
                    <div onClick={() => this.closeMobileNavbar()}>
                      <ProfileImageUploadModal isMobile={true} />
                    </div>
                  </span>
                  <span className="profile-title">
                    John Dorian
                    <br />
                    <span className="resp-font-18-medium">
                      <span className="resp-font-12-medium">Role: </span>
                      Administrator
                    </span>
                  </span> */}
                  {listMenu.map((data, index) => (
                    <span key={index}>
                      <Link
                        className="menu-item"
                        to={data.link}
                        onClick={() => this.closeMobileNavbar()}
                      >
                        {data.name}
                      </Link>
                    </span>
                  ))}
                </Menu>
              </div>
              {/* <div className="text-center">
                <h1 className="mobile-topnavbar-page-title">
                  {this.props.textTitle}
                </h1>
              </div> */}
            </div>
            {/* other icons */}
            {/* <div className="d-flex align-items-end">
              <span
                className="logout-btn-mobile"
                onClick={this.handleLogoutClick}
              >
                <i className="fa fa-power-off"></i>
              </span>
            </div> */}
          </div>

          {/* {this.props.displayMenuIcons !== false && <TopNavbar />} */}
        </>
      )
    );
  }
}

export default MobileNavbar;
