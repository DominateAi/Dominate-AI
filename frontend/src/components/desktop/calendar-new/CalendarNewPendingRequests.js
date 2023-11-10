import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import {
  approvePendingLeaves,
  acceptApprovalPending,
  updateLeaveById,
} from "./../../../store/actions/calenderAction";
import dateFns from "date-fns";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";

const dummyData = ["pending", "pending", "approved"];

function CalendarNewPendingRequests() {
  const dispatch = useDispatch();
  const [allLeaves, setAllLeaves] = useState([]);

  const allPendingAndApprovedLeaves = useSelector(
    (state) => state.calender.allPendingAndApprovedLeaves
  );

  useEffect(() => {
    if (!isEmpty(allPendingAndApprovedLeaves)) {
      setAllLeaves(allPendingAndApprovedLeaves);
    } else {
      setAllLeaves([]);
    }
  }, [allPendingAndApprovedLeaves]);

  //   /*=========================================================================
  //             handlers
  //   ==========================================================================*/

  const handleOnClickDenyRequest = (leaveData) => (e) => {
    console.log("Deny Request");

    const rejectLeave = {
      leaveType: leaveData.leaveType,
      leaveStatus: "REJECTED",
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      reason: leaveData.reason,
    };
    dispatch(
      approvePendingLeaves(
        leaveData._id,
        rejectLeave,
        "Leave Rejected",
        dateFns.format(new Date(), "M"),
        dateFns.format(new Date(), "YYYY")
      )
    );
  };

  const handleOnClickApproveRequest = (leaveData) => (e) => {
    console.log("Approve Request");

    const rejectApprove = {
      leaveType: leaveData.leaveType,
      leaveStatus: "APPROVED",
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      reason: leaveData.reason,
    };
    dispatch(
      acceptApprovalPending(
        leaveData._id,
        rejectApprove,
        "Leave Rejected",
        dateFns.format(new Date(), "M"),
        dateFns.format(new Date(), "YYYY")
      )
    );
  };

  const hideHanlder = (leaveData) => (e) => {
    const leaveHide = {
      leaveType: leaveData.leaveType,
      hidden: true,
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      reason: leaveData.reason,
    };

    dispatch(
      updateLeaveById(
        leaveData._id,
        leaveHide,
        "Leave Hide",
        dateFns.format(new Date(), "M"),
        dateFns.format(new Date(), "YYYY")
      )
    );
  };

  /*=========================================================================
            main
  ==========================================================================*/
  var userData = JSON.parse(localStorage.getItem("Data"));

  const calcDayDifference = (fromDate, toDate) => {
    return Math.abs(differenceInCalendarDays(fromDate, toDate), 1) + 1;
  };
  return (
    <>
      {!isEmpty(allLeaves) ? (
        allLeaves.map((data, index) => (
          <div
            key={index}
            className={
              data.leaveStatus === "APPROVED" || data.leaveStatus === "REJECTED"
                ? "new-calendar-pending-request-card new-calendar-pending-request-card__blur"
                : "new-calendar-pending-request-card"
            }
          >
            <div className="row mx-0 flex-nowrap align-items-start">
              <div className="new-calendar-followup-card__person-img flex-shrink-0">
                <img
                  src={`https://login.dominate.ai${data.user.profileImage}&token=${userData.token}`}
                  alt="person"
                />
              </div>
              <div className="flex-grow-1">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <p className="font-18-semibold">{data.user.name}</p>
                        <p className="new-calendar-followup-card__gray-text text-left">
                          {data.user.role.name}
                        </p>
                      </td>
                      <td className="text-right">
                        <p className="font-18-semibold new-calendar-holiday-card__text-1">
                          {dateFns.format(data.fromDate, "Do")} -
                          {dateFns.format(data.toDate, "Do MMM")}{" "}
                          {/* 23rd-25th May */}
                        </p>
                        <p className="font-13-regular new-calendar-followup-card__time-text">
                          {calcDayDifference(data.fromDate, data.toDate)}

                          {calcDayDifference(data.fromDate, data.toDate) === 1
                            ? " day"
                            : " days"}
                        </p>
                      </td>
                      <td>
                        <div className="new-calendar-followup-card__buttons-div">
                          {data.leaveStatus === "APPROVED" ? (
                            <div className="hidden_icon">
                              <p className="font-18-semibold new-calendar-holiday-card__text-1">
                                Approved
                              </p>
                              <i
                                onClick={hideHanlder(data)}
                                className="fa fa-eye"
                                aria-hidden="true"
                              ></i>
                            </div>
                          ) : data.leaveStatus === "REJECTED" ? (
                            <div className="hidden_icon">
                              <p className="font-18-semibold new-calendar-holiday-card__text-1">
                                Rejected
                              </p>
                              <i
                                onClick={hideHanlder(data)}
                                className="fa fa-eye"
                                aria-hidden="true"
                              ></i>
                            </div>
                          ) : (
                            <>
                              <button
                                className="new-calendar-followup-card__blue-border-button"
                                onClick={handleOnClickDenyRequest(data)}
                              >
                                Deny Request
                              </button>
                              <button
                                className="new-calendar-followup-card__blue-bg-button"
                                onClick={handleOnClickApproveRequest(data)}
                              >
                                Approve Request
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <hr />
          </div>
        ))
      ) : (
        <div className="text-center">
          <img
            src="/img/desktop-dark-ui/illustrations/calendar-empty-pending-requests.svg"
            alt=""
            className="calendar-empty-pending-requests-img"
          />
          <p className="font-18-medium color-white-79 mb-30">
            No Pending Requests
          </p>
        </div>
      )}
    </>
  );
}

export default CalendarNewPendingRequests;
