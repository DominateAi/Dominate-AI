import React, { Component, Fragment } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import { getAllEEmployeePendingLeaves } from "./../../../store/actions/calenderAction";
import { connect } from "react-redux";
import { approvePendingLeaves } from "./../../../store/actions/calenderAction";
import dateFns from "date-fns";

export class TeamLeaves extends Component {
  constructor() {
    super();
    this.state = {
      allPendingLeaves: []
    };
  }

  componentDidMount() {
    this.props.getAllEEmployeePendingLeaves();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    // console.log(nextProps.employeeList);

    if (
      !isEmpty(nextProps.allPendingLeaves) &&
      nextProps.allPendingLeaves !== nextState.allPendingLeaves
    ) {
      var filterData = nextProps.allPendingLeaves.filter(function(data) {
        return data.leaveStatus === "PENDING";
      });
      console.log(filterData);

      return {
        allPendingLeaves: filterData
      };
    }

    return null;
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
    this.props.approvePendingLeaves(
      leaveData._id,
      approveLeave,
      "Leave Approved"
    );
  };

  render() {
    const { allPendingLeaves } = this.state;
    console.log(allPendingLeaves);

    if (!isEmpty(allPendingLeaves)) {
      return (
        <Fragment>
          <div className="col-md-12">
            <h2 className="approval-pending-title">Approval Pending</h2>
          </div>
          {!isEmpty(allPendingLeaves) &&
            allPendingLeaves.map((leave, index) => {
              return (
                <TeamLeavesCard
                  key={index}
                  name={"Anne McIntosh"}
                  position={"position"}
                  profileImg={require("./../../../assets/img/leads/ben-1.png")}
                  leveType={
                    leave.leaveType === "HOLIDAY"
                      ? "Holiday"
                      : leave.leaveType === "SICK_LEAVE"
                      ? "Sick Leave"
                      : leave.leaveType === "PAID_LEAVE"
                      ? ""
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
            <h2 className="approval-pending-title">No Pending Leaves</h2>
          </div>
        </Fragment>
      );
    }
  }
}

const mapStateToProps = state => ({
  allPendingLeaves: state.employee.approvalPendingLeaves
});

export default connect(
  mapStateToProps,
  { getAllEEmployeePendingLeaves, approvePendingLeaves }
)(TeamLeaves);

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
