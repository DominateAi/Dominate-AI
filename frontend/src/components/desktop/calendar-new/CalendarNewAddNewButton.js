import React, { Component } from "react";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import CalenderAddLeave from "../calender/CalenderAddLeave";
import CalenderAddHoliday from "../calender/CalenderAddHoliday";
import AddFollowUpInCalender from "../calender/AddFollowUpInCalender";
import CalendarAddMeeting from "./CalendarAddMeeting";

export class CalendarNewAddNewButton extends Component {
  state = {
    defaultOption: "",
    openAddLeadModal: false,
  };

  onVisibleChange = (visible) => {
    console.log(visible);
  };

  render() {
    const menu = (
      <Menu>
        <MenuItem>
          <AddFollowUpInCalender
            buttonClassName="new-dashboard-rc-option"
            buttonText="Follow up"
          />
        </MenuItem>
        <Divider />
        <MenuItem>
          <CalendarAddMeeting />
        </MenuItem>
        <Divider />
        <MenuItem>
          <CalenderAddHoliday
            buttonClassName="new-dashboard-rc-option"
            buttonText="Holiday"
          />
        </MenuItem>
        <Divider />
        <MenuItem>
          <CalenderAddLeave
            buttonClassName="new-dashboard-rc-option"
            buttonText="Leave"
          />
        </MenuItem>
      </Menu>
    );
    return (
      <>
        <DropdownIcon
          trigger={["click"]}
          overlay={menu}
          animation="none"
          onVisibleChange={this.onVisibleChange}
          overlayClassName="add-account-dropdown"
        >
          <button className="new-calendar-add-new-button font-18-medium dashboard_add_lead_customer_and_all_button">
            + Add New{" "}
            <span className="new-calendar-add-new-button__line">|</span>
            <i className="fa fa-chevron-down"></i>
          </button>
        </DropdownIcon>
      </>
    );
  }
}

export default CalendarNewAddNewButton;
