import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import isEmpty from "./../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  deleteEmployee,
  updateEmployee,
  updateEmployeeStatus,
} from "./../../../store/actions/employeeAction";
// import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

import dateFns, { compareAsc } from "date-fns";
import { MembersNewEditForm } from "./MembersNewEditForm";
// pagination
// const totalRecordsInOnePage = 5;

class MembersNewListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editEmployeePopup: false,
      empEditData: {},
      // pagination
      currentPagination: 1,
      // api
      getItemsList: {},
    };
  }

  /*=================================
        Lifecycle methods
  ===================================*/

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allEmployeesList) &&
      nextProps.allEmployeesList !== nextState.allEmployeesList
    ) {
      return {
        allEmployeesList: nextProps.allEmployeesList,
        getItemsList: nextProps.allEmployeesList,
      };
    }
    return null;
  }

  // pagination
  onChangePagination = (page) => {
    this.setState({
      currentPagination: page,
    });
  };

  /*================================
        Modal Event Handler
  ==================================*/
  onCloseModal = () => {
    this.setState({
      editEmployeePopup: false,
    });
  };

  /*================================
    Dropdown Event Handler
=================================*/

  onSelect = (action, employeeData, filterName) => {
    if (action === "archive") {
      this.props.deleteEmployee(employeeData.email, filterName);
    } else if (action === "editEmployee") {
      this.setState({
        editEmployeePopup: true,
      });
      // console.log(employeeData);

      this.setState({
        empEditData: employeeData,
      });
    } else {
      const updateEmployeeStatus = {
        email: employeeData.email,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        // role: ""83805a40-8212-11e9-9932-5b1fa6f8b7ce"",
        dateOfJoining: new Date(employeeData.dateOfJoining),
        jobTitle: employeeData.jobTitle,
        status: "ACTIVE",
      };
      this.props.updateEmployeeStatus(
        employeeData._id,
        updateEmployeeStatus,
        filterName
      );
      // console.log(filterName);
    }
  };

  onVisibleChange = (visible) => {
    // console.log(visible);
  };

  /*=============================
    Render Employee Edit
  ==============================*/

  renderEmployeeEdit = (employeeData) => {
    // const { admin } = this.state;
    // console.log(employeeData);
    const menu = (
      <Menu>
        {employeeData.role.name === "Administrator" ? (
          ""
        ) : employeeData.status === "ARCHIVE" ? (
          <MenuItem
            key="restore"
            onClick={() =>
              this.onSelect(
                "restore",
                employeeData,
                this.props.employeesFilterName
              )
            }
          >
            Restore
          </MenuItem>
        ) : (
          <MenuItem
            key="archive"
            onClick={() =>
              this.onSelect(
                "archive",
                employeeData,
                this.props.employeesFilterName
              )
            }
          >
            Archive
          </MenuItem>
        )}

        {/* <Divider />
        <MenuItem
          key="editEmployee"
          onClick={() => this.onSelect("editEmployee", employeeData)}
        >
          Edit member
        </MenuItem>
        <Divider /> */}
      </Menu>
    );

    return (
      <>
        {employeeData.role.name === "Administrator" ? (
          <img
            className="members-new-dropdown-icon opacity-0"
            src={require("./../../../assets/img/icons/members-new-dropdown-icon.svg")}
            alt=""
          />
        ) : (
          <DropdownIcon
            trigger={["click"]}
            overlay={menu}
            animation="slide-up"
            onVisibleChange={this.onVisibleChange}
          >
            <img
              className="members-new-dropdown-icon"
              src={require("./../../../assets/img/icons/members-new-dropdown-icon.svg")}
              alt=""
            />
          </DropdownIcon>
        )}
      </>
    );
  };

  /*==========================
  Render Date of Joining
============================*/

  renderDateOfJoining = (dateOfJoining) => {
    let doj = dateFns.format(dateOfJoining, "DD/MM/YYYY");
    return doj;
  };

  render() {
    const { userRole } = this.props;
    const { allEmployeesList, editEmployeePopup } = this.state;
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    // console.log(this.props.apiStatus);

    // Search

    let filtereddata = [];
    if (!isEmpty(this.props.searchInAllPage)) {
      let search = new RegExp(this.props.searchInAllPage, "i");
      filtereddata = allEmployeesList.filter((getall) => {
        if (search.test(getall.name)) {
          return getall;
        }
        // if (search.test(getall.company)) {
        //   return getall;
        // }
        // if (search.test(getall.email)) {
        //   return getall;
        // }
      });
      // console.log(filtereddata);
    } else {
      filtereddata = this.state.allEmployeesList;
    }
    return (
      <Fragment>
        {/* Render employee edit popup */}
        {editEmployeePopup && (
          <MembersNewEditForm
            {...this.props}
            editEmployeePopup={this.state.editEmployeePopup}
            employeeData={this.state.empEditData}
            onCloseModal={this.onCloseModal}
          />
        )}
        <div className="customer-list-view-outer-block">
          <div className="row mx-0 members-new-list-view-container__row-heading">
            <div className="members-new-list-view-container__colm1">
              <h2 className="font-21-bold">Name</h2>
            </div>
            <div className="members-new-list-view-container__colm2">
              <h2 className="font-21-bold">Position</h2>
            </div>
            <div className="members-new-list-view-container__colm3">
              <h2 className="font-21-bold">Date Of joining</h2>
            </div>
            <div className="members-new-list-view-container__colm4">
              <h2 className="font-21-bold">Status</h2>
            </div>
            <div className="members-new-list-view-container__colm5"></div>
          </div>
          <div className="members-new-list-view-container">
            {!isEmpty(filtereddata) ? (
              filtereddata.map((employee, index) => {
                return (
                  index >=
                    (this.props.currentPagination - 1) *
                      this.props.totalRecordsInOnePage &&
                  index <
                    this.props.currentPagination *
                      this.props.totalRecordsInOnePage && (
                    <div
                      key={index}
                      className="row mx-0 align-items-center members-new-list-view-container__row-content"
                    >
                      <div className="members-new-list-view-container__colm1">
                        <div className="row mx-0 flex-nowrap align-items-center">
                          <div className="members-new-list-view-img-block">
                            <img
                              src={`${employee.profileImage}&token=${dataToken.token}`}
                              // src={require("../../../assets/img/employees/employee-default.svg")}
                              alt="member"
                            />
                          </div>
                          <span className="font-24-semibold">
                            {employee.name}
                          </span>
                        </div>
                      </div>
                      <div className="members-new-list-view-container__colm2">
                        <span className="font-21-medium">
                          {employee.role.name === "Administrator"
                            ? "Admin"
                            : employee.jobTitle}
                        </span>
                      </div>
                      <div className="members-new-list-view-container__colm3">
                        <span className="font-21-medium">
                          {this.renderDateOfJoining(employee.dateOfJoining)}{" "}
                        </span>
                      </div>
                      <div className="members-new-list-view-container__colm4">
                        <span className="font-21-medium">
                          {employee.status === "ACTIVE"
                            ? "Active"
                            : employee.status === "INVITED"
                            ? "Invited"
                            : employee.status === "ARCHIVE"
                            ? "Archive"
                            : ""}
                        </span>
                      </div>
                      <div className="members-new-list-view-container__colm5">
                        <Link
                          to={{
                            pathname: "/members-new-details",
                            state: { detail: employee },
                          }}
                        >
                          <span className="members-new-list-btn members-new-list-btn--view">
                            View Details
                          </span>
                        </Link>

                        <button
                          className="members-new-list-btn-edit"
                          onClick={() =>
                            this.onSelect("editEmployee", employee)
                          }
                        >
                          <img
                            src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
                            alt=""
                          />
                        </button>
                        {this.renderEmployeeEdit(employee)}
                      </div>
                    </div>
                  )
                );
              })
            ) : (
              <div>
                <h3 className="font-21-medium">No Members Found</h3>
              </div>
            )}
          </div>
          {/* <div className="add-lead-pagination">
            <Pagination
              onChange={this.onChangePagination}
              current={this.state.currentPagination}
              defaultPageSize={totalRecordsInOnePage}
              total={this.state.getItemsList.length}
              showTitle={false}
            />
          </div> */}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  apiStatus: state.auth.status,
  userRole: state.auth.user.role.name,
  employeesFilterName: state.filterName.filterName,
  searchInAllPage: state.search.searchInAllPage,
});

export default connect(mapStateToProps, {
  deleteEmployee,
  updateEmployee,
  updateEmployeeStatus,
})(MembersNewListView);
