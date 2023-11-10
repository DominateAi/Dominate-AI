import React, { Component, Fragment } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import { getAllEEmployeePendingLeaves } from "./../../../store/actions/calenderAction";
import { connect } from "react-redux";
import {
  approvePendingLeaves,
  acceptApprovalPending
} from "./../../../store/actions/calenderAction";
import dateFns from "date-fns";

export class TeamLeaves extends Component {
  constructor() {
    super();
    this.state = {
      allPendingLeaves: []
    };
  }

  componentDidMount() {
    // this.props.getAllEEmployeePendingLeaves();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    // console.log(nextProps.employeeList);

    if (
      !isEmpty(nextProps.allPendingLeaves) &&
      nextProps.allPendingLeaves !== nextState.allPendingLeaves &&
      nextProps.employeeFilterLevel
    ) {
      if (nextProps.employeeFilterLevel === "OnLeave") {
        var filterData = nextProps.allPendingLeaves.filter(function(data) {
          return data.leaveStatus === "APPROVED";
        });
      } else if (nextProps.employeeFilterLevel === "UpcomingLeaves") {
        var filterData = nextProps.allPendingLeaves.filter(function(data) {
          return data.leaveStatus === "APPROVED";
        });
      } else if (nextProps.employeeFilterLevel === "ApprovalPending") {
        var filterData = nextProps.allPendingLeaves.filter(function(data) {
          return data.leaveStatus === "PENDING";
        });
      }

      console.log(nextProps.employeeFilterLevel);

      return {
        allPendingLeaves: filterData
      };
    }

    return null;
  }

  componentDidUpdate() {
    if (this.props.allPendingLeaves !== this.state.allPendingLeaves) {
      this.setState({
        allPendingLeaves: this.props.allPendingLeaves
      });
    }
  }

  /*===========================
      Button Events Handlers    
  ============================*/

  rejectHandler = leaveData => e => {
    e.preventDefault();
    console.log(leaveData);
    const rejectLeave = {
      leaveType: leaveData.leaveType,
      leaveStatus: "REJECTED",
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      reason: leaveData.reason
    };
    this.props.approvePendingLeaves(
      leaveData._id,
      rejectLeave,
      "Leave Rejected"
    );
  };

  acceptHandler = leaveData => e => {
    e.preventDefault();
    console.log(leaveData);
    const approveLeave = {
      leaveType: leaveData.leaveType,
      leaveStatus: "APPROVED",
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      reason: leaveData.reason
    };
    this.props.acceptApprovalPending(leaveData._id, approveLeave);
  };

  render() {
    const { allPendingLeaves } = this.state;
    console.log(this.props.employeeFilterLevel);
    let dataToken = JSON.parse(localStorage.getItem("Data"));

    if (!isEmpty(allPendingLeaves)) {
      return (
        <Fragment>
          <div className="col-md-12">
            <h2 className="approval-pending-title">
              {this.props.employeeFilterLevel === "OnLeave"
                ? "On Leaves"
                : this.props.employeeFilterLevel === "UpcomingLeaves"
                ? "Upcoming Leaves"
                : "Approval Pending"}
            </h2>
          </div>
          {!isEmpty(allPendingLeaves) &&
            allPendingLeaves.map((leave, index) => {
              return (
                <TeamLeavesCard
                  key={index}
                  name={leave.user.name}
                  position={leave.user.jobTitle}
                  profileImg={`https://myrltest.dominate.ai${leave.user.profileImage}&token=${dataToken.token}`}
                  leveType={
                    leave.leaveType === "HOLIDAY"
                      ? "Holiday"
                      : leave.leaveType === "SICK_LEAVE"
                      ? "Sick Leave"
                      : leave.leaveType === "PAID_LEAVE"
                      ? "Paid Leave"
                      : ""
                  }
                  duration={`${dateFns.format(
                    leave.fromDate,
                    "Do MMM"
                  )} to ${dateFns.format(leave.toDate, "Do MMM")} `}
                  description={leave.reason}
                  rejectHandler={this.rejectHandler(leave)}
                  acceptHandler={this.acceptHandler(leave)}
                  leaveData={leave}
                />
              );
            })}
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div className="col-md-12">
            <h2 className="approval-pending-title">
              {this.props.employeeFilterLevel === "OnLeave"
                ? "No On Leaves"
                : this.props.employeeFilterLevel === "UpcomingLeaves"
                ? "No Upcoming Leaves"
                : "No Pending Leaves"}
            </h2>
          </div>
        </Fragment>
      );
    }
  }
}

const mapStateToProps = state => ({
  allPendingLeaves: state.employee.approvalPendingLeaves,
  employeeFilterLevel: state.filterName.employeeLevelName
});

export default connect(mapStateToProps, {
  getAllEEmployeePendingLeaves,
  approvePendingLeaves,
  acceptApprovalPending
})(TeamLeaves);

/*==================================
    Team Leves Card functionality
====================================*/

const TeamLeavesCard = ({
  name,
  position,
  profileImg,
  leveType,
  duration,
  description,
  rejectHandler,
  acceptHandler,
  leaveData
}) => {
  return (
    <Fragment>
      <div className="col-md-4 employee-appreoval-card">
        <div className="card">
          <div className="card-header">
            <div>
              <img
                src={profileImg}
                alt="profile"
                className="employee-appreoval-card__profile-img"
              />
            </div>
            <div>
              <h3>{name}</h3>
              <p>{position}</p>
            </div>
          </div>
          <div className="card-body">
            <div className="leave-type-and-time">
              <h4>Leave Type</h4>

              <p>{leveType}</p>
            </div>
            <div className="leave-type-and-time">
              <h4>Duration</h4>

              <p>{duration}</p>
            </div>

            <h4>Description</h4>
            <p>{description}</p>
          </div>
          <div className="card-footer">
            {leaveData.leaveStatus === "APPROVED" ? (
              <button>Approved</button>
            ) : leaveData.leaveStatus === "REJECTED" ? (
              <button>Rejected</button>
            ) : (
              <Fragment>
                <button onClick={rejectHandler}>Reject</button>
                <button onClick={acceptHandler}>Accept</button>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
