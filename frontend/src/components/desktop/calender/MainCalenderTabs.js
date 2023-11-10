import React, { Component, Fragment } from "react";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import Navbar from "./../header/Navbar";
// import Calender from "./Calender";
import FollowUpCalender from "./FollowUpCalender";
import MettingsCalender from "./MettingsCalender";
import ApprovalPendingCalender from "./ApprovalPendingCalender";
import HolidaysCalender from "./HolidaysCalender";
import { connect } from "react-redux";
import LeavesCalender from "./LeavesCalender";
import store from "./../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";

export class MainCalenderTabs extends Component {
  componentDidMount() {
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    // if (
    //   organisationData.planStatus === "CANCELLED" ||
    //   organisationData.planStatus === "PAYMENT_FAILED"
    // ) {
    //   this.props.history.push("/profile");
    // }
    store.dispatch({
      type: SET_PAGETITLE,
      payload: "Calendar",
    });
  }

  render() {
    const { userRole } = this.props;
    return (
      <Fragment>
        <Navbar />
        <div className="container-fluid main-calender-tabs-container">
          <Tabs
            defaultTab="one"
            onChange={(tabId) => {
              // console.log(tabId);
            }}
          >
            <TabList>
              <Tab tabFor="one">Follow Ups</Tab>
              <Tab tabFor="two">Meetings</Tab>
              <Tab tabFor="three">
                {userRole === "Administrator" ? "Pending Approvals" : "Leaves"}{" "}
              </Tab>
              <Tab tabFor="four">Holidays</Tab>
            </TabList>
            <TabPanel tabId="one">
              <FollowUpCalender />
            </TabPanel>
            <TabPanel tabId="two">
              <MettingsCalender />
            </TabPanel>
            <TabPanel tabId="three">
              {userRole === "Administrator" ? (
                <ApprovalPendingCalender />
              ) : (
                <LeavesCalender />
              )}
            </TabPanel>
            <TabPanel tabId="four">
              <HolidaysCalender />
            </TabPanel>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  userRole: state.auth.user.role.name,
});

export default connect(mapStateToProps, {})(MainCalenderTabs);
