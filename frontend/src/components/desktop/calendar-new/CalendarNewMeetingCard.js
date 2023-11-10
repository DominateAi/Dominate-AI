import React, { useState, useEffect } from "react";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { format } from "date-fns";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import CalendarRescheduleMetting from "./CalendarRescheduleMetting";
import {
  deleteMeetingAction,
  updateMeetingAction,
} from "./../../../store/actions/calenderAction";
import displaySmallText from "./../../../store/utils/sliceString";

const dummyData = [1, 2];

function CalendarNewMeetingCard() {
  const dispatch = useDispatch();
  const [allMeetingsOfDay, setallMeetingsOfDay] = useState([]);
  const [clenderSelectedDate, setclenderSelectedDate] = useState([]);

  const allMeetings = useSelector((state) => state.calender.allDataOfDay);

  const selectedDate = useSelector((state) => state.calender.selectedDate);

  useEffect(() => {
    if (!isEmpty(allMeetings.meetingData)) {
      setallMeetingsOfDay(allMeetings.meetingData);
    } else {
      setallMeetingsOfDay([]);
    }
  }, [allMeetings]);

  useEffect(() => {
    if (!isEmpty(selectedDate)) {
      setclenderSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  const callbackUpdate = (status) => {
    return null;
  };
  /*=========================================================================
            handlers
  ==========================================================================*/

  const handleOnClickReschedule = () => {
    console.log("Reschedule");
  };

  const handleOnClickMarkCompleted = (meetingData) => (e) => {
    console.log("Mark Completed");

    meetingData.status = "COMPLETED";
    dispatch(
      updateMeetingAction(
        meetingData._id,
        meetingData,
        format(clenderSelectedDate, "M"),
        format(clenderSelectedDate, "YYYY"),
        format(clenderSelectedDate, "D"),
        callbackUpdate
      )
    );
  };

  /*=========================================================================
            dropdown
  ==========================================================================*/

  const onVisibleChange = (visible) => {
    console.log(visible);
  };

  const onSelect = (meetingData) => {
    console.log("delete", meetingData);
    dispatch(
      deleteMeetingAction(
        meetingData._id,
        format(clenderSelectedDate, "M"),
        format(clenderSelectedDate, "YYYY"),
        format(clenderSelectedDate, "D")
      )
    );
  };
  const renderFollowupDropdown = (meetingData) => {
    const menu = (
      <Menu>
        <MenuItem>
          {
            <CalendarRescheduleMetting
              meetingData={meetingData}
              buttonClass="new-dashboard-rc-option"
              buttonName="Edit"
            />
          }
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => onSelect(meetingData)}>
          <button className="new-dashboard-rc-option">Delete</button>
        </MenuItem>
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={onVisibleChange}
        overlayClassName="add-account-dropdown"
      >
        <img
          className="new-calendar-dropdown-icon-img"
          //src={require("../../../assets/img/calendar-new/dropdown-icon.svg")}
          src={require("../../../assets/img/calendar-new/new-dropdown-icon.svg")}
          alt=""
        />
      </DropdownIcon>
    );
  };

  /*=========================================================================
            main
  ==========================================================================*/
  return (
    <>
      {!isEmpty(allMeetingsOfDay) ? (
        allMeetingsOfDay.map((data, index) => (
          <div key={index} className="new-calendar-followup-card">
            <div className="row mx-0 flex-nowrap align-items-start">
              <div className="new-calendar-followup-card__person-img">
                <img
                  src={require("../../../assets/img/calendar-new/new-calendar-dummy-img-1.svg")}
                  alt="person"
                />
              </div>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <span className="font-18-semibold">
                          {displaySmallText(
                            !isEmpty(data.assigned)
                              ? data.assigned.name
                              : data.assignedPipelead.name,
                            15,
                            true
                          )}
                        </span>
                      </td>
                      <td className="text-right">
                        <img
                          className="new-calendar-followup-card__clock-icon"
                          src={require("../../../assets/img/calendar-new/new-calendar-clock-icon.svg")}
                          alt="clock"
                        />
                        <span className="font-18-semibold new-calendar-followup-card__clock-time-text">
                          {format(data.meetingTime, "hh:mm A")}
                        </span>
                      </td>
                      <td>
                        <div className="new-calendar-followup-card__dropdown-colm">
                          {renderFollowupDropdown(data)}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="new-calendar-followup-card__gray-text">
                          {!isEmpty(data.assigned)
                            ? data.assigned.account_id.accountname
                            : data.assignedPipelead.account_id.accountname}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="font-13-regular new-calendar-followup-card__time-text">
                          in 30 Mins
                        </span>
                      </td>
                      <td>
                        <span className="new-calendar-followup-card__dropdown-colm opacity-0">
                          .
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="new-calendar-followup-card__buttons-div row mx-0 flex-nowrap">
                  {/*<button
                      className="new-calendar-followup-card__blue-border-button"
                      onClick={handleOnClickReschedule}
                    >
                      Reschedule
                    </button>*/}
                  <CalendarRescheduleMetting
                    meetingData={data}
                    buttonClass={
                      "new-calendar-followup-card__blue-border-button"
                    }
                    buttonName={"Reschedule"}
                  />

                  {data.status === "NEW" ? (
                    <button
                      className="new-calendar-followup-card__blue-bg-button"
                      onClick={handleOnClickMarkCompleted(data)}
                    >
                      Mark Completed
                    </button>
                  ) : (
                    <button
                      className="new-calendar-followup-card__blue-bg-button"
                      // onClick={

                      //   handleOnClickMarkCompleted(data)
                      // }
                    >
                      Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
            <hr />
          </div>
        ))
      ) : (
        <div className="text-center">
          <img
            src="/img/desktop-dark-ui/illustrations/calendar-empty-meetings.svg"
            alt="no meetings"
            className="calendar-empty-meetings-img"
          />
          <p className="font-18-medium color-white-79 mb-30">No Meetings</p>
        </div>
      )}
    </>
  );
}

export default CalendarNewMeetingCard;
