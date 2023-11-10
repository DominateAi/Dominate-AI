import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import isEmpty from "../../../store/validations/is-empty";

export class MembersNewDetailsProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeId: "",
      employeesFirstName: "",
      employeesLastName: "",
      employeesEmailId: "",
      employeesJobTitle: "",
      dateOfJoining: "",
      hasSetData: false,
    };
  }

  /*====================================
            Lifecycle Method
  ======================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.employeeData) &&
      nextProps.employeeData !== nextState.employeeData &&
      !nextState.hasSetData
    ) {
      return {
        employeeId: nextProps.employeeData._id,
        employeesFirstName: nextProps.employeeData.firstName,
        employeesLastName: nextProps.employeeData.lastName,
        employeesEmailId: nextProps.employeeData.email,
        employeesJobTitle: nextProps.employeeData.jobTitle,
        dateOfJoining: new Date(nextProps.employeeData.dateOfJoining),
        hasSetData: true,
      };
    }
    return null;
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  /*==========================================
        handlers
  ===========================================*/

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
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

  render() {
    const { errors } = this.props;
    return (
      <>
        <div className="leads-new-details-profile-form pt-0">
          <div className="add-lead-form-field-block new-edit-lead-form-row__emp-block pl-0 mt-20 border-top-0">
            {/* Employe First Name Field */}
            <div className="leads-new-circle-block">
              <img
                src={require("../../../../src/assets/img/leads-new/profile/circle-email.svg")}
                alt=""
                className="leads-new-circle-block__circle"
              />
              <AddEmployeesFormFields
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
            </div>
            <div className="leads-new-circle-block">
              <img
                src={require("../../../../src/assets/img/leads-new/profile/circle-phone.svg")}
                alt=""
                className="leads-new-circle-block__circle"
              />
              {/* Employe Last Name Field */}
              <AddEmployeesFormFields
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
            </div>
            <div className="leads-new-circle-block">
              <img
                src={require("../../../../src/assets/img/leads-new/profile/circle-name.svg")}
                alt=""
                className="leads-new-circle-block__circle"
              />
              {/*Employee Email  field */}
              <AddEmployeesFormFields
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
            </div>
            <div className="leads-new-circle-block">
              <img
                src={require("../../../../src/assets/img/leads-new/profile/circle-source.svg")}
                alt=""
                className="leads-new-circle-block__circle"
              />
              {/*Employee Job Title  field */}
              <AddEmployeesFormFields
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
            </div>
            {/*Employee Date of joining  field */}
            <div>
              <label htmlFor="date" className="add-lead-label font-24-semibold">
                <img
                  src={require("../../../../src/assets/img/leads-new/profile/circle-tags.svg")}
                  alt=""
                  className="leads-new-circle-block__circle"
                />
                Date of Joining
              </label>
              <br />
              <div className="mt-20 ml-30">
                <div className="pl-30 d-flex align-items-center employees-dte-of-joining leads-title-block-container__date-picker mb-30 mt-0">
                  <span
                    className="font-24-semibold mr-30"
                    role="img"
                    aria-labelledby="Tear-Off Calendar"
                  >
                    {/* calendar */}
                    {/* &#x1F4C6; */}
                  </span>

                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    selected={this.state.dateOfJoining}
                    onChange={this.handleChangeJoiningDate}
                    onChangeRaw={this.handleDateChangeRaw}
                  />
                </div>
              </div>
            </div>

            <div className="text-right leads-new-details-profile-btns-row">
              <button
                className="leads-new-details-profile-cancel-btn"
                onClick={this.props.handleOnClickCancelButton}
              >
                Cancel
              </button>
              <button
                className="leads-new-details-profile-save-btn"
                onClick={this.props.handleOnClickSaveButton(this.state)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default MembersNewDetailsProfileForm;
