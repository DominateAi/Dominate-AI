import React, { Component, Fragment } from "react";
//  react-grid-layout
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WidthProvider, Responsive } from "react-grid-layout";
// react-grid-layout end
import Navbar from "../header/Navbar";
import DashboardRowThree from "./dashboard-row-3/DashboardRowThree";

import DashboardRowTwoColm1Card1 from "../user-dashboard/dashboard-row-2/DashboardRowTwoColm1Card1";
import DashboardRowTwoColm1Card2 from "../user-dashboard/dashboard-row-2/DashboardRowTwoColm1Card2";
import DashboardRowTwoColm2 from "../user-dashboard/dashboard-row-2/DashboardRowTwoColm2";
import DashboardRowTwoColm3 from "../user-dashboard/dashboard-row-2/DashboardRowTwoColm3";
import MonthlyRevenueCard from "./dashboard-row-1/MonthlyRevenueCard";
import CountCard from "./dashboard-row-1/CountCard";
import { NotificationAlerts } from "./dashboard-row-1/NotificationAlerts";
import { DealsInPipeline } from "./dashboard-row-4/DealsInPipeline";
import DashboardRowFourFunnelView from "./dashboard-row-4/DashboardRowFourFunnelView";
import DashboardRowSixColm1Graph from "./dashboard-row-6/DashboardRowSixColm1Graph";
import DashboardRowSixColm2Graph from "./dashboard-row-6/DashboardRowSixColm2Graph";
import { DashboardCalender } from "./dashboard-row-7/DashboardCalender";
import DashboardOverviewPerformance from "./../dashboard/DashboardOverviewPerformance";
import CreateEmailTemplate from "./dashboard-row-1/CreateEmailTemplate";
// import ImportLead from "./dashboard-row-1/ImportLead";
import ImportLeadNew from "../ImportLeads/components/MainButton/MainButton";
import AddLeadCustomerEmployee from "./dashboard-row-1/AddLeadCustomerEmployee";
import { TodaysMeetingsAndFollowUps } from "./dashboard-row-1/TodaysMeetingsAndFollowUps";

import isEmpty from "../../../store/validations/is-empty";

import Loader from "react-loader-spinner";
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
import { SET_PAGETITLE } from "./../../../store/types";
import store from "./../../../store/store";
import ToggleSwitch from "../common/ToggleSwitch";
import dateFns from "date-fns";

/*=========================================================================
        react-grid-layout
==========================================================================*/

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};
// console.log(originalLayouts);

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value,
      })
    );
  }
}
/*=========================================================================
        react-grid-layout
==========================================================================*/

export class UserDahsboardMainGrid extends Component {
  constructor() {
    super();
    this.state = {
      //  react-grid-layout
      activeButton: "",
      isResetLayout: false,
      layoutOneState: JSON.parse(JSON.stringify(originalLayouts)),
      layouts: JSON.parse(JSON.stringify(originalLayouts)),

      loading: true,
      active: true,
    };
  }

  /*===========================================
      Lifecycle methods
  ===========================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.monthlyQuaterlyRevenue) &&
      nextProps.monthlyQuaterlyRevenue !== nextState.monthlyQuaterlyRevenue
    ) {
      return {
        monthlyQuaterlyRevenue: nextProps.monthlyQuaterlyRevenue,
      };
    }
    return null;
  }

  componentDidMount() {
    store.dispatch({
      type: SET_PAGETITLE,
      payload: "Dashboard",
    });
    let currentMonth = dateFns.format(new Date(), "M");
    let currentyear = dateFns.format(new Date(), "YYYY");

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
    this.props.getMonthlyTargetByDoller(false);
    this.props.getMonthlyTargetByLead(false);
    this.props.getMonthlyRevenueAndQuaterlyRevenue();
    this.props.getRevenueForcastGraph();
    this.props.getExpectedRevenueAndAquiredRevenue();
  }

  componentDidUpdate() {
    let currentMonth = dateFns.format(new Date(), "M");
    let currentyear = dateFns.format(new Date(), "YYYY");

    if (this.state.active === false && !this.state.hasActive) {
      console.log("switch changed to organisation");

      this.setState({
        hasActive: true,
      });
    }
    if (this.state.active === true && !this.state.hasActive) {
      console.log("switch changed to self");

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

  /*=========================================================================
        react-grid-layout
  ==========================================================================*/

  // static get defaultProps() {
  //   return {
  //     className: "layout",
  //     cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  //     rowHeight: 30,
  //   };
  // }

  resetLayout = (activeButtonText) => (e) => {
    this.setState({
      layouts: {},
      activeButton: activeButtonText,
      isResetLayout: true,
    });
  };

  layoutOne = (activeButtonText) => (e) => {
    this.setState({
      activeButton: activeButtonText,
      layouts: this.state.layoutOneState,
    });
  };

  onLayoutChange = (layout, layouts) => {
    saveToLS("layouts", layouts);
    console.log(layouts);
    this.setState({
      layouts: layouts,
      isResetLayout: false,
    });

    if (!this.state.isResetLayout) {
      this.setState({
        layoutOneState: layouts,
      });
    }
  };

  renderDraggableHandleBlock = () => {
    return (
      <img
        src={require("../../../assets/img/icons/diamond.svg")}
        alt="draggable handle diamond"
        className="draggableHandleDiamond"
      />
    );
  };

  /*=========================================================================
        react-grid-layout
  ==========================================================================*/

  render() {
    const { activeButton } = this.state;
    const { monthlyQuaterlyRevenue } = this.state;
    return (
      <Fragment>
        <Navbar />
        <div className="user_dashboard_main_container">
          <div className="row mx-0 justify-content-between">
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

            {/* react-grid-layout */}
            <div className="row mx-0 mb-30">
              <button
                className={
                  activeButton === "Default Layout" || activeButton === ""
                    ? "leads-new-filter-button leads-new-filter-button--active"
                    : "leads-new-filter-button"
                }
                onClick={this.resetLayout("Default Layout")}
              >
                Default Layout
              </button>
              <button
                className={
                  activeButton === "Custom Layout"
                    ? "leads-new-filter-button leads-new-filter-button--active"
                    : "leads-new-filter-button"
                }
                onClick={this.layoutOne("Custom Layout")}
              >
                Custom Layout
              </button>
            </div>
          </div>

          <ResponsiveReactGridLayout
            className="layout"
            cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
            rowHeight={30}
            layouts={this.state.layouts}
            onLayoutChange={(layout, layouts) =>
              this.onLayoutChange(layout, layouts)
            }
            // onDragStart={() => console.log("Drag Started")}
            // onDrag={() => console.log("Drag movement")}
            // onDragStop={() => console.log("Drag completed")}
            draggableHandle=".draggableHandleDiamond"
          >
            {/*=====================================================================
                    row 1 
            =====================================================================*/}
            <div
              key="meeting1Row1"
              data-grid={{
                w: 2,
                h: 9,
                x: 0,
                y: 0,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <TodaysMeetingsAndFollowUps
                  cardTitle={"Meeting"}
                  cardTitleTwo={"Meetings"}
                  task={false}
                  meet={true}
                  followup={false}
                />
              </div>
            </div>
            <div
              key="meeting2Row1"
              data-grid={{
                w: 2,
                h: 9,
                x: 2,
                y: 0,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <TodaysMeetingsAndFollowUps
                  cardTitle={"Follow up"}
                  cardTitleTwo={"Follow ups"}
                  task={false}
                  meet={false}
                  followup={true}
                />
              </div>
            </div>
            <div
              key="meeting3Row1"
              data-grid={{
                w: 2,
                h: 9,
                x: 4,
                y: 0,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <TodaysMeetingsAndFollowUps
                  cardTitle={"Task"}
                  cardTitleTwo={"Tasks"}
                  task={true}
                  meet={false}
                  followup={false}
                />
              </div>
            </div>
            <div
              key="buttons"
              data-grid={{
                w: 6,
                h: 1,
                x: 6,
                y: 0,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <div className="dashboard_top_buttons">
                  <CreateEmailTemplate />
                  {/* <ImportLead /> */}
                  <ImportLeadNew />
                  <AddLeadCustomerEmployee />
                </div>
              </div>
            </div>
            <div
              key="monthlyReviewRow1"
              data-grid={{
                w: 2,
                h: 6,
                x: 6,
                y: 1,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <MonthlyRevenueCard
                  headingName={"Monthly revenue"}
                  expected={
                    !isEmpty(monthlyQuaterlyRevenue) &&
                    monthlyQuaterlyRevenue.monthly_revenue.expected
                  }
                  percentage={
                    !isEmpty(monthlyQuaterlyRevenue) &&
                    monthlyQuaterlyRevenue.monthly_revenue.closed
                  }
                />
              </div>
            </div>
            <div
              key="quarterlyRevenueRow1"
              data-grid={{
                w: 2,
                h: 6,
                x: 8,
                y: 1,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <MonthlyRevenueCard
                  headingName={"Quarterly Revenue"}
                  expected={
                    !isEmpty(monthlyQuaterlyRevenue) &&
                    monthlyQuaterlyRevenue.quarterly_revenue.expected
                  }
                  percentage={
                    !isEmpty(monthlyQuaterlyRevenue) &&
                    monthlyQuaterlyRevenue.quarterly_revenue.closed
                  }
                />
              </div>
            </div>
            <div
              key="pendingLeadsRow1"
              data-grid={{
                w: 2,
                h: 2,
                x: 6,
                y: 7,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <CountCard
                  count={
                    !isEmpty(monthlyQuaterlyRevenue) &&
                    monthlyQuaterlyRevenue.pending_leads
                  }
                  name={"Pending leads from last month"}
                  className={"dashboard_card_count pending_leads_gradient"}
                />
              </div>
            </div>
            <div
              key="leadsClosedRow1"
              data-grid={{
                w: 2,
                h: 2,
                x: 8,
                y: 7,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <CountCard
                  count={
                    !isEmpty(monthlyQuaterlyRevenue) &&
                    monthlyQuaterlyRevenue.leads_closed
                  }
                  name={"Leads Closed this month"}
                  className={"dashboard_card_count leads_closed_gradient"}
                />
              </div>
            </div>
            <div
              key="notificationAlertsRow1"
              data-grid={{
                w: 2,
                h: 8,
                x: 10,
                y: 1,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <NotificationAlerts />
              </div>
            </div>
            {/*=====================================================================
                    row 1 end
            =====================================================================*/}

            {/*=====================================================================
                    row 2
            =====================================================================*/}
            <div
              key="graph1Row2"
              data-grid={{
                w: 3,
                h: 4,
                x: 0,
                y: 8,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <DashboardRowTwoColm1Card1 />
              </div>
            </div>
            <div
              key="graph2Row2"
              data-grid={{
                w: 3,
                h: 4,
                x: 0,
                y: 12,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <DashboardRowTwoColm1Card2 />
              </div>
            </div>
            <div
              key="graph3Row2"
              data-grid={{
                w: 5,
                h: 8,
                x: 3,
                y: 8,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <DashboardRowTwoColm2 />
              </div>
            </div>
            <div
              key="graph4Row2"
              data-grid={{
                w: 4,
                h: 8,
                x: 8,
                y: 8,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <DashboardRowTwoColm3 />
              </div>
            </div>
            {/*=====================================================================
                    row 2 end
            =====================================================================*/}
            {/*=====================================================================
                    row 3
            =====================================================================*/}
            <div
              key="cardRow3"
              data-grid={{
                w: 12,
                h: 4,
                x: 0,
                y: 16,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <DashboardRowThree />
              </div>
            </div>
            {/*=====================================================================
                    row 3 end
            =====================================================================*/}
            {/*=====================================================================
                    row 4
            =====================================================================*/}
            <div
              key="card1Row4"
              data-grid={{
                w: 5,
                h: 10,
                x: 0,
                y: 20,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <div className="new-dashboard-row-4-colm1-card">
                  <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
                    Deals in Pipeline
                  </h3>
                  <p className="text-center">(Super Hot + Opportunity leads)</p>

                  <DealsInPipeline />
                  {/* content */}
                </div>
              </div>
            </div>
            <div
              key="card2Row4"
              data-grid={{
                w: 7,
                h: 10,
                x: 5,
                y: 20,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <div className="new-dashboard-row-4-colm2-card">
                  <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
                    Leads Status funnel view
                  </h3>
                  {/* graph */}
                  {/* {!isEmpty(this.state.allLeadCount) && ( */}
                  <div className="funnel-view--newDashboard">
                    <DashboardRowFourFunnelView />
                  </div>
                  {/* )} */}
                </div>
              </div>
            </div>
            {/*=====================================================================
                    row 4 end
            =====================================================================*/}

            {/*=====================================================================
                    row 5
            =====================================================================*/}
            <div
              key="card1Row5"
              data-grid={{
                w: 5,
                h: 9,
                x: 0,
                y: 30,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <DashboardRowSixColm1Graph />
              </div>
            </div>
            <div
              key="card2Row5"
              data-grid={{
                w: 7,
                h: 9,
                x: 5,
                y: 30,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <div className="new-dashboard-row-6-colm1-card new-dashboard-row-6-colm1-card--colm2Card">
                  <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
                    My Target
                  </h3>
                  <DashboardRowSixColm2Graph />
                </div>
              </div>
            </div>
            {/*=====================================================================
                    row 5 end
            =====================================================================*/}
            {/*=====================================================================
                    row 6
            =====================================================================*/}
            <div
              key="card1Row6"
              data-grid={{
                w: 5,
                h: 12,
                x: 0,
                y: 31,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <DashboardOverviewPerformance />
              </div>
            </div>
            <div
              key="card2Row6"
              data-grid={{
                w: 7,
                h: 12,
                x: 5,
                y: 31,
                // isResizable: false,
              }}
            >
              <div className="relative-card-block">
                {this.renderDraggableHandleBlock()}
                <DashboardCalender />
              </div>
            </div>
            {/*=====================================================================
                    row 6 end
            =====================================================================*/}
          </ResponsiveReactGridLayout>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  monthlyQuaterlyRevenue: state.dashboard.monthlyQuaterlyRevenue,
});

export default connect(mapStateToProps, {
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
})(UserDahsboardMainGrid);
