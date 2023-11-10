import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";
import dateFns from "date-fns";

export class LeavesHolidayCard extends Component {
  constructor() {
    super();
    this.state = {};
  }

  /*==========================================
          Component Lifecycl Method
  ===========================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.upcomingLeaves) &&
      nextProps.upcomingLeaves !== nextState.upcomingLeaves
    ) {
      return {
        upcomingLeaves: nextProps.upcomingLeaves,
        todayLeaves: nextProps.upcomingLeaves.todayLeaves,
        memberUpcomingLeaves: nextProps.upcomingLeaves.upcomingLeaves,
      };
    }
    return null;
  }

  renderLeaves = () => {
    const { memberUpcomingLeaves } = this.state;
    return (
      <>
        <p className="new-dashboard-row-seven__leaves-card-title">
          Upcoming Leaves
        </p>

        {/* overflow div */}
        <div className="new-dashboard-row-seven__leaves-overflow-block">
          {/* block 1 */}
          {!isEmpty(memberUpcomingLeaves) ? (
            memberUpcomingLeaves.map((data, index) => {
              return (
                <div
                  key={index}
                  className="new-dashboard-row-seven__leaves-border-bottom"
                >
                  <p className="mb-0">
                    <span className="new-dashboard-row-seven__leaves-blue-text">
                      {dateFns.format(data.fromDate, "Do")}
                    </span>
                    {/* <sup className="new-dashboard-row-seven__leaves-black-text">
                  th
                </sup> */}
                    <span className="new-dashboard-row-seven__leaves-black-text-dash">
                      -
                    </span>
                    <span className="new-dashboard-row-seven__leaves-blue-text">
                      {dateFns.format(data.toDate, "Do")}
                    </span>
                    {/* <sup className="new-dashboard-row-seven__leaves-black-text">
                  th
                </sup> */}
                  </p>

                  <p className="new-dashboard-row-seven__leaves-name">
                    {data.leaveType === "SICK_LEAVE"
                      ? "Sick leave"
                      : "Paid leave"}
                  </p>
                </div>
              );
            })
          ) : (
            <>
              <div className="new-dashboard-no-pending-holidays">
                {/* <img
                src={require("../../../../assets/img/illustrations/command-centre-3.svg")}
                alt="illustration"
                className="new-dashboard__no-upcoming-holiday-img"
              /> */}
                <p>No upcoming leaves</p>
              </div>
            </>
          )}

          {/* block 1 end */}
        </div>
      </>
    );
  };

  renderHolidays = () => {
    const { upcomingLeaves } = this.state;
    return (
      <>
        <p className="new-dashboard-row-seven__leaves-card-title">
          Upcoming Holidays
        </p>

        {/* overflow div */}
        <div className="new-dashboard-row-seven__leaves-overflow-block">
          {/* block 1 */}
          {/* {!isEmpty(upcomingLeaves) && console.log(upcomingLeaves.holidays)} */}
          {!isEmpty(upcomingLeaves) && !isEmpty(upcomingLeaves.holidays) ? (
            upcomingLeaves.holidays.map((holiday, index) => {
              if (index < 1) {
                return (
                  <div
                    key={index}
                    className="new-dashboard-row-seven__leaves-border-bottom"
                  >
                    <p className="mb-0">
                      <span className="new-dashboard-row-seven__leaves-blue-text">
                        {dateFns.format(holiday.toDate, "Do")}
                      </span>
                      {/* <sup className="new-dashboard-row-seven__leaves-black-text">
                        th
                      </sup> */}
                      <sup className="new-dashboard-row-seven__holiday-black-text">
                        {dateFns.format(holiday.toDate, "dddd")}
                      </sup>
                    </p>

                    <p className="new-dashboard-row-seven__leaves-name">
                      {holiday.reason}
                    </p>
                  </div>
                );
              }
            })
          ) : (
            <>
              <div className="new-dashboard-no-pending-holidays">
                {/* <img
                  src={require("../../../../assets/img/illustrations/command-centre-3.svg")}
                  alt="illustration"
                  className="new-dashboard__no-upcoming-holiday-img"
                /> */}
                <p>No upcoming holidays</p>
              </div>
            </>
          )}

          {/* block 1 end */}
        </div>
      </>
    );
  };

  renderMembers = () => {
    const { todayLeaves } = this.state;
    let data = JSON.parse(localStorage.getItem("Data"));

    return (
      <>
        <p className="new-dashboard-row-seven__leaves-card-title">
          Members on leave today
        </p>

        {/* overflow div */}
        <div className="new-dashboard-row-members-overflow-block">
          {/* block 1 */}
          {!isEmpty(todayLeaves) &&
            todayLeaves.map((member, index) => {
              return (
                <div
                  key={index}
                  className="new-dashboard-row-seven__members-img-text-block"
                >
                  <img
                    src={`https://login.dominate.ai${member.user.profileImage}&token=${data.token}`}
                    alt="person"
                    className="new-dashboard-row-seven__members-img"
                  />
                  <p className="new-dashboard-row-seven__members-text">
                    {member.user.name}
                  </p>
                </div>
              );
            })}

          {/* block 2 */}
          {/* <div className="new-dashboard-row-seven__members-img-text-block">
            <img
              src={require("../../../../assets/img/user-dashboard/avatar-user-dashboard.png")}
              alt="person"
              className="new-dashboard-row-seven__members-img"
            />
            <p className="new-dashboard-row-seven__members-text">
              Travis Miller
            </p>
          </div> */}
        </div>
      </>
    );
  };

  render() {
    // console.log(this.state.todayLeaves);
    return (
      <div className="calender_upcominleaves_holidays_card">
        {this.renderLeaves()}
        {this.renderHolidays()}
        {this.renderMembers()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  upcomingLeaves: state.dashboard.upcomingLeaves,
});

export default connect(mapStateToProps, {})(LeavesHolidayCard);
