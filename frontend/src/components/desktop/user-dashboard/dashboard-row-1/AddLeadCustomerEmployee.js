import React, { Component } from "react";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import UserDashboardAddCustomer from "../../user-dashboard-add-forms/UserDashboardAddCustomer";
import UserDashboardAddMember from "../../user-dashboard-add-forms/UserDashboardAddMember";
import UserDashboardAddTask from "../../user-dashboard-add-forms/UserDashboardAddTask";
import UserDashboardFreePlanWarning from "../../user-dashboard-add-forms/UserDashboardFreePlanWarning";
import AddLead from "../../leads/AddLead";
import isEmpty from "../../../../store/validations/is-empty";
import { workspace } from "../../../../store/utils/enterprizeAccount.json";
import { workspaceId } from "../../../../store/actions/config";

export class AddLeadCustomerEmployee extends Component {
  state = {
    defaultOption: "",
    openAddLeadModal: false,
  };

  onVisibleChange = (visible) => {
    console.log(visible);
  };

  render() {
    let oraganiationData = JSON.parse(localStorage.getItem("oraganiationData"));

    let enterprizeMember = false;

    workspace.forEach((ele) => {
      if (ele.name === workspaceId) {
        enterprizeMember = true;
      }
    });

    const menu = (
      <Menu>
        <MenuItem>
          <AddLead
            isMobile={false}
            className="new-dashboard-rc-option"
            buttonText="Lead"
          />
        </MenuItem>
        <Divider />
        {/*<MenuItem>
          <UserDashboardAddCustomer />
        </MenuItem>
        <Divider />*/}
        {/* <MenuItem> */}
        {/* {!isEmpty(oraganiationData) &&
          oraganiationData.planStatus === "FREE_PLAN" &&
          !enterprizeMember ? (
            <UserDashboardFreePlanWarning dashboard={true} />
          ) : ( */}
        {/* <UserDashboardAddMember /> */}
        {/* )} */}
        {/* </MenuItem> */}
        {/* <Divider /> */}
        <MenuItem>
          <UserDashboardAddTask />
        </MenuItem>
      </Menu>
    );
    return (
      <div>
        {/* <button className="dashboard_add_lead_customer_and_all_button">
          Add +
        </button> */}
        <DropdownIcon
          trigger={["click"]}
          overlay={menu}
          animation="none"
          onVisibleChange={this.onVisibleChange}
          overlayClassName="add-account-dropdown"
        >
          <button className="dashboard_add_lead_customer_and_all_button">
            Add New
          </button>
        </DropdownIcon>
      </div>
    );
  }
}

export default AddLeadCustomerEmployee;
