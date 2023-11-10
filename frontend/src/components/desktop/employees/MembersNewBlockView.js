import React, { Component } from "react";
import dateFns from "date-fns";
import { Link } from "react-router-dom";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import "../common/CustomModalStyle.css";
import SkyLight from "react-skylight";
// import { employeeBlockCardPopupAction } from "./../../../store/actions/employeeAction";
import { connect } from "react-redux";
import {
  deleteEmployee,
  updateEmployee,
  updateEmployeeStatus,
} from "./../../../store/actions/employeeAction";
import isEmpty from "./../../../store/validations/is-empty";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MembersNewEditForm from "./MembersNewEditForm";
export class MembersNewBlockView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeBlockViewPopupData: {},
      editEmployeePopup: false,
      empEditData: {},
    };
  }

  /*======================================
            Lifecycle Methods
  ========================================*/
  // static getDerivedStateFromProps(nextProps, nextState) {
  //   if (
  //     nextProps.employeeBlockViewPopupData !==
  //     nextState.employeeBlockViewPopupData
  //   ) {
  //     return {
  //       employeeBlockViewPopupData: nextProps.employeeBlockViewPopupData,
  //     };
  //   }
  //   return null;
  // }

  handleDelete = () => {
    console.log("clicked on delete icon");
  };

  /*================================
        Modal Event Handler
  ==================================*/
  onCloseModal = () => {
    this.setState({
      editEmployeePopup: false,
    });
  };

  /*=============================
    Render Employee Edit
  ==============================*/

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
        {/* <Divider /> */}
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

  /*=============================
    main
  ==============================*/

  render() {
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    const { employeeData } = this.props;
    const { employeeBlockViewPopupData, editEmployeePopup } = this.state;

    // let dataInArray = [];
    // if (employeeBlockViewPopupData) {
    //   dataInArray = employeeBlockViewPopupData;
    // }

    const percentage = !isEmpty(employeeData.conversionRate)
      ? employeeData.conversionRate
      : 0;
    return (
      <>
        {/* Render employee edit popup */}
        {editEmployeePopup && (
          <MembersNewEditForm
            {...this.props}
            editEmployeePopup={this.state.editEmployeePopup}
            employeeData={this.state.empEditData}
            onCloseModal={this.onCloseModal}
          />
        )}

        <div className="members-new-block-view-container">
          <div className="row mx-0 flex-nowrap members-new-block-view-container__row1">
            <div className="row mx-0 flex-nowrap">
              <div className="flex-shrink-0 members-new-block-view-container__img-block">
                <img
                  src={`${employeeData.profileImage}&token=${dataToken.token}`}
                  alt="employee"
                  className="employees-large-card__profileImg"
                />
              </div>
              <div>
                <div className="mb-25 members-new-block-view__text-div">
                  <h3 className="font-21-bold members-new-block-view__text">
                    {employeeData.name}
                  </h3>
                  <p className="members-new-block-view__text-1">
                    {this.props.position}
                  </p>
                  <div className="row mx-0 align-items-center">
                    <p className="members-new-block-view__text-2">
                      {employeeData.status === "ACTIVE"
                        ? "Active"
                        : employeeData.status === "INVITED"
                        ? "Inactive"
                        : employeeData.status === "ARCHIVE"
                        ? "Archive"
                        : ""}
                    </p>
                    <i className="fa fa-circle members-new-block-view__text-2-fa-circle"></i>
                    <p className="members-new-block-view__text-2">
                      {" "}
                      Joined on{" "}
                      {dateFns.format(employeeData.dateOfJoining, "DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
                <div className="row mx-0 mb-30">
                  <Link
                    to={{
                      pathname: "/members-new-details",
                      state: { detail: employeeData },
                    }}
                  >
                    <span className="members-new-list-btn members-new-list-btn--view">
                      View Details
                    </span>
                  </Link>

                  <button
                    className="members-new-list-btn-edit"
                    onClick={() => this.onSelect("editEmployee", employeeData)}
                  >
                    <img
                      src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </div>
            <div>{this.renderEmployeeEdit(employeeData)}</div>
          </div>
          <div className="row mx-0 justify-content-between mb-30">
            <div className="members-new-block-view__text-follow-up-block">
              <p className="font-21-bold members-new-block-view__text-follow-up">
                Follow ups
              </p>
              <span className="members-new-block-view__text-count">
                {employeeData.followupCount}
              </span>
            </div>
            <div className="members-new-block-view__text-follow-up-block">
              <p className="font-21-bold members-new-block-view__text-follow-up">
                Calls
              </p>
              <span className="members-new-block-view__text-count">
                {employeeData.callCount}
              </span>
            </div>
            <div className="members-new-block-view__text-follow-up-block">
              <p className="font-21-bold members-new-block-view__text-follow-up">
                meetings
              </p>
              <span className="members-new-block-view__text-count">
                {employeeData.meetingsCount}
              </span>
              <h3>{employeeData.leadsCount}</h3>
              {/* <h3>{dataInArray.leavesTaken}</h3> */}

              {/* {!isEmpty(dataInArray.assignedTask)
              ? dataInArray.assignedTask.map((task, index) => {
                  return (
                    <p key={index} className="font-21-regular mb-21">
                      {task.name}
                    </p>
                  );
                })
              : "No task found"} */}
            </div>
          </div>
          <div className="mb-30">
            <p className="font-21-bold members-new-block-view__text-follow-up">
              upcoming leaves
            </p>
            <span className="members-new-block-view__leads-closed">
              12-07-2020
            </span>
            <span className="members-new-block-view__text-upcoming-leaves-light">
              To
            </span>
            <span className="members-new-block-view__leads-closed">
              17-07-2020
            </span>
            {/* {!isEmpty(dataInArray.upcomingLeaves) ? (
              dataInArray.upcomingLeaves.map((leave, index) => {
                return (
                  <p
                    key={index}
                    className="members-new-block-view__text-upcoming-leaves"
                  >
                    10th November
                  </p>
                );
              })
            ) : (
              <span className="members-new-block-view__text-upcoming-leaves">
                No upcoming leaves found
              </span>
            )} */}
          </div>
          <div className="row mx-0">
            <div>
              <p className="font-21-bold members-new-block-view__text-follow-up">
                Lead closure efficiency
              </p>
              <span className="members-new-block-view__leads-closed">
                {employeeData.closedCount} Leads Closed
              </span>
            </div>
            <div className="members-new-CircularProgressbar">
              <CircularProgressbar
                value={parseInt(employeeData.closedPercentage)}
                text={`${parseInt(employeeData.closedPercentage)}%`}
                styles={buildStyles({
                  strokeLinecap: "round",
                  pathTransitionDuration: 0.5,
                  pathTransition: "none",
                  // Colors
                  pathColor: "#BCA2E7",
                  textColor: "#303030",
                  trailColor: "#EFEFF0",
                  backgroundColor: "#3e98c7",
                })}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  // employeeBlockViewPopupData: state.employee.employeeBlockViewPopupData,
  apiStatus: state.auth.status,
  userRole: state.auth.user.role.name,
  employeesFilterName: state.filterName.filterName,
  searchInAllPage: state.search.searchInAllPage,
});

export default connect(mapStateToProps, {
  // employeeBlockCardPopupAction,
  deleteEmployee,
  updateEmployee,
  updateEmployeeStatus,
})(MembersNewBlockView);
