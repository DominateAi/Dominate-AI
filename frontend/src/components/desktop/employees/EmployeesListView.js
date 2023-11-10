import React, { Component, Fragment } from "react";
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

import Modal from "react-responsive-modal";
import AddEmployeesFormFields from "./AddEmployeesFormFields";
import DatePicker from "react-datepicker";
import dateFns, { compareAsc } from "date-fns";
import { validateAddEmployee } from "./../../../store/validations/employeeValidation/addEmployeeValidation";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

// pagination
// const totalRecordsInOnePage = 5;

const totalFormSlides = 5;

class EmployeesListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editEmployeePopup: false,
      prevNextIndex: 0,
      employeesFirstName: "",
      employeesLastName: "",
      employeesEmailId: "",
      // Date of joining form Fields
      selectedOption: "",
      employeesJobTitle: "",
      dateOfJoining: new Date(),
      empMonthlyTarget: "",
      errors: [],
      employeeId: [],
      success: false,
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

  // componentDidMount() {
  //   this.props.updateEmployee();
  // }

  componentDidUpdate() {
    if (!this.state.success && !this.state.hasSet) {
      this.setState({
        hasPoupClos: false,
        hasSet: true,
      });
    }
    if (this.props.apiStatus && this.state.success && !this.state.hasPoupClos) {
      this.onCloseModal();
      this.setState({
        success: false,
        hasPoupClos: true,
        hasSet: false,
      });
    }
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
      prevNextIndex: 0,
      // employeesFirstName: "",
      // employeesLastName: "",
      // employeesEmailId: "",
      // // Date of joining form Fields
      // selectedOption: "",
      // employeesJobTitle: "",
      // dateOfJoining: new Date(),
      // empMonthlyTarget: "",
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
        employeeId: employeeData._id,
        employeesFirstName: employeeData.firstName,
        employeesLastName: employeeData.lastName,
        employeesEmailId: employeeData.email,
        employeesJobTitle: employeeData.jobTitle,
        dateOfJoining: new Date(employeeData.dateOfJoining),
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
          Form Handler
  ===============================*/
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(this.state.employeeId);
    const { employeeId } = this.state;
    const updateEmployee = {
      // email: this.state.employeesEmailId,
      firstName: this.state.employeesFirstName,
      lastName: this.state.employeesLastName,
      // role: this.state.empRole,
      dateOfJoining: this.state.dateOfJoining,
      jobTitle: this.state.employeesJobTitle,
    };
    this.props.updateEmployee(
      employeeId,
      updateEmployee,
      this.props.employeesFilterName
    );
    this.setState({
      success: true,
    });
  };

  handlePrev = () => {
    this.setState({
      success: false,
      apiErrors: {},
      hasSetErrors: false,
      prevNextIndex: this.state.prevNextIndex - 1,
    });
  };

  // handle next on key enter
  onFormKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleNext();
    }
  };

  onFormKeyDownNew = (e) => {
    if (e.keyCode === 13 && e.target.name !== "SaveButtonNewEditForm") {
      e.preventDefault();
    }
  };

  handleNext = () => {
    // const { errors, isValid } = validateAddEmployee(this.state);
    this.setState({
      success: false,
      apiErrors: {},
      hasSetErrors: false,
    });
    this.setState({
      prevNextIndex:
        this.state.prevNextIndex < totalFormSlides
          ? this.state.prevNextIndex + 1
          : this.state.prevNextIndex,
      errors: {},
    });
    // if (this.state.prevNextIndex === 0) {
    //   if (errors.employeesFirstName) {
    //     this.setState({
    //       errors,
    //       prevNextIndex: this.state.prevNextIndex
    //     });
    //   } else {
    //     this.setState({
    //       prevNextIndex: this.state.prevNextIndex + 1,
    //       errors: {}
    //     });
    //   }
    // } else if (this.state.prevNextIndex === 1) {
    //   if (errors.employeesLastName) {
    //     this.setState({
    //       errors,
    //       prevNextIndex: this.state.prevNextIndex
    //     });
    //   } else {
    //     this.setState({
    //       prevNextIndex: this.state.prevNextIndex + 1,
    //       errors: {}
    //     });
    //   }
    // } else if (this.state.prevNextIndex === 2) {
    //   if (errors.employeesEmailId) {
    //     this.setState({
    //       errors,
    //       prevNextIndex: this.state.prevNextIndex
    //     });
    //   } else {
    //     this.setState({
    //       prevNextIndex: this.state.prevNextIndex + 1,
    //       errors: {}
    //     });
    //   }
    // } else if (this.state.prevNextIndex === 3) {
    //   if (errors.employeesJobTitle) {
    //     this.setState({
    //       errors,
    //       prevNextIndex: this.state.prevNextIndex
    //     });
    //   } else {
    //     this.setState({
    //       prevNextIndex: this.state.prevNextIndex + 1,
    //       errors: {}
    //     });
    //   }
    // } else {
    // this.setState({
    //   prevNextIndex:
    //     this.state.prevNextIndex < totalFormSlides
    //       ? this.state.prevNextIndex + 1
    //       : this.state.prevNextIndex,
    //   errors: {}
    // });
    // }
  };

  handleChangeJoiningDate = (date) => {
    if (date === null) {
      this.setState({
        dateOfJoining: new Date(),
      });
    } else {
      this.setState({
        dateOfJoining: date,
      });
    }
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
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

        <Divider />
        <MenuItem
          key="editEmployee"
          onClick={() => this.onSelect("editEmployee", employeeData)}
        >
          Edit member
        </MenuItem>
        <Divider />
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="slide-up"
        onVisibleChange={this.onVisibleChange}
      >
        <img
          className="edit-img-employee"
          src={require("./../../../assets/img/leads/edit-icon.png")}
          alt=""
        />
      </DropdownIcon>
    );
  };

  /*==============================
      Render Edit Employee Popup
  ================================*/
  renderEditEmployeePopup = () => {
    const { editEmployeePopup, prevNextIndex } = this.state;
    let errors = this.state.errors;

    // monthly target
    const monthlyTargetInputField = (
      <div className="mb-30 new-edit-lead-form-row">
        <label
          htmlFor="empMonthlyTarget"
          className="add-lead-label font-24-semibold"
        >
          Monthly Target
        </label>
        <br />
        <div>
          <input
            type="text"
            pattern="[0-9]*"
            id="empMonthlyTarget"
            name="empMonthlyTarget"
            className="add-lead-input-field font-18-regular new-edit-lead-form-row__input"
            placeholder="eg. 30"
            value={this.state.empMonthlyTarget}
            onChange={this.handleChangeNumber}
            autoFocus
            maxLength={10}
          />
          {errors.empMonthlyTarget && (
            <div className="is-invalid add-lead-form-field-errors">
              {errors.empMonthlyTarget}
            </div>
          )}
        </div>
      </div>
    );

    /*==============================
      Render Edit Employee Form 
  ================================*/
    const renderEditEmployeeForm = () => {
      return (
        <div className="add-lead-modal-container lead_page_component container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Edit Member</h1>
          <AddLeadBlueProgressbar
            percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
            skipButtonFrom={6}
            prevNextIndex={prevNextIndex}
          />
          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
                  alt="previous"
                  className="add-lead-prev-icon"
                  onClick={this.handlePrev}
                />*/}
                  <div className="add-lead-prev-icon" onClick={this.handlePrev}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                      alt="previous"
                    />
                  </div>
                </>
              )}

              {prevNextIndex >= totalFormSlides ? (
                ""
              ) : (
                <>
                  {/*<img
                    src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
                    alt="next"
                    className="add-lead-next-icon"
                    onClick={this.handleNext}
                  />*/}
                  <div className="add-lead-next-icon" onClick={this.handleNext}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
                      alt="next"
                    />
                  </div>
                </>
              )}
            </div>
            {/* form */}
            <form onSubmit={this.handleSubmit} onKeyDown={this.onFormKeyDown}>
              {/* Employe First Name Field */}
              {prevNextIndex === 0 ? (
                <AddEmployeesFormFields
                  type="text"
                  htmlFor={"employeesFirstName"}
                  labelName={"First Name of your new member?"}
                  id={"employeesFirstName"}
                  name={"employeesFirstName"}
                  placeholder={"Eg. Rajesh "}
                  onChange={this.handleChange}
                  value={this.state.employeesFirstName}
                  maxLength={maxLengths.char30}
                  error={errors.employeesFirstName}
                />
              ) : (
                ""
              )}

              {/* Employe Last Name Field */}
              {prevNextIndex === 1 ? (
                <AddEmployeesFormFields
                  type="text"
                  htmlFor={"employeesLastName"}
                  labelName={"Last Name of your new member?"}
                  id={"employeesLastName"}
                  name={"employeesLastName"}
                  placeholder={"Eg. Khanna"}
                  onChange={this.handleChange}
                  value={this.state.employeesLastName}
                  maxLength={maxLengths.char30}
                  error={errors.employeesLastName}
                />
              ) : (
                ""
              )}

              {/*Employee Email  field */}
              {prevNextIndex === 2 ? (
                <AddEmployeesFormFields
                  type="email"
                  htmlFor={"employeesEmailId"}
                  labelName={"Enter Email Iid"}
                  id={"employeesEmailId"}
                  name={"employeesEmailId"}
                  placeholder={"Eg. abc@gmail.com"}
                  onChange={this.handleChange}
                  value={this.state.employeesEmailId}
                  error={errors.employeesEmailId}
                />
              ) : (
                ""
              )}

              {/*Employee Job Title  field */}
              {prevNextIndex === 3 ? (
                <AddEmployeesFormFields
                  type="text"
                  htmlFor={"employeesJobTitle"}
                  labelName={"Enter Job Title"}
                  id={"employeesJobTitle"}
                  name={"employeesJobTitle"}
                  placeholder={"Eg. Project manager"}
                  onChange={this.handleChange}
                  value={this.state.employeesJobTitle}
                  maxLength={maxLengths.char30}
                  error={errors.employeesJobTitle}
                />
              ) : (
                ""
              )}

              {/*Employee Date of joining  field */}
              {prevNextIndex === 4 ? (
                <Fragment>
                  <label
                    htmlFor="date"
                    className="add-lead-label font-24-semibold"
                  >
                    Select Date of Joining
                  </label>
                  <br />
                  <div className="d-flex align-items-center employees-dte-of-joining leads-title-block-container__date-picker mb-30">
                    <span
                      className="font-24-semibold mr-30"
                      role="img"
                      aria-labelledby="Tear-Off Calendar"
                    >
                      {/* calendar */}
                      {/* &#x1F4C6; */}
                    </span>

                    <DatePicker
                      minDate={new Date()}
                      selected={this.state.dateOfJoining}
                      onChange={this.handleChangeJoiningDate}
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </div>
                </Fragment>
              ) : (
                ""
              )}

              {prevNextIndex === 5 && monthlyTargetInputField}

              {prevNextIndex === 5 ? (
                <div className="pt-25 text-right">
                  <button
                    type="submit"
                    className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                  >
                    Save
                  </button>
                </div>
              ) : (
                ""
              )}
            </form>

            {/*<AddLeadBlueProgressbar
              percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
              skipButtonFrom={5}
              prevNextIndex={prevNextIndex}
            />*/}
          </div>
        </div>
      );
    };

    /*==============================
      Render Edit Employee Form New
  ================================*/
    const renderEditEmployeeFormNew = () => {
      return (
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Edit Member</h1>

          <div className="add-lead-form-field-block new-edit-lead-form-row__emp-block">
            {/* form */}
            <form
              noValidate
              onSubmit={this.handleSubmit}
              onKeyDown={this.onFormKeyDownNew}
            >
              {/* Employe First Name Field */}
              <AddEmployeesFormFields
                checkboxClass="new-edit-lead-form-row"
                type="text"
                htmlFor={"employeesFirstName"}
                labelName={"First Name"}
                id={"employeesFirstName"}
                name={"employeesFirstName"}
                placeholder={"Eg. Rajesh "}
                onChange={this.handleChange}
                value={this.state.employeesFirstName}
                maxLength={maxLengths.char30}
                error={errors.employeesFirstName}
              />
              {/* Employe Last Name Field */}
              <AddEmployeesFormFields
                checkboxClass="new-edit-lead-form-row"
                type="text"
                htmlFor={"employeesLastName"}
                labelName={"Last Name"}
                id={"employeesLastName"}
                name={"employeesLastName"}
                placeholder={"Eg. Khanna"}
                onChange={this.handleChange}
                value={this.state.employeesLastName}
                maxLength={maxLengths.char30}
                error={errors.employeesLastName}
              />
              {/*Employee Email  field */}
              <AddEmployeesFormFields
                checkboxClass="new-edit-lead-form-row"
                type="email"
                htmlFor={"employeesEmailId"}
                labelName={"Email Address"}
                id={"employeesEmailId"}
                name={"employeesEmailId"}
                placeholder={"Eg. abc@gmail.com"}
                onChange={this.handleChange}
                value={this.state.employeesEmailId}
                error={errors.employeesEmailId}
              />
              {/*Employee Job Title  field */}
              <AddEmployeesFormFields
                checkboxClass="new-edit-lead-form-row"
                type="text"
                htmlFor={"employeesJobTitle"}
                labelName={"Job Title"}
                id={"employeesJobTitle"}
                name={"employeesJobTitle"}
                placeholder={"Eg. Project manager"}
                onChange={this.handleChange}
                value={this.state.employeesJobTitle}
                maxLength={maxLengths.char30}
                error={errors.employeesJobTitle}
              />
              {/*Employee Date of joining  field */}
              <div className="new-edit-lead-form-row">
                <label
                  htmlFor="date"
                  className="add-lead-label font-24-semibold"
                >
                  Date of Joining
                </label>
                <br />
                <div className="mt-10">
                  <div className="d-flex align-items-center employees-dte-of-joining leads-title-block-container__date-picker mb-30 mt-0">
                    <span
                      className="font-24-semibold mr-30"
                      role="img"
                      aria-labelledby="Tear-Off Calendar"
                    >
                      {/* calendar */}
                      {/* &#x1F4C6; */}
                    </span>

                    <DatePicker
                      minDate={new Date()}
                      selected={this.state.dateOfJoining}
                      onChange={this.handleChangeJoiningDate}
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </div>
                </div>
              </div>
              {monthlyTargetInputField}
              <div className="pt-25 text-right">
                <button
                  name="SaveButtonNewEditForm"
                  type="submit"
                  className="btn-funnel-view btn-funnel-view--add-lead-save-btn mr-125"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };

    return (
      <Modal
        open={editEmployeePopup}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal:
            "customModal customModal--addLead customModal--editLeadNew--emp",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />
        {/* {renderEditEmployeeForm()} */}
        {renderEditEmployeeFormNew()}
      </Modal>
    );
  };

  /*==========================
  Render Date of Joining
============================*/

  renderDateOfJoining = (dateOfJoining) => {
    let doj = dateFns.format(dateOfJoining, "MM/DD/YYYY");
    return doj;
  };

  render() {
    const { userRole } = this.props;
    const { allEmployeesList } = this.state;
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
        {this.renderEditEmployeePopup()}
        <div className="customer-list-view-outer-block">
          <div className="customers-list-view-title-container">
            <table className="table customers-table-title mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Date Of joining</th>
                  <th>Status</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="customers-list-view-container">
            <table className="table">
              <tbody>
                {!isEmpty(filtereddata) ? (
                  filtereddata.map((employee, index) => {
                    return (
                      index >=
                        (this.props.currentPagination - 1) *
                          this.props.totalRecordsInOnePage &&
                      index <
                        this.props.currentPagination *
                          this.props.totalRecordsInOnePage && (
                        <tr key={index}>
                          <td>
                            <img
                              src={`${employee.profileImage}&token=${dataToken.token}`}
                              // src={require("../../../assets/img/employees/employee-default.svg")}
                              className="lead-list-view-img"
                              alt="lead"
                            />
                            {employee.name}
                          </td>
                          <td>
                            {employee.role.name === "Administrator"
                              ? "Admin"
                              : employee.jobTitle}
                          </td>
                          <td>
                            {this.renderDateOfJoining(employee.dateOfJoining)}{" "}
                          </td>
                          <td>
                            <div className="pl-10">
                              {employee.status === "ACTIVE"
                                ? "Active"
                                : employee.status === "INVITED"
                                ? "Inactive"
                                : employee.status === "ARCHIVE"
                                ? "Archive"
                                : ""}
                              {userRole === "Administrator" &&
                                this.renderEmployeeEdit(employee)}
                            </div>
                          </td>
                        </tr>
                      )
                    );
                  })
                ) : (
                  <div style={{ textAlign: "center", margin: "15px" }}>
                    <h3>No Members Found</h3>
                  </div>
                )}
              </tbody>
            </table>
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
})(EmployeesListView);
