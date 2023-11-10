import React, { useState, useEffect } from "react";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import CalendarEditFollowUp from "./CalendarEditFollowUp";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import {
  deleteFollowUpAction,
  updateFollowUpAction,
} from "./../../../store/actions/calenderAction";
import { format } from "date-fns";
import displaySmallText from "./../../../store/utils/sliceString";

const dummyData = ["email", "call", "whatsapp"];

function CalendarNewFollowUpCard() {
  const dispatch = useDispatch();
  const [allFollowupsOfDay, setallFollowupsOfDay] = useState([]);
  const [clenderSelectedDate, setclenderSelectedDate] = useState([]);

  const allFollowUps = useSelector((state) => state.calender.allDataOfDay);

  const selectedDate = useSelector((state) => state.calender.selectedDate);

  useEffect(() => {
    if (!isEmpty(allFollowUps.followupData)) {
      setallFollowupsOfDay(allFollowUps.followupData);
    } else {
      setallFollowupsOfDay([]);
    }
  }, [allFollowUps]);

  useEffect(() => {
    if (!isEmpty(selectedDate)) {
      setclenderSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  /*=========================================================================
            handlers
  ==========================================================================*/

  const handleOnClickReschedule = () => {
    console.log("Reschedule");
  };

  const callBackUpdate = (status) => {
    console.log("ad");
  };

  const handleOnClickMarkCompleted = (followupData) => (e) => {
    console.log("Mark Completed");
    followupData.status = "COMPLETED";

    dispatch(
      updateFollowUpAction(
        followupData._id,
        followupData,
        format(selectedDate, "M"),
        format(selectedDate, "YYYY"),
        format(selectedDate, "D"),
        callBackUpdate
      )
    );
  };

  /*=========================================================================
            dropdown
  ==========================================================================*/

  const onVisibleChange = (visible) => {
    console.log(visible);
  };

  const onSelect = (followUpData, action) => {
    if (action === "delete") {
      console.log("delete", followUpData);
      dispatch(
        deleteFollowUpAction(
          followUpData._id,
          format(clenderSelectedDate, "M"),
          format(clenderSelectedDate, "YYYY"),
          format(clenderSelectedDate, "D")
        )
      );
    }
  };

  const renderFollowupDropdown = (followUpData) => {
    const menu = (
      <Menu>
        <MenuItem>
          <CalendarEditFollowUp
            followUpData={followUpData}
            buttonClassName="lead-new-detail-edit-button"
            buttonText="Edit"
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => onSelect(followUpData, "delete")}>
          <button className="lead-new-detail-edit-button">Delete</button>
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
          src={require("../../../assets/img/calendar-new/dropdown-icon.svg")}
          alt=""
        />
      </DropdownIcon>
    );
  };

  //   /*=========================================================================
  //             main
  //   ==========================================================================*/
  return (
    <>
      <>
        {!isEmpty(allFollowupsOfDay) ? (
          allFollowupsOfDay.map((data, index) => (
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
                            {format(data.followupAtTime, "hh:mm A")}
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
                      <tr>
                        <td>
                          {data.type === "EMAIL" ? (
                            <>
                              <img
                                className="new-calendar-followup-card__email-icon"
                                src={require("../../../assets/img/calendar-new/new-calendar-email-icon.svg")}
                                alt="EMAIL"
                              />
                              <span className="new-calendar-followup-card__color-italic-text new-calendar-followup-card__color-italic-text--email-text">
                                EMAIL
                              </span>
                            </>
                          ) : data.type === "CALL" ? (
                            <>
                              <img
                                className="new-calendar-followup-card__call-icon"
                                src={require("../../../assets/img/calendar-new/new-calendar-phone-icon.svg")}
                                alt="CALL"
                              />
                              <span className="new-calendar-followup-card__color-italic-text new-calendar-followup-card__color-italic-text--call-text">
                                CALL
                              </span>
                            </>
                          ) : data.type === "WHATSAPP" ? (
                            <>
                              <img
                                className="new-calendar-followup-card__whatsApp-icon"
                                src={require("../../../assets/img/calendar-new/new-calendar-mobile-icon.svg")}
                                alt="WHATSAPP"
                              />
                              <span className="new-calendar-followup-card__color-italic-text new-calendar-followup-card__color-italic-text--whatsApp-text">
                                WHATSAPP
                              </span>
                            </>
                          ) : (
                            <>
                              <img
                                className="new-calendar-followup-card__whatsApp-icon"
                                src={require("../../../assets/img/calendar-new/new-calendar-mobile-icon.svg")}
                                alt="WHATSAPP"
                              />
                              <span className="new-calendar-followup-card__color-italic-text new-calendar-followup-card__color-italic-text--whatsApp-text">
                                SMS
                              </span>
                            </>
                          )}
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
                    <CalendarEditFollowUp
                      followUpData={data}
                      buttonClassName="new-calendar-followup-card__blue-border-button"
                      buttonText="Reschedule"
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
              src="/img/desktop-dark-ui/illustrations/calendar-empty-followups.svg"
              alt="no follow ups"
              className="calendar-empty-followups-img"
            />
            <p className="font-18-medium color-white-79 mb-30">No Follow Ups</p>
          </div>
        )}
      </>
    </>
  );
}

export default CalendarNewFollowUpCard;
