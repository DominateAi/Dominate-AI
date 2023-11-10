import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import PopupInputFields from "./../common/PopupInputFields";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import {
  addTaskAction,
  getAllTasks,
  checkTaskExist,
} from "./../../../store/actions/taskAction";
import { statusEmpty } from "./../../../store/actions/authAction";

import dateFns from "date-fns";
import isEmpty from "./../../../store/validations/is-empty";
import { validateAddTask } from "../../../store/validations/taskValidation/taskValidation";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";

import { SET_PAGETITLE } from "./../../../store/types";
import store from "./../../../store/store";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

// started from 0
const totalFormSlides = 2;

const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export class AddTaskOld extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      prevNextIndex: 0,
      errors: {},
      taskName: "",
      taskDesc: "",
      // task duration form Fields
      fromDate: new Date(),
      toDate: new Date(),
      allTasks: [],
      userId: [],
      // pagination
      currentPagination: 1,
      // api
      getItemsList: {},
    };
  }

  /*================================
          Comppnent Lifecycle Method
      ==================================*/
  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("Data"));
    store.dispatch({
      type: SET_PAGETITLE,
      payload: "Tasks",
    });

    // const allTask = {
    //   query: {
    //     assignee: userData.id,
    //   },
    // };
    // this.props.getAllTasks(allTask);

    // handle prev and next screen by keyboard
    document.addEventListener("keydown", this.handleMainDivKeyDown);
  }

  componentWillUnmount() {
    // handle prev and next screen by keyboard
    document.removeEventListener("keydown", this.handleMainDivKeyDown);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    // if (
    //   !isEmpty(nextProps.allTask) &&
    //   nextProps.allTask !== nextState.allTasks
    // ) {
    //   return {
    //     allTasks: nextProps.allTask,
    //     getItemsList: nextProps.allTask,
    //   };
    // }

    if (nextProps.userId && nextProps.userId !== nextState.userId) {
      return {
        userId: nextProps.userId,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.apiStatus !== this.props.apiStatus &&
      this.props.apiStatus === true
    ) {
      this.onCloseModal();
    }
    // else if (
    //   prevProps.apiStatus !== this.props.apiStatus &&
    //   this.props.apiStatus !== true
    // ) {
    //   this.setState({
    //     prevNextIndex: 0,
    //   });
    // }
  }
  /*===============================
      Tasklist duration events
  ================================*/
  handleChangeFromDate = (date) => {
    if (date === null) {
      this.setState({
        fromDate: new Date(),
      });
    } else {
      this.setState({
        fromDate: date,
      });
    }
  };

  handleChangeToDate = (date) => {
    if (date === null) {
      this.setState({
        toDate: new Date(),
      });
    } else {
      this.setState({
        toDate: date,
      });
    }
  };

  /*==============================
          Model Events
  ===============================*/

  onOpenModal = () => {
    this.props.statusEmpty();
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      prevNextIndex: 0,
      taskName: "",
      taskDesc: "",
      // task duration form Fields
      fromDate: new Date(),
      toDate: new Date(),
      errors: {},
    });
  };

  /*===============================
       Prev And Next Events
  ================================*/

  handleMainDivKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    // Shift + ArrowLeft
    if (e.ctrlKey && keyCode === 37) {
      this.handlePrev();
    }
    // Shift + ArrowRight
    if (e.ctrlKey && keyCode === 39) {
      this.handleNext();
    }
  };

  handlePrev = () => {
    this.setState({
      prevNextIndex:
        this.state.prevNextIndex > 0
          ? this.state.prevNextIndex - 1
          : this.state.prevNextIndex,
    });
  };

  // handle next on key enter
  onFormKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      this.handleNext();
    }
  };

  handleNext = () => {
    const { errors } = validateAddTask(this.state);
    const { taskExist } = this.state;
    console.log(errors);
    if (taskExist === true) {
      errors.taskName = "Task alredy exist";
    }
    if (this.state.prevNextIndex === 0) {
      if (errors.taskName) {
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
      if (errors.taskDesc) {
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
      if (errors.fromDate || errors.toDate) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex,
          errors: {},
        });
      }
    }
  };

  /*===============================
            Form Events
  ================================*/

  handleSubmitOnKeyDown = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      this.handleSubmitFunctionMain();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.handleSubmitFunctionMain();
  };

  handleSubmitFunctionMain = (e) => {
    let userData = JSON.parse(localStorage.getItem("Data"));
    let fromDate = dateFns.format(this.state.fromDate, "YYYY-MM-DD");
    let startDate = dateFns.format(this.state.toDate, "YYYY-MM-DD");

    const newTask = {
      name: this.state.taskName,
      description: this.state.taskDesc,
      fromDate: fromDate,
      toDate: startDate,
      status: "NOT_STARTED",
      assignee: userData.id,
    };
    this.props.addTaskAction(newTask);
  };

  callBackTaskExist = (data) => {
    const { errors } = this.state;
    if (data.isExist === true) {
      errors.taskName = "Task alredy exist";
      this.setState({
        errors: errors,
        taskExist: data.isExist,
      });
    } else {
      errors.taskName = "";
      this.setState({
        errors: errors,
        taskExist: data.isExist,
      });
    }
  };

  handleChange = (e) => {
    if (e.target.name === "taskName") {
      if (!isEmpty(e.target.value)) {
        this.debounceLog(e.target.value);
      }
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  debounceLog = debounce(
    (text) => this.props.checkTaskExist(text, this.callBackTaskExist),
    1000
  );

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*===========================
      Render add task form
  ============================*/

  renderAddTaskForm = () => {
    const { prevNextIndex, errors } = this.state;

    // Task Description field
    const taskDescriptionField = (
      <div className="mb-30">
        <label htmlFor="taskDesc" className="add-lead-label font-24-semibold">
          Description for this task
        </label>
        <br />
        <textarea
          rows="5"
          id="taskDesc"
          name="taskDesc"
          className="add-lead-input-field font-18-regular"
          placeholder="Eg. Phase Alpha"
          value={this.state.taskDesc}
          onChange={this.handleChange}
          maxLength={maxLengths.char500}
          autoFocus={true}
        />
        {errors.taskDesc && (
          <div className="is-invalid add-lead-form-field-errors ml-30">
            {errors.taskDesc}
          </div>
        )}
      </div>
    );

    return (
      <div className="add-lead-modal-container lead_page_component container-fluid pr-0">
        <h1 className="font-30-bold mb-61">New Task</h1>
        <AddLeadBlueProgressbar
          percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
          skipButtonFrom={3}
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

            {/* form */}
            <form
              className="add-tasklist-form"
              // onSubmit={this.handleSubmit}
              onKeyDown={this.onFormKeyDown}
            >
              {/* name */}
              {prevNextIndex === 0 ? (
                <PopupInputFields
                  htmlFor={"taskName"}
                  type={"text"}
                  labelName={"Name of task?"}
                  id={"taskName"}
                  name={"taskName"}
                  placeholder={"Eg. Make UI changes"}
                  onChange={this.handleChange}
                  value={this.state.taskName}
                  maxLength={maxLengths.char30}
                  error={errors.taskName}
                />
              ) : (
                ""
              )}
              {/* Description of task */}
              {prevNextIndex === 1 ? taskDescriptionField : ""}
              {/* Duration of task */}
              {prevNextIndex === 2 ? (
                <Fragment>
                  <label
                    htmlFor="date"
                    className="add-lead-label font-24-semibold"
                  >
                    Duration of your task?
                  </label>
                  <br />

                  {/* datepicker */}
                  <div className="tasklist-duration-fields leads-title-block-container__date-picker">
                    <span
                      className="font-24-semibold mr-30"
                      role="img"
                      aria-labelledby="Tear-Off Calendar"
                    >
                      {/* calendar */}
                      {/* &#x1F4C6; */}
                    </span>

                    {/* datepicker */}
                    <DatePicker
                      selected={this.state.fromDate}
                      selectsStart
                      startDate={this.state.fromDate}
                      endDate={this.state.toDate}
                      onChange={this.handleChangeFromDate}
                      onChangeRaw={this.handleDateChangeRaw}
                      minDate={new Date()}
                    />
                    <span className="font-18-medium">to</span>
                    <DatePicker
                      selected={this.state.toDate}
                      selectsEnd
                      startDate={this.state.fromDate}
                      endDate={this.state.toDate}
                      onChange={this.handleChangeToDate}
                      minDate={this.state.fromDate}
                      onChangeRaw={this.handleDateChangeRaw}
                    />
                  </div>
                  {(errors.fromDate || errors.toDate) && (
                    <div className="is-invalid tasklist-duration-fields leads-title-block-container__date-picker mt-3 mb-0">
                      {errors.fromDate ? errors.fromDate : errors.toDate}
                    </div>
                  )}

                  {/* buttons */}
                  <div className="pt-25 text-right">
                    <button
                      // type="submit"
                      onClick={this.handleSubmit}
                      onKeyDown={this.handleSubmitOnKeyDown}
                      className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                    >
                      Save
                    </button>
                  </div>
                </Fragment>
              ) : (
                ""
              )}
            </form>

            {/*<AddLeadBlueProgressbar
              percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
              skipButtonFrom={2}
              prevNextIndex={prevNextIndex}
            />*/}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { open } = this.state;
    return (
      <>
        <button
          className={this.props.addTaskButtonClassName}
          onClick={this.onOpenModal}
        >
          {this.props.addTaskButtonText}
        </button>

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
          {this.renderAddTaskForm()}
        </Modal>
      </>
    );
  }
}

AddTaskOld.defaultProps = {
  addTaskButtonClassName: "",
};

const mapStateToProps = (state) => ({
  apiStatus: state.auth.status,
  allTask: state.tasks.tasks,
  userId: state.auth.user.id,
});

export default connect(mapStateToProps, {
  addTaskAction,
  statusEmpty,
  getAllTasks,
  checkTaskExist,
})(AddTaskOld);
