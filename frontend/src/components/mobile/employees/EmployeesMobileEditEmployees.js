import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../../desktop/common/CustomModalStyle.css";
import AddEmployeesFormFields from "../../desktop/employees/AddEmployeesFormFields";
import { validateAddEmployee } from "./../../../store/validations/employeeValidation/addEmployeeValidation";
//Customers date of joining pkges

import DatePicker from "react-datepicker";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import store from "./../../../store/store";
import { SET_FILTER_NAME } from "./../../../store/types";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

const allEmployeesOptions = [
  "All Members",
  "Archive Members",
  "Active Members",
];

class EmployeesMobileEditEmployees extends Component {
  state = {
    open: false,
    prevNextIndex: 0,
    employeesFirstName: "",
    employeesLastName: "",
    employeesEmailId: "",
    // Date of joining form Fields
    selectedOption: "",
    employeesJobTitle: "",
    dateOfJoining: new Date(),
    empRole: {},
    errors: {},
    apiErrors: {},
    success: false,
    allEmployeesDefaultOption: allEmployeesOptions[0],
  };

  /*===============================
        Lifecycle Methods
  =================================*/

  //   componentDidMount() {
  //     this.props.getAllRolesAction();
  //     store.dispatch({
  //       type: SET_FILTER_NAME,
  //       payload: this.state.allEmployeesDefaultOption
  //     });
  //   }

  //   static getDerivedStateFromProps(nextProps, nextState) {
  //     if (
  //       !isEmpty(nextProps.apiError) &&
  //       nextProps.apiError !== nextState.apiErrors
  //     ) {
  //       return {
  //         apiErrors: nextProps.apiError
  //       };
  //     }
  //     if (!isEmpty(nextProps.roles) && nextProps.roles !== nextState.empRole) {
  //       let updatedArray = nextProps.roles.filter(function(roles) {
  //         return roles.name === "Employee";
  //       });
  //       let id = updatedArray[0]._id;
  //       // console.log(id);
  //       return {
  //         empRole: id
  //       };
  //     }

  //     return null;
  //   }

  //   componentDidUpdate() {
  //     // console.log("component did upadate", this.state.apiErrors);
  //     if (
  //       this.props.apiStatus &&
  //       this.state.success &&
  //       !this.state.hasClosedModal
  //     ) {
  //       this.onCloseModal();
  //       this.setState({ hasClosedModal: true });
  //     }

  //     if (
  //       !isEmpty(this.state.apiErrors) &&
  //       this.state.apiErrors.statusCode === 400 &&
  //       !this.state.hasSetErrors &&
  //       isEmpty(this.state.errors)
  //     ) {
  //       const errors = {
  //         employeesEmailId: this.state.apiErrors.message
  //       };
  //       this.setState({
  //         prevNextIndex: 2,
  //         errors: errors,
  //         hasSetErrors: true
  //       });
  //     }
  //   }

  /*=============================
    Render AllEmployees filter
  ===============================*/
  onAllEmployeesDropdownSelect = (e) => {
    // console.log("Selected: " + e.value);
    this.setState({
      allEmployeesDefaultOption: e.value,
    });
    store.dispatch({
      type: SET_FILTER_NAME,
      payload: e.value,
    });
    if (e.value === "All Members") {
      const allEmployeeQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {},
      };
      this.props.getAllEmployeesWithAdmin(allEmployeeQuery);
    } else if (e.value === "Archive Members") {
      const filterByLevel = {
        query: {
          status: "ARCHIVE",
        },
      };
      this.props.filterAllEmployeesByLevelAction(filterByLevel);
    } else if (e.value === "Active Members") {
      const filterByLevel = {
        query: {
          status: "ACTIVE",
        },
      };
      this.props.filterAllEmployeesByLevelAction(filterByLevel);
    } else {
      // console.log("not selected");
    }
  };

  renderEmployeesFilter = () => {
    return (
      <>
        <Dropdown
          className="lead-status-dropDown lead-status-dropDown--importExport lead-status-dropDown--importExport--all-lead"
          options={allEmployeesOptions}
          value={this.state.allEmployeesDefaultOption}
          onChange={this.onAllEmployeesDropdownSelect}
        />
      </>
    );
  };

  /*===============================
    Customers Date pf joining handle
  ================================*/
  handleChangeDate = (date) => {
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

  /*===============================
      Model Open Handlers
  =================================*/

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      prevNextIndex: 0,
      employeesFirstName: "",
      employeesLastName: "",
      employeesEmailId: "",
      // Date of joining form Fields
      selectedOption: "",
      employeesJobTitle: "",
      dateOfJoining: new Date(),
      empRole: {},
      errors: {},
      apiErrors: {},
    });
  };

  /*==============================
      Form Events Handlers
  ================================*/

  handleChange = (e) => {
    this.props.remove_errorss();
    this.setState({
      errors: {},
      apiErrors: {},
      success: false,
      hasSetErrors: false,
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { employeesFilterName } = this.props;
    // console.log(this.state);
    const newEmployee = {
      email: this.state.employeesEmailId,
      firstName: this.state.employeesFirstName,
      lastName: this.state.employeesLastName,
      role: this.state.empRole,
      dateOfJoining: this.state.dateOfJoining,
      jobTitle: this.state.employeesJobTitle,
    };
    this.props.addEmployeesAction(newEmployee, employeesFilterName);
    // if (isEmpty(this.state.apiErrors)) {
    //   this.onCloseModal();
    // }
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

  handleNext = () => {
    const { errors, isValid } = validateAddEmployee(this.state);
    this.setState({
      success: false,
      apiErrors: {},
      hasSetErrors: false,
    });
    if (this.state.prevNextIndex === 0) {
      if (errors.employeesFirstName) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (this.state.prevNextIndex === 1) {
      if (errors.employeesLastName) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (this.state.prevNextIndex === 2) {
      if (errors.employeesEmailId) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (this.state.prevNextIndex === 3) {
      if (errors.employeesJobTitle) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    } else {
      this.setState({
        prevNextIndex: this.state.prevNextIndex + 1,
        errors: {},
      });
    }
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*============================
    Render Add Employee Model
  =============================*/

  renderAddEmployeesForm = () => {
    const { open, prevNextIndex } = this.state;
    let errors = this.state.errors;
    // console.log(errors);
    return (
      <Modal
        open={open}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Edit Member</h1>

          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <>
                  <div className="add-lead-prev-icon" onClick={this.handlePrev}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                      alt="previous"
                    />
                  </div>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
                  alt="previous"
                  className="add-lead-prev-icon"
                  onClick={this.handlePrev}
                />*/}
                </>
              )}

              {prevNextIndex >= 4 ? (
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
            <form onSubmit={this.handleSubmit}>
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
                  error={errors.employeesEmailId ? errors.employeesEmailId : ""}
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
                  <div className="employees-dte-of-joining leads-title-block-container__date-picker">
                    <DatePicker
                      minDate={new Date()}
                      selected={this.state.dateOfJoining}
                      onChange={this.handleChangeDate}
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </div>
                </Fragment>
              ) : (
                ""
              )}

              {prevNextIndex === 4 ? (
                <button
                  className="float-right btn-funnel-view btn-funnel-view--add-lead-save-btn mr-30 "
                  type="submit"
                  value="submit"
                >
                  Save
                </button>
              ) : (
                ""
              )}
            </form>
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    return (
      <Fragment>
        <span onClick={this.onOpenModal}>Edit</span>

        {this.renderAddEmployeesForm()}
      </Fragment>
    );
  }
}

export default EmployeesMobileEditEmployees;
