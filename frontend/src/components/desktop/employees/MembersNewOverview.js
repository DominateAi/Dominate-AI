import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import SingleOverviewBlock from "./../../desktop/common/SingleOverviewBlock";
import { connect } from "react-redux";
import { getEmployeesOverview } from "./../../../store/actions/employeeAction";
import isEmpty from "./../../../store/validations/is-empty";
import {
  filterAllEmployeesByLevelAction,
  filterLevelByOnLeave,
  filterLevelByUpcomingLeaves,
  getAllEmployeesWithAdmin,
} from "./../../../store/actions/employeeAction";
import { SET_APPROVAL_PENDING } from "./../../../store/types";
import store from "./../../../store/store";
import { getAllEEmployeePendingLeaves } from "./../../../store/actions/calenderAction";

class MembersNewOverview extends Component {
  constructor() {
    super();
    this.state = {
      employeeOverview: [],
      // require for responsive window
      windowWidth: window.innerWidth,
    };
  }

  /*================================
          Lifecycle method
  =================================*/

  componentDidMount() {
    this.props.getEmployeesOverview();
    window.addEventListener("resize", this.handleWindowResize);
  }

  /*========================================================
                mobile view event handlers
  ========================================================*/

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

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.employee) &&
      nextProps.employee !== nextState.employeeOverview
    ) {
      return {
        employeeOverview: nextProps.employee,
      };
    }
    return null;
  }

  /*=================================
    Employee Overview Filter Handler
  ===================================*/

  onClickEmployeeOverviewFilter = (level) => {
    // console.log(level);
    if (level === "ApprovalPending") {
      this.props.getAllEEmployeePendingLeaves();
      store.dispatch({
        type: SET_APPROVAL_PENDING,
        payload: level,
      });
    } else if (level === "OnLeave") {
      this.props.filterLevelByOnLeave();
      store.dispatch({
        type: SET_APPROVAL_PENDING,
        payload: "OnLeave",
      });
    } else if (level === "UpcomingLeaves") {
      this.props.filterLevelByUpcomingLeaves();
      store.dispatch({
        type: SET_APPROVAL_PENDING,
        payload: "UpcomingLeaves",
      });
    } else {
      const allEmployeeQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {},
      };
      this.props.getAllEmployeesWithAdmin(allEmployeeQuery);
      store.dispatch({
        type: SET_APPROVAL_PENDING,
        payload: "AllMembers",
      });
    }

    // const filterByLevel = {
    //   query: {
    //     status: level
    //   }
    // };
    console.log(level);
    // this.props.filterLevelByOnLeave();
  };

  render() {
    // console.log(this.state.employeeOverview);
    const { employeeOverview } = this.state;
    const { userRole } = this.props;
    // settings for slider
    let settings = {
      dots: false,
      multiple: true,
      infinite: true,
      speed: 500,
      draggable: false,
      slidesToShow: 2,
      slidesToScroll: 2,
      className: "widgetListSlider",
    };

    const block4 = (
      <SingleOverviewBlock
        onClick={() => this.onClickEmployeeOverviewFilter("AllMembers")}
        count={employeeOverview.allMembers}
        status={"All Members"}
        blockClassName={"leads-gradient-block bg-color-emp4"}
      />
    );

    const block1 = (
      <SingleOverviewBlock
        onClick={() => this.onClickEmployeeOverviewFilter("OnLeave")}
        count={employeeOverview.onLeave}
        status={"On Leave"}
        blockClassName={"leads-gradient-block bg-color-emp1"}
      />
    );

    const block2 = (
      <SingleOverviewBlock
        onClick={() => this.onClickEmployeeOverviewFilter("ApprovalPending")}
        count={employeeOverview.approvalPending}
        status={"Approval Pending"}
        blockClassName={"leads-gradient-block bg-color-emp2"}
      />
    );

    const block3 = (
      <SingleOverviewBlock
        onClick={() => this.onClickEmployeeOverviewFilter("UpcomingLeaves")}
        count={employeeOverview.upcomingLeaves}
        status={"Upcoming Leaves"}
        blockClassName={"leads-gradient-block bg-color-emp3"}
      />
    );

    return (
      <>
        {this.state.windowWidth >= 768 && (
          <div className="employees-overview-container employees-overview-container--membersNew">
            <div className="gradient-block-container">
              {block4}
              {block1}
              {userRole === "Administrator" && block2}
              {block3}
            </div>
          </div>
        )}

        {this.state.windowWidth <= 767 && (
          <div className="leads-mobile-overview-block ">
            <Slider {...settings}>
              {block1}
              {userRole === "Administrator" && block2}
              {block3}
            </Slider>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  employee: state.employee.employeeOverview,
  userRole: state.auth.user.role.name,
});

export default connect(mapStateToProps, {
  getEmployeesOverview,
  filterAllEmployeesByLevelAction,
  filterLevelByOnLeave,
  getAllEEmployeePendingLeaves,
  filterLevelByUpcomingLeaves,
  getAllEmployeesWithAdmin,
})(MembersNewOverview);
