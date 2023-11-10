import React, { useEffect, useState } from "react";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import CalendarEditHoliday from "./CalendarEditHoliday";
import { useSelector } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";
import { format } from "date-fns";
import { deleteHolidayAction } from "./../../../store/actions/calenderAction";
import { useDispatch } from "react-redux";

const dummyData = [1, 2, 3];

function CalendarNewHolidaysCard() {
  const dispatch = useDispatch();
  const [allHolidaysOfMonth, setallHolidaysOfMonth] = useState([]);
  const allHolidaysInMonth = useSelector(
    (state) => state.calender.allHolidaysInMonth
  );

  useEffect(() => {
    if (!isEmpty(allHolidaysInMonth)) {
      setallHolidaysOfMonth(allHolidaysInMonth);
    } else {
      setallHolidaysOfMonth([]);
    }
  }, [allHolidaysInMonth]);
  /*==========================================================
            dropdown
  ===========================================================*/

  const onVisibleChange = (visible) => {
    console.log(visible);
  };

  const onSelect = (holidayData, action) => {
    if (action === "delete") {
      dispatch(
        deleteHolidayAction(
          holidayData._id,
          format(new Date(), "MM"),
          format(new Date(), "YYYY")
        )
      );
    }
  };

  const renderFollowupDropdown = (holidayData) => {
    const menu = (
      <Menu>
        <MenuItem>
          <CalendarEditHoliday
            holidayData={holidayData}
            buttonClassName="lead-new-detail-edit-button"
            buttonText="Edit"
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => onSelect(holidayData, "delete")}>
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

  /*==========================================================
            main
  ===========================================================*/

  return (
    <>
      {!isEmpty(allHolidaysOfMonth) ? (
        allHolidaysOfMonth.map((data, index) => (
          <div key={index} className="new-calendar-holiday-card">
            <div className="row mx-0 flex-nowrap align-items-start">
              <div className="new-calendar-holiday-card__img-block">
                {/* <img src="" alt="" /> */}
              </div>
              <div className="new-calendar-holiday-card__text-content">
                <p className="font-18-semibold new-calendar-holiday-card__text-1">
                  {format(data.toDate, "Do MMM YYYY")}
                </p>
                <p className="font-20-medium new-calendar-holiday-card__text-2">
                  {data.reason}
                </p>
              </div>
              <div>{renderFollowupDropdown(data)}</div>
            </div>
            <hr />
          </div>
        ))
      ) : (
        <div className="text-center">
          <img
            src="/img/desktop-dark-ui/illustrations/command-centre-3.svg"
            alt="no holidays"
            className="calendar-empty-holidays-img"
          />
          <p className="font-18-medium color-white-79">No Holidays</p>
        </div>
      )}
    </>
  );
}

export default CalendarNewHolidaysCard;
