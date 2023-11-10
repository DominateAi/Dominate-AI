import React, { Component, Fragment } from "react";
import Navbar from "./../header/Navbar";
import { connect } from "react-redux";
import store from "./../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
// import Calender from "../user-dashboard/dashboard-row-7/Calender";
import CalendarNewCustomCalendar from "./CalendarNewCustomCalendar";
import CalendarNewFollowUpCard from "./CalendarNewFollowUpCard";
import CalendarNewMeetingCard from "./CalendarNewMeetingCard";
import CalendarNewHolidaysCard from "./CalendarNewHolidaysCard";
import CalendarNewPendingRequests from "./CalendarNewPendingRequests";
import CalendarNewScheduleCard from "./CalendarNewScheduleCard";
import CalendarNewAddNewButton from "./CalendarNewAddNewButton";
import CalendarNewLeavesRequestsUsers from "./CalendarNewLeavesRequestsUsers";
import {
  getAllHolidaysInYear,
  getAllPendingAndApprovedLeaves,
  getAllDataOfTheDay,
  getTodaySchedule,
} from "./../../../store/actions/calenderAction";
import { getAllLeads } from "./../../../store/actions/leadAction";
import { getOverallPipeleads } from "./../../../store/actions/leadsPipelineAction";
import { format } from "date-fns";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

export class CalendarNew extends Component {
  componentDidMount() {
    this.props.getAllHolidaysInYear(
      format(new Date(), "M"),
      format(new Date(), "YYYY")
    );
    this.props.getAllPendingAndApprovedLeaves();
    this.props.getAllDataOfTheDay(
      format(new Date(), "D"),
      format(new Date(), "M"),
      format(new Date(), "YYYY")
    );
    this.props.getTodaySchedule(
      format(new Date(), "D"),
      format(new Date(), "M"),
      format(new Date(), "YYYY")
    );
    const allLeadQuery = {
      // pageNo: 10,
      // pageSize: 0,
      query: {},
    };
    this.props.getAllLeads(allLeadQuery);
    this.props.getOverallPipeleads(allLeadQuery);
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

  /*========================================================================================
            renderColumn1
  ========================================================================================*/
  renderColumn1 = () => {
    return (
      <div>
        <div className="dashboard_calender_card_conatiner dashboard_calender_card_conatiner--newCalendarMenu">
          {/* <Calender /> */}
          <CalendarNewCustomCalendar />
          <div className="row mx-0 justify-content-end new-calendar-note-text-1-div">
            <p className="new-calendar-note-text-1">
              <i className="fa fa-circle"></i>
              follow ups
            </p>
            <p className="new-calendar-note-text-1">
              <i className="fa fa-circle"></i>
              meetings
            </p>
            <p className="new-calendar-note-text-1">
              <i className="fa fa-circle"></i>
              holidays
            </p>
          </div>
        </div>
        <div>
          <h3 className="new-calendar-card-colm-title-2 font-20-medium">
            <img
              src={require("../../../assets/img/calendar-new/schedule-label-line-icon.svg")}
              alt=""
            />{" "}
            {format(new Date(), "Do MMMM")}&apos;s Schedule
          </h3>

          <div className="new-calendar-follow-up-cards-border-left new-calendar-follow-up-cards-border-left--schedule">
            <div className="new-calendar-follow-up-cards-outer-div">
              <div className="new-calendar-follow-up-cards new-calendar-follow-up-cards--schedule">
                <CalendarNewScheduleCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /*========================================================================================
            renderColumn2
  ========================================================================================*/
  renderColumn2 = () => {
    const { selectedDate } = this.props;
    let userData = JSON.parse(localStorage.getItem("Data"));
    return (
      <div>
        <div className="row mx-0 align-items-center justify-content-between">
          <h3 className="new-calendar-card-colm-title-1 font-20-medium">
            <img
              src={require("../../../assets/img/calendar-new/agenda-lable-gray-line-icon.svg")}
              alt=""
            />
            {format(selectedDate, "Do MMMM")}&apos;s Agenda
          </h3>

          <CalendarNewAddNewButton />
        </div>
        <div className="row mx-0 flex-nowrap align-items-start">
          <div>
            <h4 className="new-calendar-card-title">
              <img
                src={require("../../../assets/img/calendar-new/follow-up-label-circle.svg")}
                alt=""
              />
              follow ups
            </h4>

            <div className="new-calendar-follow-up-cards-border-left">
              <div className="new-calendar-follow-up-cards-outer-div">
                <div className="new-calendar-follow-up-cards">
                  <CalendarNewFollowUpCard />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="new-calendar-card-title">
              <img
                src={require("../../../assets/img/calendar-new/meetings-label-circle.svg")}
                alt=""
              />
              meetings
            </h4>
            <div className="new-calendar-follow-up-cards-border-left new-calendar-follow-up-cards-border-left--meeting">
              <div className="new-calendar-follow-up-cards-outer-div">
                <div className="new-calendar-follow-up-cards new-calendar-follow-up-cards--meeting">
                  <CalendarNewMeetingCard />
                </div>
              </div>
            </div>

            <h4 className="new-calendar-card-title">
              <img
                src={require("../../../assets/img/calendar-new/holidays-label-circle.svg")}
                alt=""
              />
              Holidays this month
            </h4>
            <div className="new-calendar-follow-up-cards-border-left new-calendar-follow-up-cards-border-left--holidays">
              <div className="new-calendar-follow-up-cards-outer-div">
                <div className="new-calendar-follow-up-cards new-calendar-follow-up-cards--holidays">
                  <CalendarNewHolidaysCard />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 className="new-calendar-card-title new-calendar-card-title--pending-request">
            <img
              src={require("../../../assets/img/calendar-new/pending-requests-label-circle.svg")}
              alt=""
            />
            {userData.role.name === "Administrator" ? "Pending" : "Your leaves"}{" "}
            requests
          </h4>
          <div className="new-calendar-follow-up-cards-border-left new-calendar-follow-up-cards-border-left--pending-requests">
            <div className="new-calendar-follow-up-cards-outer-div">
              <div className="new-calendar-follow-up-cards new-calendar-follow-up-cards--pending-requests">
                {userData.role.name === "Administrator" ? (
                  <CalendarNewPendingRequests />
                ) : (
                  <CalendarNewLeavesRequestsUsers />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { userRole } = this.props;
    return (
      <Fragment>
        <Navbar />
        <div className="new-calendar-main-div">
          <BreadcrumbMenu
            menuObj={[
              {
                title: "Calendar",
              },
            ]}
          />
          <h2 className="page-title-new">Calendar</h2>
          <hr className="page-title-border-bottom" />

          <div className="row mx-0 flex-nowrap align-items-start">
            {this.renderColumn1()}
            {this.renderColumn2()}
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  userRole: state.auth.user.role.name,
  selectedDate: state.calender.selectedDate,
});

export default connect(mapStateToProps, {
  getAllHolidaysInYear,
  getAllPendingAndApprovedLeaves,
  getAllLeads,
  getAllDataOfTheDay,
  getTodaySchedule,
  getOverallPipeleads,
})(CalendarNew);
