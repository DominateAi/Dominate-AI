import React, { Component } from "react";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import DashboardOverviewPerformanceThisMonth from "./DashboardOverviewPerformanceThisMonth";
import DashboardOverviewPerformancePrevMonth from "./DashboardOverviewPerformancePrevMonth";
import DashBoardPerformanceAddEmployees from "./DashBoardPerformanceAddEmployees";
import { connect } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";

class DashboardOverviewPerformance extends Component {
  /*=====================================
    main method
===================================== */
  render() {
    // console.log(this.props.leadPerformaceCount);
    const { leadPerformaceCount } = this.props;
    let userCount = !isEmpty(leadPerformaceCount) && leadPerformaceCount.length;
    // console.log(userCount);
    return (
      <div className="dashboard-overview-blocks__performanceCard">
        <h3 className="font-24-bold mb-25 text-center">
          Performance Score Board
        </h3>

        <div className="activityMenuTabs activityMenuTabs--adminReport">
          <Tabs
            defaultTab="one"
            onChange={(tabId) => {
              console.log(tabId);
            }}
          >
            <TabList>
              <Tab tabFor="one">This Month</Tab>
              <Tab tabFor="two">Previous Month</Tab>
              {/* <Tab tabFor="three">All time</Tab> */}
            </TabList>
            <TabPanel tabId="one" className="pt-0">
              <DashboardOverviewPerformanceThisMonth />
            </TabPanel>
            <TabPanel tabId="two" className="pt-0">
              <DashboardOverviewPerformancePrevMonth />
            </TabPanel>
            {/* DashboardOverviewPerformanceAllTime component contents not commented.. if require in future */}
            {/* <TabPanel tabId="three" className="pt-0">
              <DashboardOverviewPerformanceAllTime />
            </TabPanel> */}
          </Tabs>
        </div>

        <div className="no_other_employees_section_performance_scoreboard">
          <DashBoardPerformanceAddEmployees
            isMobile={false}
            userCount={!isEmpty(userCount) && userCount}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  leadPerformaceCount: state.dashboard.leaderBoardCurrent,
});

export default connect(mapStateToProps, {})(DashboardOverviewPerformance);
