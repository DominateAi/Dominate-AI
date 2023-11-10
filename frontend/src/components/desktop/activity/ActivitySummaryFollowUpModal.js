import React, { useState, useEffect, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import Select from "react-select";
import { validateAddLead } from "../../../store/validations/leadsValidation/addLeadValidation";
import { connect } from "react-redux";
import { statusEmpty } from "./../../../store/actions/authAction";
import {
  addFollowUpInAccountDetails,
  addFollowUpLead,
  addLeadMeetingsAction,
} from "../../../store/actions/calenderAction";

//leads follow up pkgess
// import Select from "react-select";
import DatePicker from "react-datepicker";
import CustomEditDropdown from "../common/CustomEditDropdown";
import isEmpty from "./../../../store/validations/is-empty";
import { validateEditMeetingFollowup } from "../../../store/validations/followUpValidations/editFollowupMeeting";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { useDispatch, useSelector } from "react-redux";

const defaultTagsValues = [];

let count = 0;
// FETCH THE LIST FROM THE BACKEND
// const list = ["Make a Call", "Email", "Meeting"];
const selectDropdownOptions = [
  { value: "Make a Call", label: "Make a Call" },
  { value: "Email", label: "Email" },
  { value: "Meeting", label: "Meeting" },
];

function ActivitySummaryFollowUpModal({
  leadActivityData,
  buttonText,
  buttonClassName,
}) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
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
    activeEmployee: [],
    currentFollowUp: [],
    followUpSucess: false,
    hasModelCLose: false,
    accountLeadsFollowUp: "Make a Call",
  });

  const followUpData = useSelector((state) => state.leads.currentLeadAdded);

  useEffect(() => {
    if (!isEmpty(followUpData)) {
      setValues({
        ...values,
        currentFollowUp: followUpData,
      });
    }
  }, [followUpData]);

  const onSelectDropdownSelect = (e) => {
    setValues({
      ...values,
      selectedOption: e.value,
      selectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  // onDropdownClick = e => {
  //   if (this.state.dropdown) {
  //     if (!document.getElementById("selectedOption").contains(e.target)) {
  //       this.dropDownToggler();
  //     }
  //   }
  // };

  // onDropdownChange = e => {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   });
  // };

  // dropDownToggler = e => {
  //   this.setState({
  //     dropdown: !this.state.dropdown
  //   });
  // };

  // dropDownSelect = value => e => {
  //   this.setState({
  //     selectedOption: value,
  //     dropdown: !this.state.dropdown
  //   });
  // };

  /*===============================
    Lead Follow Up Popup Actions
  ================================*/

  const handleChange = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeTime = (time) => {
    if (time === null) {
      setValues({
        ...values,
        startTime: new Date(),
      });
    } else {
      setValues({
        ...values,
        startTime: time,
      });
    }
  };

  const handleChangeDate = (date) => {
    if (date === null) {
      setValues({
        ...values,
        startDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startDate: date,
      });
    }
  };

  const callBackAddFollowup = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        addFollowUpModel: false,
      });
    }
  };

  const handleSaveFollowUp = (e) => {
    e.preventDefault();
    // console.log(this.state);
    const { errors, isValid } = validateEditMeetingFollowup(values);
    if (!isValid && values.selectedOption === "Meeting") {
      setValues({ ...values, errors });
    } else {
      // const { leadActivityData } = this.props;
      if (values.selectedOption === "Meeting") {
        // const newMeeting = {
        //   subject: this.state.selectedOption,
        //   meetingDate: this.state.startDate,
        //   meetingTime: this.state.startTime,
        //   location: this.state.followUpLocation,
        //   assigned: leadActivityData._id,
        // };
        // console.log(newMeeting);
        // this.props.addLeadMeetingsAction(newMeeting);
      } else {
        const newFollowUp = {
          name: values.accountLeadsFollowUp,
          type:
            values.accountLeadsFollowUp === "SMS"
              ? "SMS"
              : values.accountLeadsFollowUp === "Email"
              ? "EMAIL"
              : values.accountLeadsFollowUp === "Whatsapp"
              ? "WHATSAPP"
              : "CALL",
          entityType: "LEAD",
          entityId: leadActivityData._id,
          followupAtDate: values.startDate,
          followupAtTime: values.startTime,
          assigned: leadActivityData._id,
          assignedPipelead: leadActivityData._id,
          notification: true,
          status: "NEW",
        };

        dispatch(
          addFollowUpInAccountDetails(
            newFollowUp,
            leadActivityData.account_id,
            callBackAddFollowup
          )
        );
      }
    }
  };

  const onOpenModal = () => {
    setValues({
      ...values,
      addFollowUpModel: true,
      followUpSucess: false,
      hasModelCLose: false,
    });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
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
  const onClickFllowUpButton = (followup) => (e) => {
    e.preventDefault();
    console.log(followup);
    setValues({
      ...values,
      accountLeadsFollowUp: followup,
    });
  };

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*===============================
     Render Follow up form 
  ================================*/

  const renderFolloupFields = () => {
    const { selectedOption, currentFollowUp, errors } = values;
    // const { leadActivityData } = this.props;
    // console.log(this.state.selectedOption);
    return (
      <Fragment>
        <div className="add-lead-modal-container add-lead-modal-container--followUp">
          <h1 className="font-21-bold mb-30">
            Add Follow up for {leadActivityData && leadActivityData.name}
          </h1>
          <form noValidate onSubmit={handleSaveFollowUp}>
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
                    onClick={onClickFllowUpButton("Make a Call")}
                    className={
                      values.accountLeadsFollowUp === "Make a Call"
                        ? "select-lead-followup-by-btn select-lead-followup-by-btn--active"
                        : "select-lead-followup-by-btn"
                    }
                  >
                    {/* <span>📞</span> */}
                    Make a Call
                  </button>
                  <button
                    onClick={onClickFllowUpButton("Email")}
                    className={
                      values.accountLeadsFollowUp === "Email"
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
                    onClick={onClickFllowUpButton("Whatsapp")}
                    className={
                      values.accountLeadsFollowUp === "Whatsapp"
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
                    onClick={onClickFllowUpButton("SMS")}
                    className={
                      values.accountLeadsFollowUp === "SMS"
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
                      selected={values.startDate}
                      onChange={handleChangeDate}
                      onChangeRaw={handleDateChangeRaw}
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
                      selected={values.startTime}
                      onChange={handleChangeTime}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      dateFormat="h:mm aa"
                      timeCaption="Time"
                      onChangeRaw={handleDateChangeRaw}
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
                    onChange={handleChange}
                    value={values.followUpLocation}
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

  return (
    <>
      {/* modal link */}
      <button className={buttonClassName} onClick={onOpenModal}>
        {buttonText}
      </button>

      {/* modal content */}
      <Modal
        open={values.addFollowUpModel}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        {renderFolloupFields()}
      </Modal>
    </>
  );
}

const buttonTextDefault = (
  <>
    <img
      // src={require("../../../../src/assets/img/leads-new/calendar.svg")}
      src="/img/desktop-dark-ui/icons/lead-add-followup.svg"
      alt=""
    />
    <span className="font-15-bold">Add Followup</span>
  </>
);

ActivitySummaryFollowUpModal.defaultProps = {
  buttonClassName: "leads-new-inner-page-profile-row__colm2-btn",
  buttonText: buttonTextDefault,
};

export default ActivitySummaryFollowUpModal;
