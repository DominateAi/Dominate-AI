import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  Calendar,
  // Views,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
// import * as dates from "src/utils/dates";
import isEmpty from "../../../store/validations/is-empty";

// const dummyData = [1, 2, 3];

const localizer = momentLocalizer(moment);

// let allViews = Object.keys(Views).map((k) => Views[k]);

function CalendarNewScheduleCard() {
  const [allScheduleOfDay, setallScheduleOfDay] = useState([]);

  const scheduleOfDay = useSelector((state) => state.calender.todaysSchedule);

  useEffect(() => {
    if (!isEmpty(scheduleOfDay)) {
      let events = [];
      if (!isEmpty(scheduleOfDay.followupData)) {
        scheduleOfDay.followupData.forEach((element) => {
          events.push({
            id: element._id,
            start: new Date(element.followupAtTime),
            end: new Date(element.followupAtTime),
            title: element.name,
          });
        });
      }
      if (!isEmpty(scheduleOfDay.meetingData)) {
        scheduleOfDay.meetingData.forEach((element) => {
          events.push({
            id: element._id,
            start: new Date(element.meetingTime),
            end: new Date(element.meetingEndTime),
            title: element.subject,
          });
        });
      }

      setallScheduleOfDay(events);
    }
  }, [scheduleOfDay]);

  const events = [
    {
      id: 1,
      start: new Date("2021-04-12T04:48:12.729Z"),
      end: new Date("2021-04-12T05:45:00.181Z"),
      title: "Meeting",
    },
    {
      id: 2,
      start: new Date("2021-04-12T01:48:12.729Z"),
      end: new Date("2021-04-12T02:48:12.729Z"),
      title: "Follow Up",
    },
    {
      id: 3,
      start: new Date("2021-04-12T05:48:12.729Z"),
      end: new Date("2021-04-12T06:48:12.729Z"),
      title: "Meeting",
    },
  ];
  return (
    <div>
      <>
        <div className="calendar-new-schedule-card-npm-div">
          <Calendar
            events={allScheduleOfDay}
            defaultView="day"
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            // views={allViews}
            // step={60}
            // showMultiDayTimes
            // max={dates.add(
            //   dates.endOf(new Date(2015, 17, 1), "day"),
            //   -1,
            //   "hours"
            // )}
          />
        </div>

        {/* {dummyData.map((data, index) => (
          <div className="new-calendar-schedule-card row mx-0 align-items-center">
            <p className="font-24-semibold new-calendar-schedule-card__text-1 flex-shrink-0">
              <img
                className="new-calendar-schedule-card__clock-icon"
                src={require("../../../assets/img/calendar-new/new-calendar-clock-icon.svg")}
                alt="clock"
              />
              11:00 AM
            </p>
            <hr className="flex-grow-1" />
          </div>
        ))} */}
      </>
    </div>
  );
}

export default CalendarNewScheduleCard;
