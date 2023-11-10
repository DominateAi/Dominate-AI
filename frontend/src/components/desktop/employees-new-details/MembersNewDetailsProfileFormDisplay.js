import React, { Component } from "react";
import dateFns from "date-fns";
import isEmpty from "./../../../store/validations/is-empty";

export class MembersNewDetailsProfileFormDisplay extends Component {
  /*====================================
            Lifecycle Method
  ======================================*/

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  /*==========================================
          renderNameEmail
  ===========================================*/
  renderNameEmail = () => {
    const { employeeData } = this.props;
    return (
      <>
        {/* First Name */}
        <div className="leads-new-details-col-1 mb-30">
          <label
            htmlFor="employeesFirstName"
            className="add-lead-label font-21-regular"
          >
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-email.svg")}
              alt=""
            />
            First Name
          </label>
          <br />
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(employeeData.firstName)
              ? employeeData.firstName
              : "-----"}
          </p>
        </div>

        {/* Last Name */}
        <div className="leads-new-details-col-1 mb-30">
          <label
            htmlFor="employeesLastName"
            className="add-lead-label font-21-regular"
          >
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-phone.svg")}
              alt=""
            />
            Last Name
          </label>
          <br />
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(employeeData.lastName) ? employeeData.lastName : "-----"}
          </p>
        </div>

        {/* Email Address */}
        <div className="leads-new-details-col-1 mb-30">
          <label
            htmlFor="employeesEmailId"
            className="add-lead-label font-21-regular"
          >
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-name.svg")}
              alt=""
            />
            Email Address
          </label>
          <br />
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(employeeData.email) ? employeeData.email : "-----"}
          </p>
        </div>

        {/* Job Title */}
        <div className="leads-new-details-col-1 mb-30">
          <label
            htmlFor="employeesJobTitle"
            className="add-lead-label font-21-regular"
          >
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-source.svg")}
              alt=""
            />
            Job Title
          </label>
          <br />
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(employeeData.jobTitle) ? employeeData.jobTitle : "-----"}
          </p>
        </div>

        {/* Date of Joining */}
        <div className="leads-new-details-col-1 mb-30">
          <label
            htmlFor="dateOfJoining"
            className="add-lead-label font-21-regular"
          >
            <img
              src={require("../../../../src/assets/img/leads-new/profile/circle-tags.svg")}
              alt=""
            />
            Date of Joining
          </label>
          <br />
          <p className="font-18-regular leads-new-details-profile-form-display__blue-text">
            {!isEmpty(employeeData.dateOfJoining)
              ? dateFns.format(employeeData.dateOfJoining, "DD/MM/YYYY")
              : "-----"}
          </p>
        </div>
      </>
    );
  };

  render() {
    return (
      <>
        <div className="leads-new-details-profile-form leads-new-details-profile-form--display">
          <p className="leads-new-details-profile-form-display__gray-italic-text leads-new-details-activity-log__text-gray-light-italic">
            *Double click to edit fields
          </p>
          {this.renderNameEmail()}
        </div>
      </>
    );
  }
}

export default MembersNewDetailsProfileFormDisplay;
