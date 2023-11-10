import React, { Component, Fragment } from "react";
import Dropdown from "react-dropdown";
import Select from "react-select";
import "react-dropdown/style.css";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import Modal from "react-responsive-modal";
import PopupInputFields from "./../common/PopupInputFields";
import DatePicker from "react-datepicker";
// import CustomEditDropdown from "../common/CustomEditDropdown";
import isEmpty from "./../../../store/validations/is-empty";
import { validateEditTask } from "../../../store/validations/taskValidation/editTaskValidation";
import dateFns from "date-fns";
import {
  deleteTask,
  updateTaskAction,
  checkTaskExist,
} from "./../../../store/actions/taskAction";
import { statusEmpty } from "./../../../store/actions/authAction";
import { connect } from "react-redux";
// import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
// import Alert from "react-s-alert";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import ShowMoreText from "react-show-more-text";

// FETCH THE LIST FROM THE BACKEND
// const list = ["Not Started", "In Progress", "Completed"];
const selectDropdownOptions = [
  { value: "Not Started", label: "Not Started" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const statusOptionsRow = ["Not Started", "In Progress", "Completed"];

// started from 0
// const totalFormSlides = 2;

export class TaskTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevNextIndex: 0,
      errors: {},
      open: false,
      taskName: "",
      taskDesc: "",
      // task duration form Fields
      selectedOptionDropdown: selectDropdownOptions[0],
      selectedOption: selectDropdownOptions[0].value,
      // dropdown: false,
      // suggestionList: list,
      fromDate: new Date(),
      toDate: new Date(),
      followUpLocation: "",
      selectedTaskId: "",
      userId: [],
      success: false,
    };
  }

  /*=================================
          Lifecycle Methods
  ===================================*/

  // componentDidMount() {
  //   window.addEventListener("offline", function(e) {
  //     console.log("offline");
  //     Alert.success(`<h4>Offline</h4>`, {
  //       position: "top-right",
  //       effect: "slide",
  //       beep: false,
  //       html: true,
  //       timeout: 5000
  //       // offset: 100
  //     });
  //   });

  //   window.addEventListener("online", function(e) {
  //     console.log("online");
  //     Alert.success(`<h4>online</h4>`, {
  //       position: "top-right",
  //       effect: "slide",
  //       beep: false,
  //       html: true,
  //       timeout: 5000
  //       // offset: 100
  //     });
  //   });
  // }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (!isEmpty(nextProps.userId) && nextProps.userId !== nextState.userId) {
      return {
        userId: nextProps.userId,
      };
    }
    return null;
  }

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

  /*===============================
    custom edit dropdown
  ================================*/
  // componentDidMount() {
  // console.log(new Date().toISOString());
  // document.addEventListener("click", this.onDropdownClick);
  // document.addEventListener("keypress", this.onDropdownKeyPress);
  // }

  // componentWillUnmount() {
  // document.removeEventListener("click", this.onDropdownClick);
  // document.removeEventListener("keypress", this.onDropdownKeyPress);
  // }

  componentDidUpdate() {
    if (
      this.props.apiStatus &&
      this.state.success &&
      !this.state.hasSubmitted
    ) {
      this.onCloseModal();
      this.setState({
        hasSubmitted: true,
        errors: {},
      });
    }
  }

  onSelectDropdownSelect = (e) => {
    this.setState({
      selectedOption: e.value,
      selectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  // onDropdownKeyPress = e => {
  //   if (this.state.dropdown) {
  //     if (e.keyCode === 13) {
  //       this.dropDownToggler();
  //     }
  //   }
  // };

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

  /*================================
    Tasklist Duration Event Handler
  ==================================*/

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
    this.setState({ open: true, success: false, hasSubmitted: false });
  };

  onCloseModal = () => {
    this.setState({
      prevNextIndex: 0,
      open: false,
      taskName: "",
      taskDesc: "",
      // task duration form Fields
      selectedOptionDropdown: selectDropdownOptions[0],
      selectedOption: selectDropdownOptions[0].value,
      // dropdown: false,
      // suggestionList: list,
      fromDate: new Date(),
      toDate: new Date(),
      followUpLocation: "",
    });
  };

  /*==============================
      Edit Dropdown Events
  ===============================*/

  onSelect = (action, task) => {
    if (action === "deleteTask") {
      this.props.deleteTask(task._id);
    } else if (action === "editTask") {
      let fromDate = new Date(task.fromDate);
      let toDate = new Date(task.toDate);
      this.onOpenModal();
      this.setState({
        selectedTaskId: task._id,
        taskName: task.name,
        taskDesc: task.description,
        fromDate: fromDate,
        toDate: toDate,
        selectedOption:
          task.status === "NOT_STARTED"
            ? "Not Started"
            : task.status === "ONGOING"
            ? "In Progress"
            : task.status === "COMPLETED"
            ? "Completed"
            : "",
      });
      // console.log(this.state.toDate);
    }
  };

  onVisibleChange = (visible) => {
    console.log(visible);
  };

  /*===============================
        Edit Task Form Events
  ================================*/

  handleSubmit = (e) => {
    e.preventDefault();
    // this.onCloseModal();
    const { errors } = validateEditTask(this.state);
    const { taskExist } = this.state;
    if (taskExist === true) {
      errors.taskName = "Task alredy exist";
    }
    // console.log(errors);
    if (isEmpty(errors)) {
      if (this.state.selectedOption === "Not Started") {
        let newStatus = "NOT_STARTED";
        let fromDate = dateFns.format(this.state.fromDate, "YYYY-MM-DD");
        let startDate = dateFns.format(this.state.toDate, "YYYY-MM-DD");
        const updateTask = {
          name: this.state.taskName,
          description: this.state.taskDesc,
          fromDate: fromDate,
          toDate: startDate,
          status: newStatus,
          assignee: this.state.userId,
        };
        this.props.updateTaskAction(this.state.selectedTaskId, updateTask);
      } else if (this.state.selectedOption === "In Progress") {
        let newStatus = "ONGOING";
        let fromDate = dateFns.format(this.state.fromDate, "YYYY-MM-DD");
        let startDate = dateFns.format(this.state.toDate, "YYYY-MM-DD");
        const updateTask = {
          name: this.state.taskName,
          description: this.state.taskDesc,
          fromDate: fromDate,
          toDate: startDate,
          status: newStatus,
          assignee: this.state.userId,
        };
        this.props.updateTaskAction(this.state.selectedTaskId, updateTask);
      } else {
        let newStatus = "COMPLETED";
        let fromDate = dateFns.format(this.state.fromDate, "YYYY-MM-DD");
        let startDate = dateFns.format(this.state.toDate, "YYYY-MM-DD");
        let completedDate = new Date().toISOString();
        const updateTask = {
          name: this.state.taskName,
          description: this.state.taskDesc,
          fromDate: fromDate,
          toDate: startDate,
          status: newStatus,
          assignee: this.state.userId,
          completedDate: completedDate,
        };
        this.props.updateTaskAction(this.state.selectedTaskId, updateTask);
      }

      this.setState({
        success: true,
      });
    }
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
      this.props.checkTaskExist(e.target.value, this.callBackTaskExist);
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*==============================
      Prev And Next Events
  ===============================*/

  handlePrev = () => {
    this.setState({
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
    const { errors } = validateEditTask(this.state);
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
      if (errors.fromDate || errors.toDate || errors.selectedOption) {
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

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*===============================
      Render Dropdown
  =================================*/

  renderDropdown = (task) => {
    const menu = (
      <Menu>
        <MenuItem onClick={() => this.onSelect("editTask", task)}>
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => this.onSelect("deleteTask", task)}>
          Delete
        </MenuItem>
        <Divider />
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={this.onVisibleChange}
      >
        <img
          className="edit-img"
          src="/img/desktop-dark-ui/icons/gray-three-dots-icon.svg"
          alt="edit"
        />
      </DropdownIcon>
    );
  };

  /***************************
   * @DESC - OVERDUE CALCULATOR
   ********************************/
  overDueCalculator = (toDate) => {
    var dateFirst = new Date(dateFns.format(new Date(), "MM/DD/YYYY"));
    var dateSecond = new Date(dateFns.format(toDate, "MM/DD/YYYY"));
    var timeDiff = dateSecond.getTime() - dateFirst.getTime();
    var diffDays = Math.ceil(Math.abs(timeDiff) / (1000 * 3600 * 24));
    let overdue = timeDiff < 0 ? -1 : 1;
    return {
      overdue,
      diffDays,
    };
  };
  /*=============================
        render Task Edit from
  ===============================*/

  // renderEditForm = () => {
  //   const { prevNextIndex, errors } = this.state;

  //   const { selectedOption } = this.state;

  //   // Task Description field
  //   const taskDescriptionField = (
  //     <div className="mb-30">
  //       <label htmlFor="taskDesc" className="add-lead-label font-24-semibold">
  //         Description for this task
  //       </label>
  //       <br />
  //       <textarea
  //         rows="5"
  //         id="taskDesc"
  //         name="taskDesc"
  //         className="add-lead-input-field font-18-regular"
  //         placeholder="Eg. Phase Alpha"
  //         value={this.state.taskDesc}
  //         onChange={this.handleChange}
  //         autoFocus={true}
  //       />
  //       {errors.taskDesc && (
  //         <div className="is-invalid add-lead-form-field-errors ml-30">
  //           {errors.taskDesc}
  //         </div>
  //       )}
  //     </div>
  //   );

  //   const editFormFields = (
  //     <Fragment>
  //       <div className="add-lead-modal-container container-fluid pr-0">
  //         <h1 className="font-30-bold mb-61">Edit Task</h1>

  //         <div className="add-lead-form-field-block">
  //           {/* prev next arrows */}
  //           <div className="add-lead-arrows">
  //             {prevNextIndex <= 0 ? (
  //               ""
  //             ) : (
  //               <img
  //                 src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
  //                 alt="previous"
  //                 className="add-lead-prev-icon"
  //                 onClick={this.handlePrev}
  //               />
  //             )}

  //             {prevNextIndex >= totalFormSlides ? (
  //               ""
  //             ) : (
  //               <img
  //                 src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
  //                 alt="previous"
  //                 className="add-lead-next-icon"
  //                 onClick={this.handleNext}
  //               />
  //             )}

  //             {/* form */}
  //             <form onSubmit={this.handleSubmit} onKeyDown={this.onFormKeyDown}>
  //               {/* name */}
  //               {prevNextIndex === 0 ? (
  //                 <PopupInputFields
  //                   htmlFor={"taskName"}
  //                   type={"text"}
  //                   labelName={"Name of task?"}
  //                   id={"taskName"}
  //                   name={"taskName"}
  //                   placeholder={"Eg. Make UI changes"}
  //                   onChange={this.handleChange}
  //                   value={this.state.taskName}
  //                   error={errors.taskName}
  //                 />
  //               ) : (
  //                 ""
  //               )}

  //               {/* Description of task */}
  //               {prevNextIndex === 1 ? taskDescriptionField : ""}

  //               {/* Duration of task */}
  //               {prevNextIndex === 2 ? (
  //                 <Fragment>
  //                   <label
  //                     htmlFor="date"
  //                     className="add-lead-label font-24-semibold"
  //                   >
  //                     Duration of your task?
  //                   </label>
  //                   <br />

  //                   {/* datepicker */}
  //                   <div className="tasklist-duration-fields leads-title-block-container__date-picker">
  //                     <span
  //                       className="font-24-semibold mr-30"
  //                       role="img"
  //                       aria-labelledby="Tear-Off Calendar"
  //                     >
  //                       {/* calendar */}
  //                       {/* &#x1F4C6; */}
  //                     </span>

  //                     {/* datepicker */}
  //                     <DatePicker
  //                       selected={this.state.fromDate}
  //                       selectsStart
  //                       startDate={this.state.fromDate}
  //                       endDate={this.state.toDate}
  //                       onChange={this.handleChangeFromDate}
  //                     />
  //                     <span className="font-18-medium">to</span>
  //                     <DatePicker
  //                       selected={this.state.toDate}
  //                       selectsEnd
  //                       startDate={this.state.fromDate}
  //                       endDate={this.state.toDate}
  //                       onChange={this.handleChangeToDate}
  //                       minDate={this.state.startDate}
  //                     />
  //                   </div>
  //                   {(errors.fromDate || errors.toDate) && (
  //                     <div className="is-invalid tasklist-duration-fields leads-title-block-container__date-picker mt-3 mb-0">
  //                       {errors.fromDate ? errors.fromDate : errors.toDate}
  //                     </div>
  //                   )}

  //                   {/* Status field */}
  //                   <div className="follow-up-select mb-30 task-edit-status">
  //                     <label
  //                       htmlFor="selectedOption"
  //                       className="font-24-semibold mb-30"
  //                     >
  //                       Task status
  //                     </label>

  //                     <CustomEditDropdown
  //                       id="selectedOption"
  //                       name="selectedOption"
  //                       value={this.state.selectedOption}
  //                       readOnly={true}
  //                       onInputChangeHandler={this.onDropdownChange}
  //                       dropDownToggler={this.dropDownToggler}
  //                       dropDown={this.state.dropdown}
  //                       suggestionList={this.state.suggestionList}
  //                       dropDownSelect={this.dropDownSelect}
  //                       placeholder={"Select"}
  //                       error={errors.selectedOption}
  //                     />
  //                   </div>

  //                   {/* buttons */}
  //                   <div className="pt-25 text-right">
  //                     <button
  //                       type="submit"
  //                       className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
  //                     >
  //                       Save
  //                     </button>
  //                   </div>
  //                 </Fragment>
  //               ) : (
  //                 ""
  //               )}
  //             </form>

  //             <AddLeadBlueProgressbar
  //               percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
  //               skipButtonFrom={2}
  //               prevNextIndex={prevNextIndex}
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     </Fragment>
  //   );

  //   const { open } = this.state;
  //   return (
  //     <Modal
  //       open={open}
  //       onClose={this.onCloseModal}
  //       closeOnEsc={true}
  //       closeOnOverlayClick={false}
  //       center
  //       classNames={{
  //         overlay: "customOverlay",
  //         modal: "customModal customModal--addLead",
  //         closeButton: "customCloseButton"
  //       }}
  //     >
  //       <span className="closeIconInModal" onClick={this.onCloseModal} />
  //       {editFormFields}
  //     </Modal>
  //   );
  // };

  /*=============================
        render Task Edit from
  ===============================*/

  renderEditFormNew = () => {
    const { errors } = this.state;

    // const { selectedOption } = this.state;

    // Task Description field
    const taskDescriptionField = (
      <div className="mb-30 new-edit-lead-form-row">
        <label htmlFor="taskDesc" className="add-lead-label font-24-semibold">
          Description
        </label>
        <br />
        <textarea
          rows="5"
          id="taskDesc"
          name="taskDesc"
          className="add-lead-input-field font-18-regular new-edit-lead-form-row__input"
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

    const editFormFields = (
      <Fragment>
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Edit Task</h1>

          <div className="add-lead-form-field-block new-edit-lead-form-row__task-block">
            {/* form */}
            <form
              noValidate
              onSubmit={this.handleSubmit}
              onKeyDown={this.onFormKeyDownNew}
            >
              {/* name */}
              <PopupInputFields
                checkboxClass="new-edit-lead-form-row"
                htmlFor={"taskName"}
                type={"text"}
                labelName={"Name"}
                id={"taskName"}
                name={"taskName"}
                placeholder={"Eg. Make UI changes"}
                onChange={this.handleChange}
                value={this.state.taskName}
                maxLength={maxLengths.char30}
                error={errors.taskName}
              />

              {/* Description of task */}
              {taskDescriptionField}

              {/* Duration of task */}
              <div className="new-edit-lead-form-row">
                <label
                  htmlFor="date"
                  className="add-lead-label font-24-semibold"
                >
                  Duration
                </label>
                <br />
                <div>
                  {/* datepicker */}
                  <div className="tasklist-duration-fields leads-title-block-container__date-picker">
                    <span
                      className="font-24-semibold mr-30 ml-0"
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
                      minDate={this.state.fromDate}
                      onChangeRaw={this.handleDateChangeRaw}
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
                </div>
              </div>
              {/* Status field */}
              <div className="follow-up-select mb-30 task-edit-status new-edit-lead-form-row">
                <label htmlFor="selectedOption" className="font-24-semibold">
                  Task Status
                </label>

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
                  error={errors.selectedOption}
                /> */}

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

              {/* buttons */}
              <div className="pt-25 pr-70 text-right">
                <button
                  name="SaveButtonNewEditForm"
                  type="submit"
                  className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Fragment>
    );

    const { open } = this.state;
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
        {editFormFields}
      </Modal>
    );
  };

  render() {
    // let array = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    const { allTask, currentPagination, totalRecordsInOnePage } = this.props;
    // console.log(this.state.userId)
    return (
      <Fragment>
        {!isEmpty(allTask) &&
          allTask.map((task, index) => {
            let text =
              this.overDueCalculator(task.toDate).diffDays === 1
                ? "Day Overdue"
                : "Days Overdue";
            return (
              index >= (currentPagination - 1) * totalRecordsInOnePage &&
              index < currentPagination * totalRecordsInOnePage && (
                <Fragment key={index}>
                  <tr className="table-with-border-row__content-row">
                    <td className="task-name-column">
                      <h3> {task.name} </h3>
                      <ShowMoreText
                        /* Default options */
                        lines={1}
                        more="Show more"
                        less="Show less"
                        className="content-css"
                        anchorClass="my-anchor-css-class"
                        onClick={this.executeOnClick}
                        expanded={false}
                        width={280}
                      >
                        <p>{task.description}</p>
                      </ShowMoreText>
                    </td>
                    <td className="duration-column">
                      <h5>
                        {dateFns.format(task.fromDate, "YYYY-MM-DD")}
                        {/* &nbsp;/&nbsp;
                        {dateFns.format(task.toDate, "YYYY-MM-DD")} */}
                      </h5>
                    </td>
                    <td className="time-left-column">
                      <h5>
                        {task.status === "COMPLETED" ? (
                          "Task Completed"
                        ) : this.overDueCalculator(task.toDate).overdue < 0 ? (
                          <div style={{ color: "#ff4848" }}>{`${
                            this.overDueCalculator(task.toDate).diffDays
                          } ${text}`}</div>
                        ) : this.overDueCalculator(task.toDate).diffDays ===
                          0 ? (
                          "Deadline Today"
                        ) : this.overDueCalculator(task.toDate).diffDays ===
                          1 ? (
                          `${
                            this.overDueCalculator(task.toDate).diffDays
                          } Day to Deadline`
                        ) : (
                          `${
                            this.overDueCalculator(task.toDate).diffDays
                          } Days to Deadline`
                        )}
                      </h5>
                    </td>

                    <td>
                      <div className="row mx-0 flex-nowrap align-items-center">
                        <div className="row mx-0 flex-nowrap align-items-baseline">
                          {/* Status */}
                          <span
                            className={
                              task.status === "NOT_STARTED"
                                ? "progress-dots-red"
                                : task.status === "ONGOING"
                                ? "progress-dots-yellow"
                                : task.status === "COMPLETED"
                                ? "progress-dots-green"
                                : ""
                            }
                          >
                            <i className="fa fa-circle mr-30" />
                          </span>{" "}
                          {/* <span className="task-status-text">
                      {task.status === "NOT_STARTED"
                        ? "Not Started"
                        : task.status === "ONGOING"
                        ? "In Progress"
                        : task.status === "COMPLETED"
                        ? "Completed"
                        : ""}
                    </span> */}
                          <Dropdown
                            className="lead-status-dropDown lead-status-dropDown--taskStatusRow"
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
                        </div>
                        {this.renderDropdown(task)}
                      </div>
                    </td>
                  </tr>
                  <tr className="table-with-border-row__space-row">
                    <td></td>
                  </tr>
                </Fragment>
              )
            );
          })}

        {/* Render task edit form */}
        {/* {this.renderEditForm()} */}
        {this.renderEditFormNew()}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  apiStatus: state.auth.status,
  userId: state.auth.user.id,
});

export default connect(mapStateToProps, {
  deleteTask,
  updateTaskAction,
  statusEmpty,
  checkTaskExist,
})(TaskTableRow);
