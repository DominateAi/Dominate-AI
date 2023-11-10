import React, { Component, Fragment } from "react";
import Navbar from "../header/Navbar";
import DashboardRowOne from "./dashboard-row-1/DashboardRowOne";
import DashboardRowTwo from "./dashboard-row-2/DashboardRowTwo";
import DashboardRowThree from "./dashboard-row-3/DashboardRowThree";
// import DashboardRowFive from "./dashboard-row-5/DashboardRowFive";
import DashboardRowSix from "./dashboard-row-6/DashboardRowSix";
import DashboardRowSeven from "./dashboard-row-7/DashboardRowSeven";
import OverviewDemoNewDashboard1 from "../overview-demo-new/OverviewDemoNewDashboard1";
import OverviewDemoNewDashboard2 from "../overview-demo-new/OverviewDemoNewDashboard2";
import OverviewDemoNewDashboard3 from "../overview-demo-new/OverviewDemoNewDashboard3";
import isEmpty from "./../../../store/validations/is-empty";
import { withRouter } from "react-router-dom";
import FreeTrialAlmostOver from "./../popups/FreeTrialAlmostOver";
import { getAllAccounts } from "./../../../store/actions/accountsAction";

// import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { connect } from "react-redux";
import {
  performanceScoreBoard,
  performanceScoreBoardprevious,
  getMyTargetGraphData,
  getAllDataCalenderWidget,
  getLeadsMonthStatusCount,
  getLeadSourceRevenueGraph,
  getDealsInPipeline,
  getTodaysFollowUps,
  getTodaysMeetings,
  getTodaysTasksAll,
  getDashBoardNotification,
  getMonthlyTargetByDoller,
  getMonthlyTargetByLead,
  getMonthlyRevenueAndQuaterlyRevenue,
  getRevenueForcastGraph,
  getExpectedRevenueAndAquiredRevenue,
} from "./../../../store/actions/dashBoardAction";
import {
  getFunelView,
  getAllLeadsCount,
} from "./../../../store/actions/leadAction";
import { getUpcomingLeavesAndHoliday } from "./../../../store/actions/calenderAction";
import DashboardRowFour from "./dashboard-row-4/DashboardRowFour";
import { SET_PAGETITLE } from "./../../../store/types";
import ToggleSwitch from "../common/ToggleSwitch";
import dateFns from "date-fns";
import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

export class UserDahsboardMain extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      active: true,
      freeTrialAlmostOverPopup: false,
    };
  }

  componentDidMount() {
    // console.log("show popup");
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    // if (
    //   (!isEmpty(organisationData) &&
    //     organisationData.planStatus === "CANCELLED") ||
    //   (!isEmpty(organisationData) &&
    //     organisationData.planStatus === "PAYMENT_FAILED")
    // ) {
    //   this.props.history.push("/profile");
    // } else if (
    //   !isEmpty(organisationData) &&
    //   organisationData.planStatus === "TRIAL_ALMOST_OVER"
    // ) {
    //   this.setState({
    //     freeTrialAlmostOverPopup: true,
    //   });
    // }

    var data = JSON.parse(localStorage.getItem("Data"));

    var emailVerify = JSON.parse(localStorage.getItem("emailVerify"));
    if (emailVerify === false) {
      if (
        (!isEmpty(data) && data.demo === true) ||
        (!isEmpty(this.props.location.state) &&
          this.props.location.state.watchWalkthroughAgain)
      ) {
        store.dispatch({
          type: SET_WALKTHROUGH_PAGE,
          payload: "dashboard-1",
        });
      }
      store.dispatch({
        type: SET_PAGETITLE,
        payload: "Dashboard",
      });
    }

    if (
      !isEmpty(this.props.location.state) &&
      this.props.location.state.watchWalkthroughAgain
    ) {
      store.dispatch({
        type: SET_WALKTHROUGH_PAGE,
        payload: "dashboard-1",
      });
      store.dispatch({
        type: SET_PAGETITLE,
        payload: "Dashboard",
      });
    }

    store.dispatch({
      type: SET_PAGETITLE,
      payload: "Dashboard",
    });
    // console.log(data);

    localStorage.setItem("activeWalkthrough", "");

    let currentMonth = dateFns.format(new Date(), "M");
    let currentyear = dateFns.format(new Date(), "YYYY");

    this.props.getAllAccounts();
    this.props.getAllLeadsCount();
    this.props.getFunelView();
    this.props.performanceScoreBoard("current");
    this.props.performanceScoreBoardprevious("previous");
    this.props.getMyTargetGraphData();
    this.props.getAllDataCalenderWidget(currentMonth, currentyear);
    this.props.getLeadsMonthStatusCount(
      false,
      new Date().toISOString(),
      new Date().toISOString()
    );
    this.props.getLeadSourceRevenueGraph(false);
    this.props.getUpcomingLeavesAndHoliday();
    this.props.getDealsInPipeline();
    this.props.getTodaysFollowUps(false);
    this.props.getTodaysMeetings(false);
    this.props.getTodaysTasksAll(false);
    this.props.getDashBoardNotification("12", "1");
    this.props.getMonthlyTargetByDoller();
    this.props.getMonthlyTargetByLead();
    this.props.getMonthlyRevenueAndQuaterlyRevenue();
    this.props.getRevenueForcastGraph();
    this.props.getExpectedRevenueAndAquiredRevenue();
  }

  componentDidUpdate() {
    // let currentMonth = dateFns.format(new Date(), "M");
    // let currentyear = dateFns.format(new Date(), "YYYY");

    if (this.state.active === false && !this.state.hasActive) {
      console.log("switch changed to organisation");
      this.props.getMonthlyTargetByDoller("isOrganisation");
      this.props.getMonthlyTargetByLead("isOrganisation");

      this.setState({
        hasActive: true,
      });
    }
    if (this.state.active === true && !this.state.hasActive) {
      // console.log("switch changed to self");

      this.props.getMonthlyTargetByDoller();
      this.props.getMonthlyTargetByLead();

      this.setState({
        hasActive: true,
      });
    }
  }

  /*=============================
      Toglggle switch handler
  ==============================*/

  onChange = () => {};

  toggleFunction = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
      hasActive: false,
    });
  };

  oncloseHandler = () => {
    this.setState({
      freeTrialAlmostOverPopup: false,
    });
  };

  okayHandler = () => {
    this.props.history.push({ pathname: "/profile", state: "savedCards" });
  };

  render() {
    // console.log(this.state.active);
    return (
      <Fragment>
        <Navbar />
        <BreadcrumbMenu
          menuObj={[
            {
              title: "Dashboard",
            },
          ]}
        />
        <h2 className="page-title-new">Dashboard</h2>
        <hr className="page-title-border-bottom" />

        <FreeTrialAlmostOver
          freeTrialAlmostOverPopup={this.state.freeTrialAlmostOverPopup}
          oncloseHandler={this.oncloseHandler}
          okayHandler={this.okayHandler}
        />

        {this.props.activeWalkthroughPage === "dashboard-1" && (
          <OverviewDemoNewDashboard1 />
        )}

        {this.props.activeWalkthroughPage === "dashboard-2" && (
          <OverviewDemoNewDashboard2 />
        )}

        {this.props.activeWalkthroughPage === "dashboard-3" && (
          <OverviewDemoNewDashboard3 />
        )}

        <div className="user_dashboard_main_container">
          <ToggleSwitch
            name="active"
            currentState={this.state.active}
            type={"checkbox"}
            spantext1={"Self"}
            spantext2={"Organisation"}
            toggleclass={"toggle toggle--new-dashboard"}
            toggleinputclass={
              "toggle__switch toggle__switch--new-dashboard mx-3"
            }
            onChange={this.toggleFunction}
            defaultChecked={true}
          />

          <DashboardRowOne />
          <DashboardRowTwo />
          <DashboardRowThree />
          <DashboardRowFour />
          {/* <DashboardRowFive /> */}
          <DashboardRowSix />
          <DashboardRowSeven />
        </div>
      </Fragment>
    );
  }
}

const mapStateToprops = (state) => ({
  activeWalkthroughPage: state.auth.activeWalkthroughPage,
});

export default connect(mapStateToprops, {
  performanceScoreBoard,
  performanceScoreBoardprevious,
  getMyTargetGraphData,
  getFunelView,
  getAllLeadsCount,
  getAllDataCalenderWidget,
  getLeadsMonthStatusCount,
  getLeadSourceRevenueGraph,
  getUpcomingLeavesAndHoliday,
  getDealsInPipeline,
  getTodaysFollowUps,
  getTodaysMeetings,
  getTodaysTasksAll,
  getDashBoardNotification,
  getMonthlyTargetByDoller,
  getMonthlyTargetByLead,
  getMonthlyRevenueAndQuaterlyRevenue,
  getRevenueForcastGraph,
  getExpectedRevenueAndAquiredRevenue,
  getAllAccounts,
})(withRouter(UserDahsboardMain));
