import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";
import dateFns from "date-fns";
import Dropdown from "react-dropdown";
import Select from "react-select";
import "react-dropdown/style.css";
import { updateTaskAction } from "../../../../store/actions/taskAction";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import { maxLengths } from "../../../../store/validations/maxLengths/MaxLengths";
import { validateEditMeetingFollowup } from "../../../../store/validations/followUpValidations/editFollowupMeeting";
import {
  updateMeetingAction,
  updateFollowUpAction,
} from "../../../../store/actions/calenderAction";
import { statusEmpty } from "../../../../store/actions/authAction";
import displaySmallText from "./../../../../store/utils/sliceString";

const statusOptionsRow = ["Not Started", "In Progress", "Completed"];

// reshedule
const selectDropdownOptions = [
  { value: "Make a Call", label: "Make a Call" },
  { value: "Email", label: "Email" },
];

export class TodaysMeetingsAndFollowUps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todaysFollowUp: [],
      todaysMeetings: [],
      todaysTaks: [],
      cardTitle: this.props.cardTitle,
      cardTitleTwo: this.props.cardTitleTwo,
      task: this.props.task,
      meet: this.props.meet,
      followup: this.props.followup,
      // reschedule followup
      resheduleFollowUpPopup: false,
      followUpData: {},
      selectedOptionDropdown: selectDropdownOptions[0],
      selectedOption: selectDropdownOptions[0].value,
      startDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      followUpLocation: "",
      modalForFollowUp: false,
      errors: {},
    };
  }

  /*=======================================
              Lifecycle Methods
  ========================================*/
  static getDerivedStateFromProps(nextProps) {
    return {
      todaysMeetings: nextProps.todaysMeetings,
      todaysTaks: nextProps.todaysTaks,
      todaysFollowUp: nextProps.todaysFollowUp,
    };
  }

  renderFollowupList = () => {
    const { todaysFollowUp } = this.state;

    if (!isEmpty(todaysFollowUp)) {
      return todaysFollowUp.map((followup, index) => {
        return (
          <Fragment key={index}>
            <li>
              <img
                src={require("./../../../../assets/img/employees/emp-default-img.jpg")}
                alt=""
              />
              <div className="new-dash-row-one-desc-block">
                <p>
                  {displaySmallText(
                    !isEmpty(followup.assigned)
                      ? followup.assigned.name
                      : followup.assignedPipelead.name,
                    8,
                    true
                  )}
                </p>
                <span>{dateFns.format(followup.followupAtTime, "h:mm a")}</span>
              </div>
              <button onClick={this.handleResheduleClickFollowUp(followup)}>
                Reschedule
              </button>
            </li>
          </Fragment>
        );
      });
    } else {
      return (
        <div className="no_data_today">
          <img
            // src={require("../../../../assets/img/illustrations/dashboard-todays-followup.svg")}
            src="/img/desktop-dark-ui/illustrations/dashboard-todays-followup.svg"
            alt="no meetings"
            className="dashboard-todays-followup-empty-img"
          />
          <p>No Follow ups Today</p>
        </div>
      );
    }
  };

  renderMeetList = () => {
    const { todaysMeetings } = this.state;
    if (!isEmpty(todaysMeetings)) {
      return todaysMeetings.map((meet, index) => {
        return (
          <Fragment key={index}>
            <li>
              <img
                src={require("./../../../../assets/img/employees/emp-default-img.jpg")}
                alt=""
              />
              <div className="new-dash-row-one-desc-block">
                <p>
                  {displaySmallText(
                    !isEmpty(meet.assigned)
                      ? meet.assigned.name
                      : meet.assignedPipelead.name,
                    8,
                    true
                  )}
                </p>
                <span>{dateFns.format(meet.meetingTime, "h:mm a")}</span>
              </div>
              <button onClick={this.handleResheduleClickMeeting(meet)}>
                Reschedule
              </button>
            </li>
          </Fragment>
        );
      });
    } else {
      return (
        <div className="no_data_today">
          <img
            // src={require("../../../../assets/img/illustrations/dashboard-todays-meeting.svg")}
            src="/img/desktop-dark-ui/illustrations/dashboard-todays-meeting.svg"
            alt="no meetings"
            className="dashboard-todays-meeting-empty-img"
          />
          <p>No Meetings Today</p>
        </div>
      );
    }
  };

  /*==========================================
              onStatusOptionsRowClick
  ============================================*/

  onStatusOptionsRowClick = (taskData) => (e) => {
    // console.log(e.value);
    // console.log(taskData);
    if (e.value === "In Progress") {
      // let fromDate = dateFns.format(this.state.fromDate, "YYYY-MM-DD");
      // let startDate = dateFns.format(this.state.toDate, "YYYY-MM-DD");
      const updateTask = {
        name: taskData.name,
        description: taskData.description,
        fromDate: taskData.fromDate,
        toDate: taskData.toDate,
        status: "ONGOING",
        assignee: taskData.assignee,
      };
      this.props.updateTaskAction(taskData._id, updateTask);
    } else if (e.value === "Completed") {
      // let fromDate = dateFns.format(this.state.fromDate, "YYYY-MM-DD");
      // let startDate = dateFns.format(this.state.toDate, "YYYY-MM-DD");
      const updateTask = {
        name: taskData.name,
        description: taskData.description,
        fromDate: taskData.fromDate,
        toDate: taskData.toDate,
        status: "COMPLETED",
        assignee: taskData.assignee,
        completedDate: new Date().toISOString(),
      };
      this.props.updateTaskAction(taskData._id, updateTask);
    } else if (e.value === "Not Started") {
      // let fromDate = dateFns.format(this.state.fromDate, "YYYY-MM-DD");
      // let startDate = dateFns.format(this.state.toDate, "YYYY-MM-DD");
      const updateTask = {
        name: taskData.name,
        description: taskData.description,
        fromDate: taskData.fromDate,
        toDate: taskData.toDate,
        status: "NOT_STARTED",
        assignee: taskData.assignee,
      };
      this.props.updateTaskAction(taskData._id, updateTask);
    }
  };

  renderTaskList = () => {
    const { todaysTaks } = this.state;
    if (!isEmpty(todaysTaks)) {
      return todaysTaks.map((task, index) => (
        <Fragment key={index}>
          <li>
            {console.log(task.status)}
            <i
              className={
                task.status === "NOT_STARTED"
                  ? "progress-dots-red"
                  : task.status === "ONGOING"
                  ? "progress-dots-yellow"
                  : "progress-dots-green"
              }
            >
              <i className="fa fa-circle" />
            </i>
            <div className="new-dash-row-one-desc-block">
              <p className="new-dashboard-row-one-task-title">
                {displaySmallText(task.name, 8, true)}
                {/* {task.name} */}
              </p>
            </div>
            <Dropdown
              className="lead-status-dropDown lead-status-dropDown--newDashboard"
              options={statusOptionsRow}
              onChange={this.onStatusOptionsRowClick(task)}
              value={
                task.status === "NOT_STARTED"
                  ? "Not Started"
                  : task.status === "ONGOING"
                  ? "In Progress"
                  : "Completed"
              }
            />
          </li>
        </Fragment>
      ));
    } else {
      return (
        <div className="no_data_today">
          <img
            // src={require("../../../../assets/img/illustrations/dashboard-todays-task.svg")}
            src="/img/desktop-dark-ui/illustrations/dashboard-todays-task.svg"
            alt="no meetings"
            className="dashboard-todays-tasks-empty-img"
          />
          <p>No Tasks Today</p>
        </div>
      );
    }
  };

  /*==========================================
          Reschedule Follow up model
  ============================================*/

  handleResheduleClickFollowUp = (data) => (e) => {
    console.log(data);
    this.props.statusEmpty();
    let option = 0;
    if (data.name === "Email") {
      option = 1;
    }
    this.setState({
      resheduleFollowUpPopup: true,
      followUpData: data,
      startDate: new Date(data.followupAtDate),
      startTime: new Date(data.followupAtTime),
      selectedOptionDropdown: selectDropdownOptions[option],
      selectedOption: selectDropdownOptions[option].value,
      modalForFollowUp: true,
    });
  };

  handleResheduleClickMeeting = (data) => (e) => {
    // console.log(data);
    this.props.statusEmpty();
    this.setState({
      resheduleFollowUpPopup: true,
      followUpData: data,
      startDate: new Date(data.meetingDate),
      startTime: new Date(data.meetingTime),
      followUpLocation: data.location,
      modalForFollowUp: false,
    });
  };

  handleChange = (e) => {
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

  handleChangeEndTime = (time) => {
    if (time === null) {
      this.setState({
        endTime: new Date(),
      });
    } else {
      this.setState({
        endTime: time,
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

  onCloseModal = () => {
    this.setState({
      resheduleFollowUpPopup: false,
      errors: {},
      selectedOptionDropdown: selectDropdownOptions[0],
      selectedOption: selectDropdownOptions[0].value,
      // suggestionList: list,
      startDate: new Date(),
      startTime: new Date(),
      followUpLocation: "",
      modalForFollowUp: false,
    });
  };

  handleSaveFollowUp = (e) => {
    e.preventDefault();
    const { followUpMettingLead } = this.state;
    const { errors, isValid } = validateEditMeetingFollowup(this.state);
    // console.log(this.state);
    // console.log(isValid);
    if (!isValid && !this.state.modalForFollowUp) {
      this.setState({ errors });
    } else {
      if (!this.state.modalForFollowUp) {
        const newMeeting = {
          subject: "Meeting",
          meetingDate: this.state.startDate,
          meetingTime: this.state.startTime,
          location: this.state.followUpLocation,
          assigned: this.state.followUpData.assigned._id,
        };
        this.props.updateMeetingAction(
          this.state.followUpData._id,
          newMeeting,
          dateFns.format(new Date(), "M"),
          dateFns.format(new Date(), "YYYY")
        );
      } else {
        const newFollowUp = {
          name: this.state.selectedOption,
          entityType: "LEAD",
          entityId: this.state.followUpData.assigned._id,
          followupAtDate: this.state.startDate,
          followupAtTime: this.state.startTime,
          assigned: this.state.followUpData.assigned._id,
          notification: true,
        };
        this.props.updateFollowUpAction(
          this.state.followUpData._id,
          newFollowUp,
          dateFns.format(new Date(), "M"),
          dateFns.format(new Date(), "YYYY")
        );
      }
      this.onCloseModal();
    }
  };

  onSelectDropdownSelect = (e) => {
    this.setState({
      selectedOption: e.value,
      selectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  renderResheduleFollowUpModel = () => {
    const { resheduleFollowUpPopup, modalForFollowUp, errors } = this.state;
    return (
      <Modal
        open={resheduleFollowUpPopup}
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
        <Fragment>
          <div className="add-lead-modal-container add-lead-modal-container--followUp">
            <h1 className="font-21-bold mb-30">
              Reschdule for{" "}
              {!isEmpty(this.state.followUpData) &&
                this.state.followUpData.assigned.name}
            </h1>
            <form noValidate onSubmit={this.handleSaveFollowUp}>
              <div className="add-lead-form-field-block add-follow-up-main-container">
                <input readOnly className="invisible d-none" autoFocus />
                {modalForFollowUp ? (
                  <div className="follow-up-select mb-30">
                    <Select
                      className="react-select-follow-up-form-container"
                      classNamePrefix="react-select-follow-up-form"
                      isSearchable={false}
                      options={selectDropdownOptions}
                      value={this.state.selectedOptionDropdown}
                      onChange={(e) => this.onSelectDropdownSelect(e)}
                      placeholder="Select"
                    />
                  </div>
                ) : (
                  <div className="follow-up-select mb-30">
                    <div className="row align-items-start justify-content-center main-dropdown-class dropdown-input-class">
                      Meeting
                    </div>
                  </div>
                )}

                <div className="follow-up-date-time-section follow-up-date-time-section--dashboard-followup-reshedule mb-30">
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
                  <div className="follow-up-time leads-title-block-container__date-picker align-items-start">
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
                      <span className="font-20-semibold mr-30">To</span>
                      <DatePicker
                        selected={this.state.endTime}
                        onChange={this.handleChangeEndTime}
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
                {!modalForFollowUp && (
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
                  className="btn-funnel-view btn-funnel-view--files m-0"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </Fragment>
      </Modal>
    );
  };

  render() {
    // console.log(this.state.todaysTaks);
    const { todaysMeetings, todaysFollowUp, todaysTaks } = this.state;
    return (
      <>
        {this.renderResheduleFollowUpModel()}
        <div className="todays_followup_meet_card">
          <div className="text-center card_header">
            <span>
              {this.state.meet &&
                (isEmpty(todaysMeetings) ? "0" : todaysMeetings.length)}
              {this.state.followup &&
                (isEmpty(todaysFollowUp) ? "0" : todaysFollowUp.length)}
              {this.state.task &&
                (isEmpty(todaysTaks) ? "0" : todaysTaks.length)}
            </span>
            <p>{this.state.cardTitleTwo} today</p>
            <div></div>
            <hr></hr>
            <h3>Today's {this.state.cardTitle}</h3>
          </div>
          <ul className="list_of_followups">
            {/* follow up and meet list  */}

            {this.state.meet && this.renderMeetList()}
            {this.state.followup && this.renderFollowupList()}
            {this.state.task && this.renderTaskList()}
          </ul>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  todaysFollowUp: state.dashboard.todaysFollowUp.followup,
  todaysMeetings: state.dashboard.todaysMeetings.meeting,
  todaysTaks: state.dashboard.todaysTaks,
});

export default connect(mapStateToProps, {
  updateTaskAction,
  updateMeetingAction,
  updateFollowUpAction,
  statusEmpty,
})(TodaysMeetingsAndFollowUps);
