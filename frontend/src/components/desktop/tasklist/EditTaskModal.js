import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import PopupInputFields from "./../common/PopupInputFields";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import {
  addTaskAction,
  // getAllTasks,
  checkTaskExist,
  updateTaskAction,
} from "./../../../store/actions/taskAction";
import dateFns from "date-fns";
import isEmpty from "./../../../store/validations/is-empty";
import { validateAddTask } from "../../../store/validations/taskValidation/taskValidation";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";

import { SET_PAGETITLE } from "./../../../store/types";
import store from "./../../../store/store";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AddLeadFormAssignRepresentative from "../leads/AddLeadFormAssignRepresentative";
import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

const totalFormSlides = 3;
const taskAssignMentErrorText = "Task assignment is required";

// const debounce = (func, timeout = 300) => {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       func.apply(this, args);
//     }, timeout);
//   };
// };

export default function EditTaskModal({ ...props }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    prevNextIndex: 0,
    errors: {},
    taskName: "",
    selectOption: "",
    displayListSelected: [],
    displayListSelectedError: "",
    taskDesc: "",
    fromDate: new Date(),
    toDate: new Date(),
    allEmployees: [],
    optionsAssignTo: [],
  });

  useEffect(() => {
    if (!isEmpty(props.taskData)) {
      let fromDate = new Date(props.taskData.fromDate);
      let toDate = new Date(props.taskData.toDate);

      setValues({
        ...values,
        taskName: props.taskData.name,
        taskDesc: props.taskData.description,
        fromDate: fromDate,
        toDate: toDate,
      });
    }
  }, []);

  const allEmployees = useSelector((state) => state.employee.allEmployees);

  useEffect(() => {
    if (!isEmpty(props.taskData)) {
      let fromDate = new Date(props.taskData.fromDate);
      let toDate = new Date(props.taskData.toDate);

      let allEmployeeOption = [];
      let selectedEmployee = "";
      if (!isEmpty(allEmployees)) {
        allEmployees.map((data) => {
          allEmployeeOption.push({ value: data._id, label: data.name });
        });
        selectedEmployee = allEmployees.filter(
          (emp) => emp._id === props.taskData.assignee._id
        );
      }
      console.log(selectedEmployee);

      setValues({
        ...values,
        taskName: props.taskData.name,
        taskDesc: props.taskData.description,
        fromDate: fromDate,
        toDate: toDate,
        optionsAssignTo: allEmployeeOption,
        displayListSelected: !isEmpty(selectedEmployee)
          ? [
              {
                value: selectedEmployee[0]._id,
                label: selectedEmployee[0].name,
              },
            ]
          : [],
      });
    }
  }, [allEmployees, props.taskData]);

  //   /*================================
  //           Comppnent Lifecycle Method
  //       ==================================*/
  //   componentDidMount() {
  //     // let userData = JSON.parse(localStorage.getItem("Data"));
  //     store.dispatch({
  //       type: SET_PAGETITLE,
  //       payload: "Tasks",
  //     });
  //     const fomrData = {
  //       query: {},
  //     };
  //     this.props.getAllEmployeesWithAdmin(fomrData);

  //     // const allTask = {
  //     //   query: {
  //     //     assignee: userData.id,
  //     //   },
  //     // };
  //     // this.props.getAllTasks(allTask);

  //     // handle prev and next screen by keyboard
  //     document.addEventListener("keydown", this.handleMainDivKeyDown);
  //   }

  //   componentWillUnmount() {
  //     // handle prev and next screen by keyboard
  //     document.removeEventListener("keydown", this.handleMainDivKeyDown);
  //   }

  //   static getDerivedStateFromProps(nextProps, nextState) {
  //     if (
  //       !isEmpty(nextProps.allEmployees) &&
  //       nextProps.allEmployees !== nextState.allEmployees
  //     ) {
  //       let filterEmp = nextProps.allEmployees.filter(function (allEmployees) {
  //         return allEmployees.status === "ACTIVE";
  //       });

  //       let defaultAssign =
  //         !isEmpty(nextProps.allEmployees) &&
  //         nextProps.allEmployees.filter(function (allEmployees) {
  //           return allEmployees.role.name === "Administrator";
  //         });

  //       return {
  //         allEmployees: filterEmp,
  //         taskAssignTo:
  //           !isEmpty(defaultAssign[0]) && defaultAssign !== undefined
  //             ? defaultAssign[0].name
  //             : "",
  //         leadAssignRepresentativeId:
  //           !isEmpty(defaultAssign[0]) && defaultAssign !== undefined
  //             ? defaultAssign[0]._id
  //             : "",
  //       };
  //     }

  //     // if (nextProps.userId && nextProps.userId !== nextState.userId) {
  //     //   return {
  //     //     userId: nextProps.userId,
  //     //   };
  //     // }
  //     return null;
  //   }

  //   componentDidUpdate(prevProps) {
  //     if (
  //       prevProps.apiStatus !== this.props.apiStatus &&
  //       this.props.apiStatus === true
  //     ) {
  //       this.onCloseModal();
  //     }
  //     // else if (
  //     //   prevProps.apiStatus !== this.props.apiStatus &&
  //     //   this.props.apiStatus !== true
  //     // ) {
  //     //   this.setState({
  //     //     prevNextIndex: 0,
  //     //   });
  //     // }
  //   }
  //   /*===============================
  //       Tasklist duration events
  //   ================================*/
  //   handleChangeFromDate = (date) => {
  //     if (date === null) {
  //       this.setState({
  //         fromDate: new Date(),
  //       });
  //     } else {
  //       this.setState({
  //         fromDate: date,
  //       });
  //     }
  //   };

  //   handleChangeToDate = (date) => {
  //     if (date === null) {
  //       this.setState({
  //         toDate: new Date(),
  //       });
  //     } else {
  //       this.setState({
  //         toDate: date,
  //       });
  //     }
  //   };

  /*===============================
            Form Events
  ================================*/
  const handleChange = (e) => {
    // if (e.target.name === "taskName") {
    //   if (!isEmpty(e.target.value)) {
    //     this.debounceLog(e.target.value);
    //   }
    // }
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  //   debounceLog = debounce(
  //   (text) => this.props.checkTaskExist(text, this.callBackTaskExist),
  //   1000
  // );

  //   /*===============================
  //        Prev And Next Events
  //   ================================*/

  //   handleMainDivKeyDown = (e) => {
  //     e.stopPropagation();
  //     let keyCode = e.keyCode || e.which;
  //     // Shift + ArrowLeft
  //     if (e.ctrlKey && keyCode === 37) {
  //       this.handlePrev();
  //     }
  //     // Shift + ArrowRight
  //     if (e.ctrlKey && keyCode === 39) {
  //       this.handleNext();
  //     }
  //   };

  const handlePrev = () => {
    setValues({
      ...values,
      prevNextIndex:
        values.prevNextIndex > 0
          ? values.prevNextIndex - 1
          : values.prevNextIndex,
    });
  };

  // handle next on key enter
  const onFormKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleNext = () => {
    const { errors } = validateAddTask(values);
    const { taskExist } = values;
    console.log(errors);
    if (taskExist === true) {
      errors.taskName = "Task alredy exist";
    }
    if (values.prevNextIndex === 0) {
      if (errors.taskName) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 1) {
      // if (errors.taskAssignTo) {
      if (isEmpty(values.displayListSelected)) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
          displayListSelectedError: taskAssignMentErrorText,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 2) {
      if (errors.taskDesc) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 3) {
      if (errors.fromDate || errors.toDate) {
        setValues({
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex,
          errors: {},
        });
      }
    }
  };
  // memeber
  const handleChangeSelectClient = (selectedOption) => {
    // setErrors({ validationErrors: { displayListSelected: "" } });
    // setselectOption(selectedOption);
    // add option to list if it's not present in list
    // let newList = [];
    // if (newList.indexOf(selectedOption) === -1) {
    //   newList.push(selectedOption);
    //   setValues({
    //     ...values,
    //     displayListSelected: newList,
    //   });
    // }

    if (isEmpty(values.displayListSelected)) {
      let newObj = [...values.displayListSelected];
      newObj.push(selectedOption);
      setValues({
        ...values,
        displayListSelected: newObj,
        displayListSelectedError: "",
      });
    } else {
      let newObj = [...values.displayListSelected];
      newObj[0] = selectedOption;
      setValues({
        ...values,
        displayListSelected: newObj,
        displayListSelectedError: "",
      });
    }
  };

  const handleRemoveMember = (index) => (e) => {
    let newList = [...values.displayListSelected];
    newList.splice(index, 1);
    setValues({
      ...values,
      selectOption: "",
      displayListSelected: newList,
    });
  };

  /*===============================
      Tasklist duration events
  ================================*/
  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  const handleChangeFromDate = (date) => {
    if (date === null) {
      setValues({
        ...values,
        fromDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        fromDate: date,
      });
    }
  };

  const handleChangeToDate = (date) => {
    if (date === null) {
      setValues({
        ...values,
        toDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        toDate: date,
      });
    }
  };

  const handleSubmitOnKeyDown = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      // handleSubmitFunctionMain();
    }
  };

  const callBack = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        open: false,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handleSubmitFunctionMain();
    console.log(values);
    // setValues({
    //   ...values,
    //   open: false,
    // });

    let fromDate = dateFns.format(values.fromDate, "YYYY-MM-DD");
    let startDate = dateFns.format(values.toDate, "YYYY-MM-DD");
    const updateTask = {
      name: values.taskName,
      description: values.taskDesc,
      fromDate: fromDate,
      toDate: startDate,
      assignee: values.displayListSelected[0].value,
      // assignee: values.userId,
    };
    dispatch(
      updateTaskAction(
        props.taskData._id,
        updateTask,
        props.taskAssignedSelected,
        callBack
      )
    );
  };

  // const  handleSubmitFunctionMain = (e) => {
  //     let userData = JSON.parse(localStorage.getItem("Data"));
  //     let fromDate = dateFns.format(this.state.fromDate, "YYYY-MM-DD");
  //     let startDate = dateFns.format(this.state.toDate, "YYYY-MM-DD");

  //     const newTask = {
  //       name: this.state.taskName,
  //       description: this.state.taskDesc,
  //       fromDate: fromDate,
  //       toDate: startDate,
  //       status: "NOT_STARTED",
  //       assignee: this.state.leadAssignRepresentativeId,
  //     };
  //     this.props.addTaskAction(newTask);
  //   };

  //   callBackTaskExist = (data) => {
  //     const { errors } = this.state;
  //     if (data.isExist === true) {
  //       errors.taskName = "Task alredy exist";
  //       this.setState({
  //         errors: errors,
  //         taskExist: data.isExist,
  //       });
  //     } else {
  //       errors.taskName = "";
  //       this.setState({
  //         errors: errors,
  //         taskExist: data.isExist,
  //       });
  //     }
  //   };

  /*==============================
            Model Events
    ===============================*/

  const onOpenModal = () => {
    // this.props.statusEmpty();
    setValues({ ...values, open: true });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
    });
  };

  /*===========================
      Render add task form
  ============================*/

  const renderAddTaskForm = () => {
    const { prevNextIndex, errors } = values;

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
          value={values.taskDesc}
          onChange={handleChange}
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
        <h1 className="font-30-bold mb-61">Edit Task</h1>
        <AddLeadBlueProgressbar
          percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
          skipButtonFrom={totalFormSlides + 1}
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
                <div className="add-lead-prev-icon" onClick={handlePrev}>
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
                <div className="add-lead-next-icon" onClick={handleNext}>
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
              onKeyDown={onFormKeyDown}
            >
              {/* name */}
              {prevNextIndex === 0 && (
                <PopupInputFields
                  htmlFor={"taskName"}
                  type={"text"}
                  labelName={"Name of task?"}
                  id={"taskName"}
                  name={"taskName"}
                  placeholder={"Eg. Make UI changes"}
                  onChange={handleChange}
                  value={values.taskName}
                  maxLength={maxLengths.char30}
                  error={errors.taskName}
                />
              )}
              {prevNextIndex === 1 && (
                // <AddLeadFormAssignRepresentative
                //   id="taskAssignTo"
                //   name="taskAssignTo"
                //   fieldHeading={`Assign the task to`}
                //   onChange={this.handleChange}
                //   onClick={this.handleRepresentativeOnClick}
                //   value={this.state.taskAssignTo}
                //   error={errors.taskAssignTo}
                //   allEmployees={
                //     !isEmpty(this.state.allEmployees) && this.state.allEmployees
                //   }
                //   activeEmployee={this.state.activeEmployee}
                // />

                <AddMemberSelectAndDisplayList
                  customText="Assign the task to"
                  customSelectedText="Selected"
                  selectedOptionValue={values.selectOption}
                  handleChangeSelectClient={handleChangeSelectClient}
                  options={values.optionsAssignTo}
                  displayListSelected={values.displayListSelected}
                  handleRemoveMember={handleRemoveMember}
                  error={values.displayListSelectedError}
                />
              )}
              {/* Description of task */}
              {prevNextIndex === 2 && taskDescriptionField}
              {/* Duration of task */}
              {prevNextIndex === 3 && (
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
                      selected={values.fromDate}
                      selectsStart
                      startDate={values.fromDate}
                      endDate={values.toDate}
                      onChange={handleChangeFromDate}
                      onChangeRaw={handleDateChangeRaw}
                      minDate={new Date()}
                    />
                    <span className="font-18-medium">to</span>
                    <DatePicker
                      selected={values.toDate}
                      selectsEnd
                      startDate={values.fromDate}
                      endDate={values.toDate}
                      onChange={handleChangeToDate}
                      minDate={values.fromDate}
                      onChangeRaw={handleDateChangeRaw}
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
                      onClick={handleSubmit}
                      onKeyDown={handleSubmitOnKeyDown}
                      className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                    >
                      Save
                    </button>
                  </div>
                </Fragment>
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

  return (
    <>
      <button className={props.addTaskButtonClassName} onClick={onOpenModal}>
        {props.addTaskButtonText}
      </button>

      <Modal
        open={values.open}
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
        {renderAddTaskForm()}
      </Modal>
    </>
  );
}

EditTaskModal.defaultProps = {
  addTaskButtonClassName: "",
};
