import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import AddEmployeesFormFields from "./AddEmployeesFormFields";
import DatePicker from "react-datepicker";
import { validateAddEmployee } from "./../../../store/validations/employeeValidation/addEmployeeValidation";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

export class MembersNewEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editEmployeePopup: this.props.editEmployeePopup,
      prevNextIndex: 0,
      employeeId: this.props.employeeData._id,
      employeesFirstName: this.props.employeeData.firstName,
      employeesLastName: this.props.employeeData.lastName,
      employeesEmailId: this.props.employeeData.email,
      employeesJobTitle: this.props.employeeData.jobTitle,
      dateOfJoining: new Date(this.props.employeeData.dateOfJoining),

      empMonthlyTarget: "",
      errors: {},
      success: false,
    };
  }

  componentDidUpdate() {
    if (this.props.apiStatus && this.state.success) {
      this.props.onCloseModal();
    }
  }

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

    const { errors, isValid } = validateAddEmployee(this.state);
    console.log(errors);
    if (!isValid) {
      this.setState({
        errors: errors,
      });
    }
    if (isValid) {
      this.setState({
        isProfileFormDoubleClicked: !this.state.isProfileFormDoubleClicked,
        errors: {},
      });

      const { employeeId } = this.state;
      const updateEmployeeData = {
        email: this.state.employeesEmailId,
        firstName: this.state.employeesFirstName,
        lastName: this.state.employeesLastName,
        // role: this.state.empRole,
        dateOfJoining: this.state.dateOfJoining,
        jobTitle: this.state.employeesJobTitle,
      };
      this.props.updateEmployee(
        employeeId,
        updateEmployeeData,
        this.props.employeesFilterName
      );
      this.setState({
        success: true,
      });
    }
  };

  onFormKeyDownNew = (e) => {
    if (e.keyCode === 13 && e.target.name !== "SaveButtonNewEditForm") {
      e.preventDefault();
    }
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

  /*==============================
      Render Edit Employee Popup
  ================================*/
  renderEditEmployeePopup = () => {
    const { editEmployeePopup, prevNextIndex } = this.state;
    let errors = this.state.errors;

    // monthly target
    // const monthlyTargetInputField = (
    //   <div className="mb-30 new-edit-lead-form-row">
    //     <label
    //       htmlFor="empMonthlyTarget"
    //       className="add-lead-label font-24-semibold"
    //     >
    //       Monthly Target
    //     </label>
    //     <br />
    //     <div>
    //       <input
    //         type="text"
    //         pattern="[0-9]*"
    //         id="empMonthlyTarget"
    //         name="empMonthlyTarget"
    //         className="add-lead-input-field font-18-regular new-edit-lead-form-row__input"
    //         placeholder="eg. 30"
    //         value={this.state.empMonthlyTarget}
    //         onChange={this.handleChangeNumber}
    //         autoFocus
    //         maxLength={10}
    //       />
    //       {errors.empMonthlyTarget && (
    //         <div className="is-invalid add-lead-form-field-errors">
    //           {errors.empMonthlyTarget}
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // );

    /*==============================
      Render Edit Employee Form New
  ================================*/
    const renderEditEmployeeFormNew = () => {
      return (
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Edit Member</h1>

          <div className="add-lead-form-field-block new-edit-lead-form-row__emp-block ">
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
              {/* {monthlyTargetInputField} */}
              <div className="pt-25 text-right">
                <button
                  name="SaveButtonNewEditForm"
                  type="submit"
                  className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                >
                  {/*  mr-125 */}
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
        onClose={this.props.onCloseModal}
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
        <span className="closeIconInModal" onClick={this.props.onCloseModal} />
        {/* {renderEditEmployeeForm()} */}
        {renderEditEmployeeFormNew()}
      </Modal>
    );
  };

  render() {
    return (
      <>
        {/* Render employee edit popup */}
        {/* {console.log("list view", this.props.employeesFilterName)} */}
        {this.renderEditEmployeePopup()}
      </>
    );
  }
}

export default MembersNewEditForm;
