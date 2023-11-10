import React, { useState, useEffect } from "react";
import store from "./../../../../store/store";
import { SET_DASHBOARD_CALENDER_WIDGET_CARD } from "./../../../../store/types";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";
import dateFns from "date-fns";
import { useSelector } from "react-redux";

function CalenderDataCard() {
  const [values, setValues] = useState({
    selectedCalenderDate: "",
  });

  const [allCardData, setAllCardData] = useState([]);
  const [dataSelected, setDateSelected] = useState("");

  const meetingFollowupOfDay = useSelector(
    (state) => state.dashboard.meetingFollowupOfDay
  );

  const selectedCalenderDate = useSelector(
    (state) => state.dashboard.selectedCalenderDate
  );

  useEffect(() => {
    if (!isEmpty(meetingFollowupOfDay)) {
      console.log(meetingFollowupOfDay);
      setAllCardData(meetingFollowupOfDay);
    }
  }, [meetingFollowupOfDay]);

  useEffect(() => {
    if (!isEmpty(selectedCalenderDate)) {
      setDateSelected(selectedCalenderDate);
    }
  }, [selectedCalenderDate]);

  const renderDataList = () => {
    console.log(allCardData);

    if (!isEmpty(meetingFollowupOfDay)) {
      return meetingFollowupOfDay.map((data, index) => {
        if (data.followupAtDate !== undefined) {
          return (
            <div
              key={index}
              className="new-dashboard-row-seven__members-img-text-block"
            >
              <img
                src={require("../../../../assets/img/leads/lead_default_img.svg")}
                alt="person"
                className="new-dashboard-row-seven__members-img"
              />
              <div className="row mx-0 new-dashboard-row-seven__calendar-data-text-block">
                <div>
                  <p className="new-dashboard-row-seven__calendar-data-text-1">
                    {data.assigned.name}
                  </p>
                  <p className="new-dashboard-row-seven__calendar-data-text-2">
                    {dateFns.format(data.followupAtTime, "h:mm a")}
                  </p>
                </div>
                <div>
                  <p className="new-dashboard-row-seven__calendar-data-text-1 new-dashboard-row-seven__calendar-data-orange-dot">
                    {data.subject !== undefined ? data.subject : "Follow up"}
                  </p>
                </div>
              </div>
            </div>
          );
        } else if (data.subject !== undefined) {
          return (
            <div
              key={index}
              className="new-dashboard-row-seven__members-img-text-block"
            >
              <img
                src={require("../../../../assets/img/leads/lead_default_img.svg")}
                alt="person"
                className="new-dashboard-row-seven__members-img"
              />
              <div className="row mx-0 new-dashboard-row-seven__calendar-data-text-block">
                <div>
                  <p className="new-dashboard-row-seven__calendar-data-text-1">
                    {data.assigned.name}
                  </p>
                  <p className="new-dashboard-row-seven__calendar-data-text-2">
                    {dateFns.format(data.meetingTime, "h:mm a")}
                  </p>
                </div>
                <div>
                  <p className="new-dashboard-row-seven__calendar-data-text-1 new-dashboard-row-seven__calendar-data-orange-dot">
                    {data.subject !== undefined ? data.subject : "Follow up"}
                  </p>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={index}
              className="new-dashboard-row-seven__members-img-text-block"
            >
              <img
                src={require("../../../../assets/img/leads/lead_default_img.svg")}
                alt="person"
                className="new-dashboard-row-seven__members-img"
              />
              <div className="row mx-0 new-dashboard-row-seven__calendar-data-text-block">
                <div>
                  <p className="new-dashboard-row-seven__calendar-data-text-1">
                    {data.reason}
                  </p>
                  <p className="new-dashboard-row-seven__calendar-data-text-2">
                    {dateFns.format(data.toDate, "h:mm a")}
                  </p>
                </div>
                <div>
                  <p className="new-dashboard-row-seven__calendar-data-text-1 new-dashboard-row-seven__calendar-data-orange-dot">
                    {data.leaveType === "HOLIDAY" && "Holiday"}
                  </p>
                </div>
              </div>
            </div>
          );
        }
      });
    } else {
      return `No data found on ${dateFns.format(dataSelected, "Do")}`;
    }
  };

  return (
    <div>
      <div className="calender_data_card">
        <div className="heading_section">
          <h3 className="new-dashboard-row-seven__leaves-card-title">
            Schedule on {dateFns.format(dataSelected, "Do")}
          </h3>

          <i
            onClick={() => {
              store.dispatch({
                type: SET_DASHBOARD_CALENDER_WIDGET_CARD,
                payload: false,
              });
            }}
            className="fa fa-times"
          ></i>
        </div>
        {/* overflow div */}
        <div className="new-dashboard-row-seven__calendar-data-card-overflow">
          {/* block 1 */}
          {renderDataList()}
        </div>
      </div>
    </div>
  );
}

export default CalenderDataCard;
