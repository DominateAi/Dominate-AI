import React, { Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import Select from "react-select";
import { validateAddLead } from "../../../store/validations/leadsValidation/addLeadValidation";
import { connect } from "react-redux";
import { statusEmpty } from "./../../../store/actions/authAction";
import {
  addFollowUpInCalender,
  addLeadMeetingsAction,
} from "../../../store/actions/calenderAction";
import { workspaceActivityForFollowups } from "./../../../store/actions/workspaceActivityAction";

//leads follow up pkgess
// import Select from "react-select";
import DatePicker from "react-datepicker";
import CustomEditDropdown from "../common/CustomEditDropdown";
import isEmpty from "./../../../store/validations/is-empty";
import { validateAddFollowUp } from "../../../store/validations/accountsValidation/addFollowUpVlaidation";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { format } from "date-fns";

const defaultTagsValues = [];

let count = 0;
// FETCH THE LIST FROM THE BACKEND
// const list = ["Make a Call", "Email", "Meeting"];
const selectDropdownOptions = [
  { value: "Make a Call", label: "Make a Call" },
  { value: "Email", label: "Email" },
  { value: "Meeting", label: "Meeting" },
];

const selectLeadDropdownOptions = [
  { value: "lead1", label: "lead1" },
  { value: "lead2", label: "lead2" },
  { value: "lead3", label: "lead3" },
];

class AddFollowUpInCalender extends React.Component {
  state = {
    addFollowUpModel: false,
    /*===========================
      Follow up form Fields
    =============================*/
    selectLeadDropdownOptions: [],
    selectedLead: [],
    selectedLeadOption: "",
    selectedOptionDropdown: selectDropdownOptions[0],
    selectedOption: selectDropdownOptions[0].value,
    // dropdown: false,
    // suggestionList: list,
    startDate: new Date(),
    startTime: new Date(),
    followUpLocation: "",
    addFollowUpForm: false,
    errors: {},
    activeEmployee: [],
    currentFollowUp: [],
    followUpSucess: false,
    hasModelCLose: false,
    accountLeadsFollowUp: "Make a Call",
  };

  /*===============================
        Lifecycle Methods
  ================================*/

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allLeads) &&
      nextProps.allLeads !== nextState.allLeads &&
      !nextState.hasSet
    ) {
      let leadOption = [];
      if (!isEmpty(nextProps.allLeads)) {
        nextProps.allLeads.forEach((ele) => {
          leadOption.push({ value: ele._id, label: ele.name });
        });
      }

      return {
        selectLeadDropdownOptions: leadOption,
        selectedLead: leadOption[0],
        selectedLeadOption: !isEmpty(leadOption) && leadOption[0].value,
        hasSet: true,
      };
    }
    if (
      nextProps.allLeadsOfAllPipeline &&
      nextProps.allLeads &&
      !nextState.hasPipeLeadSet
    ) {
      let finalArray = nextProps.allLeads;
      let leadOption = [];

      if (!isEmpty(nextProps.allLeadsOfAllPipeline)) {
        nextProps.allLeadsOfAllPipeline.forEach((ele) => {
          finalArray.push(ele);
        });
      }

      if (!isEmpty(finalArray)) {
        finalArray.forEach((ele) => {
          leadOption.push({ value: ele._id, label: ele.name });
        });
      }

      return {
        selectLeadDropdownOptions: leadOption,
        selectedLead: leadOption[0],
        selectedLeadOption: !isEmpty(leadOption) && leadOption[0].value,
        hasPipeLeadSet: true,
      };
    }
    return null;
  }

  /*===============================
    Lead Follow Up Popup dropdown
  ================================*/
  // componentDidMount() {
  // document.addEventListener("click", this.onDropdownClick);
  // document.addEventListener("keypress", this.onDropdownKeyPress);
  // }

  componentDidUpdate() {}

  onSelectDropdownSelect = (e) => {
    this.setState({
      selectedOption: e.value,
      selectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  onSelectLeadDropdownSelect = (e) => {
    this.setState({
      selectedLeadOption: e.value,
      selectedLead: e,
    });
  };

  /*===============================
    Lead Follow Up Popup Actions
  ================================*/

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChangeTime = (time) => {
    if (time === null) {
      this.setState({
        startTime: new Date(),
      });
    } else {
      this.setState({
        startTime: time,
      });
    }
  };

  handleChangeDate = (date) => {
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      this.setState({
        startDate: date,
      });
    }
  };

  callBackAddFollowup = (status) => {
    const { followupdDataToFetchMemberLog } = this.props;
    if (status === 200) {
      this.setState({
        addFollowUpModel: false,
      });
      if (!isEmpty(followupdDataToFetchMemberLog)) {
        this.props.workspaceActivityForFollowups(followupdDataToFetchMemberLog);
      }
    }
  };

  handleSaveFollowUp = (e) => {
    e.preventDefault();
    const { selectedDate } = this.props;
    console.log(this.state);
    const { errors, isValid } = validateAddFollowUp(this.state);
    if (!isValid) {
      this.setState({ errors });
    } else {
      const { leadActivityData } = this.props;
      if (this.state.selectedOption === "Meeting") {
        const newMeeting = {
          subject: this.state.selectedOption,
          meetingDate: this.state.startDate,
          meetingTime: this.state.startTime,
          location: this.state.followUpLocation,
          assigned: leadActivityData._id,
          assignedPipelead: leadActivityData._id,
        };
        console.log(newMeeting);
        this.props.addLeadMeetingsAction(newMeeting);
      } else {
        const newFollowUp = {
          name: this.state.accountLeadsFollowUp,
          type:
            this.state.accountLeadsFollowUp === "SMS"
              ? "SMS"
              : this.state.accountLeadsFollowUp === "Email"
              ? "EMAIL"
              : this.state.accountLeadsFollowUp === "Whatsapp"
              ? "WHATSAPP"
              : "CALL",
          entityType: "LEAD",
          entityId: this.state.selectedLeadOption,
          followupAtDate: this.state.startDate,
          followupAtTime: this.state.startTime,
          assigned: this.state.selectedLeadOption,
          assignedPipelead: this.state.selectedLeadOption,
          notification: true,
          status: "NEW",
        };

        this.props.addFollowUpInCalender(
          newFollowUp,
          format(selectedDate, "M"),
          format(selectedDate, "YYYY"),
          format(selectedDate, "D"),
          this.callBackAddFollowup
        );
      }
    }
  };

  onOpenModal = () => {
    this.props.statusEmpty();
    this.setState({
      addFollowUpModel: true,
      followUpSucess: false,
      hasModelCLose: false,
    });
  };

  onCloseModal = () => {
    this.setState({
      addFollowUpModel: false,
      /*===========================
        Follow up form Fields
      =============================*/
      selectedOptionDropdown: selectDropdownOptions[0],
      selectedOption: selectDropdownOptions[0].value,
      // dropdown: false,
      // suggestionList: list,
      startDate: new Date(),
      startTime: new Date(),
      followUpLocation: "",
      addFollowUpForm: false,
      errors: {},
    });
  };

  /*=================================
   follow up select On click Handler
  ==================================*/
  onClickFllowUpButton = (followup) => (e) => {
    e.preventDefault();
    console.log(followup);
    this.setState({
      accountLeadsFollowUp: followup,
    });
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  /*===============================
     Render Follow up form 
  ================================*/

  renderFolloupFields = () => {
    const { selectedOption, errors } = this.state;

    return (
      <Fragment>
        <div className="add-lead-modal-container add-lead-modal-container--followUp">
          <h1 className="font-21-bold mb-30">Add Follow up for</h1>
          <form noValidate onSubmit={this.handleSaveFollowUp}>
            <div className="add-lead-form-field-block add-follow-up-main-container">
              <div className="follow-up-select mb-30">
                <input readOnly className="invisible d-none" autoFocus />

                {/* <CustomEditDropdown
                  id="selectedOption"
                  name="selectedOption"
                  value={this.state.selectedOption}
                  readOnly={true}
                  onInputChangeHandler={this.onDropdownChange}
                  dropDownToggler={this.dropDownToggler}
                  dropDown={this.state.dropdown}
                  suggestionList={this.state.suggestionList}
                  dropDownSelect={this.dropDownSelect}
                  placeholder={"Select"}
                /> */}

                <Select
                  className="react-select-follow-up-form-container"
                  classNamePrefix="react-select-follow-up-form"
                  isSearchable={false}
                  options={this.state.selectLeadDropdownOptions}
                  value={this.state.selectedLead}
                  onChange={(e) => this.onSelectLeadDropdownSelect(e)}
                  placeholder="Select"
                />
                {!isEmpty(errors) && (
                  <p className="is-invalid">{errors.selectedLeadOption}</p>
                )}
              </div>
              <div className="follow-up-select mb-30">
                <input readOnly className="invisible d-none" autoFocus />

                {/* <CustomEditDropdown
                  id="selectedOption"
                  name="selectedOption"
                  value={this.state.selectedOption}
                  readOnly={true}
                  onInputChangeHandler={this.onDropdownChange}
                  dropDownToggler={this.dropDownToggler}
                  dropDown={this.state.dropdown}
                  suggestionList={this.state.suggestionList}
                  dropDownSelect={this.dropDownSelect}
                  placeholder={"Select"}
                /> */}

                {/*<Select
                  className="react-select-follow-up-form-container"
                  classNamePrefix="react-select-follow-up-form"
                  isSearchable={false}
                  options={selectDropdownOptions}
                  value={this.state.selectedOptionDropdown}
                  onChange={(e) => this.onSelectDropdownSelect(e)}
                  placeholder="Select"
                />*/}
                <div className="set_level_and_status_of_lead set_level_and_status_of_lead--status set_level_and_status_of_lead--followup ml-0 mb-30">
                  {/*<p>Type of Follow up</p>*/}
                  <button
                    onClick={this.onClickFllowUpButton("Make a Call")}
                    className={
                      this.state.accountLeadsFollowUp === "Make a Call"
                        ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                        : "select-lead-followup-by-btn"
                    }
                  >
                    {/* <span>📞</span> */}
                    Make a Call
                  </button>
                  <button
                    onClick={this.onClickFllowUpButton("Email")}
                    className={
                      this.state.accountLeadsFollowUp === "Email"
                        ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                        : "select-lead-followup-by-btn"
                    }
                  >
                    {/* <img
                      src={require("../../../assets/img/leads-new/email.png")}
                      alt="gradient"
                      className="add-leads-status-img"
                    />{" "} */}
                    <span>Email</span>
                  </button>
                  <button
                    onClick={this.onClickFllowUpButton("Whatsapp")}
                    className={
                      this.state.accountLeadsFollowUp === "Whatsapp"
                        ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                        : "select-lead-followup-by-btn"
                    }
                  >
                    {/* <img
                        src={require("../../../assets/img/leads-new/status/status3.png")}
                        alt="gradient"
                        className="add-leads-status-img"
                     />{" "}*/}
                    <span>Whatsapp</span>
                  </button>
                  <button
                    onClick={this.onClickFllowUpButton("SMS")}
                    className={
                      this.state.accountLeadsFollowUp === "SMS"
                        ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                        : "select-lead-followup-by-btn"
                    }
                  >
                    {/* <img
                      src={require("../../../assets/img/leads-new/sms.png")}
                      alt="sms"
                      className="add-leads-status-img"
                    />{" "} */}
                    <span>SMS</span>
                  </button>
                </div>
              </div>

              <div className="follow-up-date-time-section mb-30">
                <div className="follow-up-date leads-title-block-container__date-picker">
                  <label htmlFor="date" className="font-21-medium">
                    Date for scheduling
                  </label>
                  <div className="d-flex align-items-center justify-content-end leads-title-block-container__date-picker mb-10 mx-0">
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
                      selected={this.state.startDate}
                      onChange={this.handleChangeDate}
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </div>
                </div>
                <div className="follow-up-time leads-title-block-container__date-picker">
                  <label htmlFor="date" className="font-21-medium">
                    Time for scheduling
                  </label>
                  <div className="d-flex align-items-center justify-content-end leads-title-block-container__date-picker mb-10 mx-0">
                    <span
                      className="font-24-semibold mr-30"
                      role="img"
                      aria-labelledby="clock"
                    >
                      {/* clock */}
                      {/* &#x1F552; */}
                    </span>
                    <DatePicker
                      selected={this.state.startTime}
                      onChange={this.handleChangeTime}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      dateFormat="h:mm aa"
                      timeCaption="Time"
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </div>
                </div>
              </div>
              {selectedOption === "Meeting" && (
                <div className="mb-30">
                  <label
                    htmlFor="followUpLocation"
                    className="add-lead-label font-21-medium ml-0 pb-16"
                  >
                    Enter Your Location
                  </label>
                  <br />
                  <input
                    htmlFor={"followUpLocation"}
                    id={"followUpLocation"}
                    name={"followUpLocation"}
                    placeholder={"Eg. India"}
                    onChange={this.handleChange}
                    value={this.state.followUpLocation}
                    maxLength={maxLengths.char30}
                    className="add-lead-input-field font-18-regular m-0 w-100"
                  />
                  {errors.followUpLocation && (
                    <div className="is-invalid tasklist-duration-fields mt-0 mb-0 ml-2">
                      {errors.followUpLocation}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* buttons */}
            <div className="pt-25 text-right">
              <button
                type="submit"
                className="save_new_lead_button m-0"
                //className="btn-funnel-view btn-funnel-view--files m-0"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Fragment>
    );
  };

  render() {
    const { addFollowUpModel } = this.state;

    console.log(this.state.singleAccountData);

    return (
      <>
        {/* modal link */}
        <button
          className={this.props.buttonClassName}
          onClick={this.onOpenModal}
        >
          {this.props.buttonText}
        </button>

        {/* modal content */}
        <Modal
          open={addFollowUpModel}
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
          {this.renderFolloupFields()}
        </Modal>
      </>
    );
  }
}

const buttonTextDefault = (
  <>
    <img
      // src={require("../../../../src/assets/img/leads-new/calendar.svg")}
      src="/img/desktop-dark-ui/icons/lead-add-followup.svg"
      alt=""
    />{" "}
    Add Followup
  </>
);

AddFollowUpInCalender.defaultProps = {
  buttonClassName: "calender_add_followup_btn",
  buttonText: buttonTextDefault,
};

const mapStateToProps = (state) => ({
  allLeads: state.leads.allLeads,
  selectedDate: state.calender.selectedDate,
  allLeadsOfAllPipeline: state.leadsPipeline.allLeadsOfAllPipeline,
});

export default connect(mapStateToProps, {
  addFollowUpInCalender,
  addLeadMeetingsAction,
  statusEmpty,
  workspaceActivityForFollowups,
})(AddFollowUpInCalender);
